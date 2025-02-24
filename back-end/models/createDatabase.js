require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import all models
const Account = require('./account');
const AccountDetail = require('./accountDetail');
const Role = require('./role');
const Bill = require('./bill');
const BillImportGood = require('./billImportGood');
const Blog = require('./blog');
const Category = require('./category');
const Dish = require('./dish');
const Ingredience = require('./ingredience');
const Menu = require('./menu');
const Order = require('./order');
const QA = require('./qa');
const SalaryFactor = require('./salaryFactor');
const Shift = require('./shift');
const ShiftDetail = require('./shiftDetail');
const Table = require('./table');
const WorkSchedule = require('./workSchedule');

const createDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/FUHotPot';
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');

    // Create collections
    await Account.createCollection();
    await AccountDetail.createCollection();
    await Role.createCollection();
    await Bill.createCollection();
    await BillImportGood.createCollection();
    await Blog.createCollection();
    await Category.createCollection();
    await Dish.createCollection();
    await Ingredience.createCollection();
    await Menu.createCollection();
    await Order.createCollection();
    await QA.createCollection();
    await SalaryFactor.createCollection();
    await Shift.createCollection();
    await ShiftDetail.createCollection();
    await Table.createCollection();
    await WorkSchedule.createCollection();

    // Insert roles
    const roles = [
      { name: 'ADMIN' },
      { name: 'WAITER' },
      { name: 'ACCOUNTANCE' },
      { name: 'HRANDA' }
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