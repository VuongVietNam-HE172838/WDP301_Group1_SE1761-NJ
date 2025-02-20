const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { Account, AccountDetail, Role } = require('../models');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.login = async (req, res) => {
  const { user_name, password } = req.body;

  try {
    const account = await Account.findOne({ user_name });
    if (!account) {
      return res.status(404).json({ message: 'Tài khoản của bạn không tồn tại trong hệ thống!' });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(403).json({ message: 'Mật khẩu không chính xác!' });
    }

    const payload = { accountId: account._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });

    await AccountDetail.findOneAndUpdate({ account_id: account._id }, { refresh_token: refreshToken });

    res.json({ token, refreshToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.googleLogin = async (req, res) => {
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    let account = await Account.findOne({ user_name: email });
    let accountDetail;
    if (!account) {
      // Tìm role USER
      const userRole = await Role.findOne({ name: 'USER' });
      if (!userRole) {
        return res.status(500).json({ message: 'Role USER not found' });
      }

      // Tạo mật khẩu ngẫu nhiên
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      account = new Account({ email, user_name: email, password: hashedPassword, role_id: userRole._id, start_working: new Date() });
      await account.save();

      // Tạo AccountDetail cho tài khoản mới
      accountDetail = new AccountDetail({
        account_id: account._id,
        full_name: name,
        phone_number: '',
        birth_of_date: new Date(),
        id_number: '',
        gender: '',
        address: '',
        profile_picture: '',
        refresh_token: '' // Khởi tạo refresh_token rỗng
      });
      await accountDetail.save();
    } else {
      // Nếu tài khoản đã tồn tại, lấy AccountDetail
      accountDetail = await AccountDetail.findOne({ account_id: account._id });
    }

    const jwtPayload = { accountId: account._id };
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(jwtPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });

    await AccountDetail.findOneAndUpdate({ account_id: account._id }, { refresh_token: refreshToken });

    // Lấy thông tin role của tài khoản
    const role = await Role.findById(account.role_id);

    res.json({ token, refreshToken, accountDetail: { full_name: accountDetail.full_name, role: role.name } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};