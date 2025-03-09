const Order = require('../models/order');
const Bill = require('../models/bill');
const Dish = require('../models/dish');
const Account = require('../models/account');

const createOrder = async (req, res) => {
    try {
        const { items, order_type, total_price } = req.body;
        const user = await Account.findById(req.user._id).populate('role_id');

        // Determine delivery method based on user role
        let delivery_method;
        if (user.role_id.name === 'STAFF') {
            delivery_method = 'dine in';
        } else {
            delivery_method = 'take away';
        }

        // Create a new bill
        const newBill = new Bill({
            user_id: req.user._id,
            total_amount: total_price,
            items: items.map(item => ({
                item_id: item._id,
                quantity: item.quantity,
                price: item.optional?.price || 0
            })),
            delivery_method,
            delivery_time: new Date()
        });
        await newBill.save();

        // Create a new order
        const newOrder = new Order({
            bill: newBill._id,
            order_by: req.user._id,
            order_type,
            status: 'not done'
        });
        await newOrder.save();

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order', error });
    }
};

module.exports = {
    createOrder
};