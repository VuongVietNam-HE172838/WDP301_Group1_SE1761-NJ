require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import all models
const Account = require('./account');
const AccountDetail = require('./accountDetail');
const Role = require('./role');

const createDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/wdp");

    // Create collections
    await Account.createCollection();
    await AccountDetail.createCollection();
    await Role.createCollection();

    // Insert roles
    const roles = [
      { name: 'ADMIN' },
      { name: 'USER' },
      { name: 'STAFF' }
    ];
    const insertedRoles = await Role.insertMany(roles);

    // Find ADMIN role
    const adminRole = insertedRoles.find(role => role.name === 'ADMIN');

    // Hash password
    const hashedPassword = await bcrypt.hash('adminpassword', 10);

    // Insert admin account
    const adminAccount = new Account({
      user_name: 'admin@gmail.com',
      role_id: adminRole._id,
      password: hashedPassword,
      start_working: new Date(),
      isVerified: true
    });
    await adminAccount.save();

    // Create AccountDetail for admin account
    const adminAccountDetail = new AccountDetail({
      account_id: adminAccount._id,
      full_name: 'Admin User',
      phone_number: '123456789',
      birth_of_date: new Date('1990-01-01'),
      id_number: '123456789',
      gender: 'Male',
      address: 'Admin Address',
      profile_picture: ''
    });
    await adminAccountDetail.save();

    mongoose.connection.close();
  } catch (err) {
    console.error('Error creating collections:', err.message);
    process.exit(1);
  }
};

createDatabase();