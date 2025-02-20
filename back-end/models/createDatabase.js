require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import all models
const Account = require('./account');
const AccountDetail = require('./accountDetail');
const Role = require('./role');

const createDatabase = async () => {
  try {
    await mongoose.connect("mongodb+srv://chungdthe176077:WuKZJBD3KEuFjGiE@cluster0.dsxki.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0");
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
      user_name: 'admin',
      role_id: adminRole._id,
      password: hashedPassword,
      start_working: new Date(),
      is_working: true
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