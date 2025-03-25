const mongoose = require('mongoose');
const Bill = require('../models/bill');
const Order = require('../models/order');
const Dish = require('../models/dish');
const CartItem = require('../models/cartItem');
const Cart = require('../models/cart');
const Account = require('../models/account');

exports.callBackPayment = async (req, res) => {
  const data = req.body;
  const content = data.payment.content;
  const billIdMatch = content.match(/[a-f0-9]{24}/); // Tìm chuỗi 24 ký tự hexa (MongoDB ObjectId)
  const billId = billIdMatch ? billIdMatch[0] : null;

  if (!billId) {
    return res.status(400).json({ message: 'Invalid payment content format' });
  }

  try {
    // Find the bill by ID
    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Update the isPaid status of the bill
    bill.isPaid = true;
    await bill.save();

    // Find the order associated with the bill
    const order = await Order.findOne({ bill: billId });
    order.status = 'on going'; // Set order status to on going
    await order.save();

    const cart = await Cart.findOne({ account_id: bill.user_id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const cartItem = await CartItem.find({ cart_id: cart._id });
    // Update the quantity of each dish in the bill and remove items from the cart
    for (const item of bill.items) {
      const dish = await Dish.findById(item.item_id);
      if (dish) {
        dish.quantity -= item.quantity;
        await dish.save();
      }
      // Find the corresponding cart item
      const cartItem = await CartItem.findOne({ dish_id: item.item_id, cart_id: cart._id });
      if (cartItem) {
        if (cartItem.quantity > item.quantity) {
          // Reduce the quantity in the cart
          cartItem.quantity -= item.quantity;
          await cartItem.save();
        } else {
          // Remove the item from the cart
          await CartItem.deleteOne({ _id: cartItem._id });
        }
      }
    }

    // Remove the items from the user's cart
    await Cart.updateOne(
      { account_id: bill.user_id },
      { $pull: { items: { $in: bill.items.map(item => item.item_id) } } }
    );

    res.status(200).json({ message: 'Payment processed and quantities updated' });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createBill = async (req, res) => {
  try {
    const { cartItems, deliveryMethod, deliveryTime, orderType } = req.body;
    const userId = req.user.accountId;

    const totalAmount = cartItems.reduce((total, item) => total + item.optional.price * item.quantity, 0);

    const items = cartItems.map(item => ({
      item_id: item.id,
      quantity: item.quantity,
      price: item.optional.price,
    }));

    const newBill = new Bill({
      user_id: userId,
      total_amount: totalAmount,
      items,
      delivery_method: deliveryMethod,
      delivery_time: new Date(deliveryTime),
    });

    await newBill.save();

    const newOrder = new Order({
      status: 'pending',
      bill: newBill._id,
      order_by: userId,
      order_type: orderType, // Set order type
    });

    await newOrder.save();

    res.status(201).json({ message: 'Bill and order created successfully', bill: newBill, order: newOrder });
  } catch (error) {
    console.error('Error creating bill and order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.checkPaymentStatus = async (req, res) => {
  const { billId } = req.params;

  try {
    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.status(200).json({ isPaid: bill.isPaid });
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};