const Order = require('../models/order');
const Bill = require('../models/bill');
const Dish = require('../models/dish');
const Account = require('../models/account');
const AccountDetail = require('../models/accountDetail');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const createOrder = async (req, res) => {
    try {
        const { items, order_type, total_price, user_info, delivery_method, delivery_time, payment_method, use_refund_balance, refund_balance } = req.body;
        const user = req.user;

        // Create a new bill
        const newBill = new Bill({
            user_id: user._id,
            customer_name: user_info.full_name,
            customer_phone: user_info.phone_number,
            customer_address: user_info.address,
            total_amount: total_price,
            items: items.map(item => ({
                item_id: item.id,
                quantity: item.quantity,
                price: item.optional?.price || 0
            })),
            delivery_method,
            delivery_time,
            isPaid: total_price === 0 || payment_method === 'cash', // Set isPaid to true if payment method is cash
            use_refund_balance: use_refund_balance || false, // Set use_refund_balance based on the request
            refund_balance: refund_balance || 0 // Set refund_balance based on the request
        });

        await newBill.save();

        // Deduct quantity from Dish if payment method is cash
        if (payment_method === 'cash') {
            for (const item of newBill.items) {
                const dish = await Dish.findById(item.item_id);
                if (dish) {
                    dish.quantity -= item.quantity; // Deduct the quantity
                    if (dish.quantity < 0) {
                        return res.status(400).json({ message: `Not enough stock for ${dish.name}` });
                    }
                    await dish.save();
                }
            }
        }

        // Create a new order
        const newOrder = new Order({
            bill: newBill._id,
            order_by: user._id,
            order_type,
            status: 'on going' // Set order status to on going
        });

        if (total_price === 0 && use_refund_balance) {
            const account = await Account.findById(user._id);
            if (account) {
                account.refund_balance -= refund_balance; // Deduct the refund balance from the user's account
                await account.save();
            }
        }

        await newOrder.save();

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order', error });
    }
};

const confirmPayment = async (req, res) => {
    try {
        const { orderId, payment_method } = req.body;

        const order = await Order.findById(orderId).populate('bill');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (payment_method !== 'cash' && payment_method !== 'qr') {
            return res.status(400).json({ message: 'Invalid payment method' });
        }

        order.bill.isPaid = true;
        await order.bill.save();

        if (payment_method === 'cash') {
            for (const item of order.bill.items) {
                const dish = await Dish.findById(item.item_id);
                console.log('dish.quantity: ', dish.quantity);
                if (dish) {
                    dish.quantity -= item.quantity; // Deduct the quantity
                    if (dish.quantity < 0) {
                        return res.status(400).json({ message: `Not enough stock for ${dish.name}` });
                    }
                    await dish.save();
                }
                console.log('dish.quantity: ', dish.quantity);
            }
            
        }

        
        res.status(200).json({ message: `Payment confirmed by ${payment_method}`, order });
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({ message: 'Failed to confirm payment', error });
    }
};

const getStaffOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: 'bill',
                populate: [
                    { path: 'user_id', model: 'Account' },
                    { path: 'items.item_id', model: 'Dish' }
                ]
            }).sort({ updated_at: -1 });

        // Fetch full_name from AccountDetail and add it to each bill
        // for (const order of orders) {
        //     const accountDetail = await AccountDetail.findOne({ account_id: order.bill.user_id });
        //     if (accountDetail) {
        //         order.bill.customer_name = accountDetail.full_name;
        //     }
        // }

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching staff orders:', error);
        res.status(500).json({ message: 'Error fetching staff orders', error });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId)
            .populate({
                path: 'bill',
                populate: [
                    { path: 'user_id', model: 'Account' },
                    { path: 'items.item_id', model: 'Dish' }
                ]
            });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ order });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Error fetching order details', error });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, note } = req.body;

        console.log('Updating order status:', orderId, status);

        if (!['done', 'on going', 'cancel'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(orderId).populate({
            path: 'bill',
            populate: [
                { path: 'user_id', model: 'Account' }, // Populate user details
                { path: 'items.item_id', model: 'Dish' } // Populate item_id with Dish details
            ]
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the order status
        order.status = status;
        if (status === 'cancel') {
            order.note = note; // Save the cancellation reason
        }
        await order.save();

        const bill = await Bill.findById(order.bill._id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        } else {
            if (bill.use_refund_balance && status === 'cancel') {
                const account = await Account.findById(bill.user_id);
                if (account) {
                    account.refund_balance += bill.refund_balance; // Refund the balance to the user's account
                    await account.save();
                }
            }
        }

        // Handle refund if the order is canceled
        if (status === 'cancel') {
            const user = await Account.findById(order.bill.user_id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Generate order details for the email
            const customerEmail = user.user_name; // Get the customer's email
            const customerName = order.bill.customer_name; // Get the customer's name
            const orderDetails = order.bill.items.map(item =>
                `- ${item.item_id.name}: ${item.quantity} x ${item.price.toLocaleString()} đ`
            ).join('<br>');

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: `"Ordering System" <${process.env.EMAIL_USER}>`,
                to: customerEmail,
                subject: 'Thông báo hủy đơn hàng và hoàn tiền',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #dc3545; text-align: center;">Đơn hàng đã bị hủy</h2>
                        <p>Xin chào ${customerName},</p>
                        <p>Đơn hàng của bạn với mã <strong>${orderId}</strong> đã bị hủy. Dưới đây là chi tiết đơn hàng:</p>
                        <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin: 20px 0;">
                            ${orderDetails}
                        </div>
                        <p>Lý do hủy đơn hàng: <strong>${note}</strong></p>
                        <p>Số tiền <strong>${(order.bill.total_amount + order.bill.refund_balance).toLocaleString()} đ</strong> sẽ được hoàn vào tài khoản của bạn muộn nhất là trong 24 giờ tới. Bạn có thể sử dụng số tiền này cho lần mua hàng tiếp theo.</p>
                        <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email này.</p>
                        <p>Trân trọng,</p>
                        <p>Đội ngũ hỗ trợ khách hàng</p>
                    </div>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
        }

        // Handle email notification if the order is marked as done
        if (status === 'done') {
            const user = await Account.findById(order.bill.user_id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const customerEmail = user.user_name; // Get the customer's email
            const customerName = order.bill.customer_name; // Get the customer's name

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: `"Ordering System" <${process.env.EMAIL_USER}>`,
                to: customerEmail,
                subject: 'Thông báo đơn hàng đã hoàn thành',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #28a745; text-align: center;">Đơn hàng đã hoàn thành</h2>
                        <p>Xin chào ${customerName},</p>
                        <p>Đơn hàng của bạn với mã <strong>${orderId}</strong> đã được hoàn thành thành công. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
                        <p>Chúng tôi rất mong nhận được đánh giá của bạn để cải thiện chất lượng dịch vụ trong tương lai.</p>
                        <p>Vui lòng đăng nhập và gửi đánh giá tại đường link sau:</p>
                        <p><a href="http://localhost:3000/order-history" style="color: #007bff;">Đánh giá</a></p>
                        <p>Trân trọng,</p>
                        <p>Đội ngũ hỗ trợ khách hàng</p>
                    </div>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
        }

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Failed to update order status', error });
    }
};

const getOnlinePaidOrders = async (req, res) => {
    try {
        const userId = req.user._id; // Get the logged-in user's ID

        const orders = await Order.find({ order_type: 'online', order_by: userId }) // Filter by user ID
            .populate({
                path: 'bill',
                match: { isPaid: true }, // Only fetch paid bills
                populate: [
                    { path: 'user_id', model: 'Account' },
                    { path: 'items.item_id', model: 'Dish' }
                ]
            }).sort({ updated_at: -1 }); // Sort by updated_at in descending order;

        // Filter out orders where the bill is null (because isPaid was false)
        const filteredOrders = orders.filter(order => order.bill !== null);

        res.status(200).json({ orders: filteredOrders });
    } catch (error) {
        console.error('Error fetching online paid orders:', error);
        res.status(500).json({ message: 'Error fetching online paid orders', error });
    }
};

const getAllOrders = async (req, res) => {
    try {
        console.log('get all orders');
        const allOrders = await Order.find()
        const orders = await Order.find()
            .populate({
                path: 'bill',
                populate: [
                    { path: 'user_id', model: 'Account' },
                    { path: 'items.item_id', model: 'Dish' }
                ]
            }).sort({ updated_at: -1 });

        console.log('all orders: ', allOrders);

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching staff orders:', error);
        res.status(500).json({ message: 'Error fetching staff orders', error });
    }
};

module.exports = {
    createOrder,
    getStaffOrders,
    getOrderDetails,
    updateOrderStatus,
    getOnlinePaidOrders,
    confirmPayment,
    getAllOrders
};