require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import all models
const Account = require('./account');
const AccountDetail = require('./accountDetail');
const Role = require('./role');

const createDatabase = async () => {
  try {
    // await mongoose.connect("mongodb+srv://quanpdhe170415:aEjUnpW2mk3nqVYX@wdp.qcw4k.mongodb.net/wdp?retryWrites=true&w=majority&appName=Cluster0");
    await mongoose.connect("mongodb://localhost:27017/wdp");
    console.log('MongoDB connected');

    // Create collections
    await Account.createCollection();
    await AccountDetail.createCollection();
    await Role.createCollection();

    // Insert roles
    const roles = [
      { name: 'ADMIN' },
      { name: 'USER' }
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

    console.log('Collections created, roles and admin account inserted successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error creating collections:', err.message);
    process.exit(1);
  }
};

createDatabase();