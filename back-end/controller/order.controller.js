const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {order, bill, dish} = require('../models');

exports.create = async (req, res) => {
    const {order_id, total_price, created_by, method, customer_phone_num} = req.body;
    try {
        const newBill = new bill({
        order_id,
        total_price,
        created_by,
        method,
        customer_phone_num
        });
        await newBill.save();
        res.status(201).json(newBill);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    };
    