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

exports.findAll = async (req, res) => {
    try {
        const bills = await bill.find();
        res.status(200).json(bills);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.findOne = async (req, res) => {
    const id = req.params.id;
    try {
        const oneBill = await bill.findById
        (id);
        res.status(200).json(oneBill);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.update = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedBill = await bill.findByIdAndUpdate(id, req.body , {new: true});
        res.status(200).json(updatedBill);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await bill.findByIdAndDelete(id);
        res.status(200).json({message: 'Deleted successfully'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.createOrder = async (req, res) => {
    const {order_id, dish_id, quantity} = req.body;
    try {
        const newOrder = new order({
        order_id,
        dish_id,
        quantity
        });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    };

exports.sendOrder = async (req, res) => {
    try {
        const orders = await order.find();
        res.status(200).json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.findOrder = async (req, res) => {
    const id = req.params.id;
    try {
        const oneOrder = await order.findById
        (id);
        res.status(200).json(oneOrder);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.updateOrder = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedOrder = await order.findByIdAndUpdate (id, req.body , {new: true});
        res.status(200).json(updatedOrder);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.deleteOrder = async (req, res) => {
    const id = req.params.id;
    try {
        await order.findByIdAndDelete(id);
        res.status(200).json({message: 'Deleted successfully'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.createDish = async (req, res) => {
    const {name, price, description, image} = req.body;
    try {
        const newDish = new dish({
        name,
        price,
        description,
        image
        });
        await newDish.save();
        res.status(201).json(newDish);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    };

exports.sendDish = async (req, res) => {
    try {
        const dishes = await dish.find();
        res.status(200).json(dishes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.findDish = async (req, res) => {
    const id = req.params.id;
    try {
        const oneDish = await dish.findById
        (id);
        res.status(200).json(oneDish);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.updateDish = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedDish = await dish.findByIdAndUpdate (id, req.body , {new: true});
        res.status(200).json(updatedDish);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}



    