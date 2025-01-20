require('dotenv').config();
const mongoose = require('mongoose');

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
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';
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
    await Role.insertMany(roles);
    console.log('Collections created successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error creating collections:', err.message);
    process.exit(1);
  }
};

createDatabase();