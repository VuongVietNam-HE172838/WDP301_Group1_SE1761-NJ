const AccountDetail = require('../models/accountDetail');
const multer = require('multer')
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const cloudinary = require("../configs/cloudinary")
const Order = require('../models/order');
const Bill = require('../models/bill');
const Dish = require('../models/dish');
const mongoose = require('mongoose');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'ImgUser',
    allowedFormats: ['jdp', 'png', 'jpeg'],
    transformation: [{width: 500, height: 500, crop: 'limit'}]
})

const upload = multer({
    storage: storage
})



const updateUserInformation = async (req, res) => {
  try {
    const userId = req.user._id;

    // Tìm thông tin người dùng cần cập nhật
    const existingUser = await AccountDetail.findOne({ account_id: userId });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    let updatedData = { ...req.body };

    // Nếu có file ảnh mới, upload lên Cloudinary
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'ImgUser'
        });
        updatedData.profile_picture = result.secure_url;
      } catch (uploadError) {
        return res.status(500).json({ message: 'Lỗi upload ảnh', error: uploadError });
      }
    }

    // Cập nhật thông tin người dùng với dữ liệu mới
    const updatedUserInfo = await AccountDetail.findOneAndUpdate(
      { account_id: userId },
      updatedData,
      { new: true, runValidators: true }
    );

    res.json(updatedUserInfo);
  } catch (error) {
    console.error('Error updating user information:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


const getUserInformation = async (req, res) => {
  try {
    const userId = req.user._id;

    const userInfo = await AccountDetail.findOne({ account_id: userId }).populate('account_id');

    if (!userInfo) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserOrderHistory1 = async (req, res) => {
  try {
    const userId = req.user._id;

    const userOrders = await Order.find({ order_by: userId })
    .populate({
      path: 'bill',
      populate: {
        path: 'items.item_id',
        model: 'Dish'
      }
    })
    .populate({
      path: 'order_by',
      model: 'AccountDetail'
    });


  if (!userOrders || userOrders.length === 0) {
    return [];
  }

  res.status(200).json(userOrders.map(order => ({
    items: order.bill.items.map(item => ({
      name: item.item_id.name,
      img: item.item_id.img,
      quantity: item.quantity,
      price: item.price
    })),
    totalAmount: order.bill.total_amount,
    status: order.status,
    orderTime: order.updated_at,
    isPaid: order.bill.isPaid
  })));
  } catch (error) {
    console.error('Error fetching user information:', error.message); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};

// Hàm lấy lịch sử đơn hàng của người dùng
const getUserOrderHistory = async (userId) => {
  try {

    const userOrders = await Order.find({ order_by: userId })
      .populate({
        path: 'bill',
        populate: {
          path: 'items.item_id',
          model: 'Dish'
        }
      });

    if (!userOrders || userOrders.length === 0) {
      throw new Error('No orders found');
    }

    const formattedOrders = userOrders.map(order => {
      return {
        items: order.bill.items.map(item => ({
          name: item.item_id.name,
          image: item.item_id.img,
          quantity: item.quantity,
          price: item.price
        })),
        orderTime: order.updated_at,
        status: order.status,
        totalAmount: order.bill.total_amount
      };
    });

    return formattedOrders;
  } catch (error) {
    console.error('Error fetching user orders:', error.message); // Log the error
    throw error;
  }
};


module.exports = { getUserInformation, updateUserInformation, upload , getUserOrderHistory1};