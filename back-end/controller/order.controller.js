const Order = require('../models/order');
const Bill = require('../models/bill');
const Dish = require('../models/dish');
const Account = require('../models/account');
const AccountDetail = require('../models/accountDetail');
const jwt = require('jsonwebtoken');

const createOrder = async (req, res) => {
    try {
        const { items, order_type, total_price, user_info, delivery_method, delivery_time } = req.body;
        const user = req.user;

        console.log('Creating order for user:', user);

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
            isPaid: false // Ensure isPaid is false
        });

        console.log('New bill:', newBill);

        await newBill.save();

        console.log('Bill saved successfully');

        // Create a new order
        const newOrder = new Order({
            bill: newBill._id,
            order_by: user._id,
            order_type,
            status: 'on going' // Set order status to on going
        });

        console.log('New order:', newOrder);

        await newOrder.save();

        console.log('Order saved successfully');

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order', error });
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
            });

        // Fetch full_name from AccountDetail and add it to each bill
        // for (const order of orders) {
        //     const accountDetail = await AccountDetail.findOne({ account_id: order.bill.user_id });
        //     if (accountDetail) {
        //         order.bill.customer_name = accountDetail.full_name;
        //     }
        // }

        console.log('Staff orders with populated data:', orders);

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
        const { status } = req.body;

        console.log('Updating order status:', orderId, status);

        if (!['done', 'on going', 'cancel'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Failed to update order status', error });
    }
};

const getOnlinePaidOrders = async (req, res) => {
    try {
        const orders = await Order.find({ order_type: 'online' })
            .populate({
                path: 'bill',
                // match: { isPaid: true }, // Only fetch paid bills
                populate: [
                    { path: 'user_id', model: 'Account' },
                    { path: 'items.item_id', model: 'Dish' }
                ]
            });

        console.log('Online paid orders with populated data:', orders);

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching online paid orders:', error);
        res.status(500).json({ message: 'Error fetching online paid orders', error });
    }
};

module.exports = {
    createOrder,
    getStaffOrders,
    getOrderDetails,
    updateOrderStatus,
    getOnlinePaidOrders // Export the new function
};