const mongoose = require('mongoose');
require('dotenv').config();

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

mongoose.Promise = global.Promise;

const db = {
  Account,
  AccountDetail,
  Role,
  Bill,
  BillImportGood,
  Blog,
  Category,
  Dish,
  Ingredience,
  Menu,
  Order,
  QA,
  SalaryFactor,
  Shift,
  ShiftDetail,
  Table,
  WorkSchedule,
};

db.connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/FUHotPot';
    console.log(`Connecting to MongoDB: ${process.env.MONGODB_URI}`);
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Successfully connected to MongoDB: ${process.env.DB_NAME}`);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = db;