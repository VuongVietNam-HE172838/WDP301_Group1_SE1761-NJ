const Order = require('../models/order');
const Bill = require('../models/bill');
const Dish = require('../models/dish');
const Account = require('../models/account');
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
                item_id: item._id,
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
        const orders = await Order.find({ order_type: 'counter' }).populate('bill');
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching staff orders', error });
    }
};

module.exports = {
    createOrder,
    getStaffOrders
};