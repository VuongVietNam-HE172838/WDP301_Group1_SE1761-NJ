const AccountDetail = require('../models/accountDetail');
const multer = require('multer')
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const cloudinary = require("../configs/cloudinary")

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'ImgUser',
    allowedFormats: ['jdp', 'png', 'jpeg'],
    transformation: [{width: 500, height: 500, crop: 'limit'}]
})

const upload = multer({
    storage: storage
})


const getUserInformation = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(`User ID from token: ${userId}`); // Log the userId

    const userInfo = await AccountDetail.findOne({ account_id: userId }).populate('account_id');
    console.log('User info:', userInfo); // Log the userInfo

    if (!userInfo) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(userInfo);
  } catch (error) {
    console.error('Error fetching user information:', error.message); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserInformation2 = async (req, res) => {
  try {
    const userId = req.user._id;
    const { full_name, phone_number, birth_of_date, id_number, gender, address, profile_picture } = req.body;

    const updatedUserInfo = await AccountDetail.findOneAndUpdate(
      { account_id: userId },
      { full_name, phone_number, birth_of_date, id_number, gender, address, profile_picture },
      { new: true, runValidators: true }
    );

    if (!updatedUserInfo) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUserInfo);
  } catch (error) {
    console.error('Error updating user information:', error.message); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};

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

module.exports = { getUserInformation, updateUserInformation, upload };