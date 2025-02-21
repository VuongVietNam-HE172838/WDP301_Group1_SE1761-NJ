const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { Account, UsedToken } = require('../models');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const account = await Account.findOne({ user_name: email });
    if (!account) {
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // OTP 6 chữ số
    const token = jwt.sign({ otp, email }, process.env.JWT_SECRET, { expiresIn: '5m' });

    const mailOptions = {
      from: `"Hệ thống tài khoản" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Mã OTP để đặt lại mật khẩu',
      html: `<p>Mã OTP của bạn là: <strong>${otp}</strong></p><p>Mã OTP này sẽ hết hạn sau 5 phút.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error.message);
        return res.status(500).send("Server error");
      }
      res.status(200).json({ message: "Đã gửi OTP đến email của bạn.", token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.verifyOTP = async (req, res) => {
  const { otp, token } = req.body;

  try {
    // Kiểm tra xem token đã được sử dụng hay chưa
    const usedToken = await UsedToken.findOne({ token });
    if (usedToken) {
      return res.status(400).json({ message: "OTP không hợp lệ." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.otp !== otp) {
      return res.status(400).json({ message: "OTP không hợp lệ." });
    }

    // Lưu token vào cơ sở dữ liệu để đánh dấu là đã sử dụng
    await new UsedToken({ token }).save();

    res.status(200).json({ message: "OTP hợp lệ.", email: decoded.email });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: "OTP đã hết hạn." });
    }
    console.error(err.message);
    res.status(500).send("Server error");
  }
};