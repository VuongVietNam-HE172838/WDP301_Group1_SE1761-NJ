const mongoose = require('mongoose');
require('dotenv').config();

const Account = require('./account');
const AccountDetail = require('./accountDetail');
const Role = require('./role');
const UsedToken = require('./usedToken');
const dish = require('./dish');
const order = require('./order');
const bill = require('./bill');

mongoose.Promise = global.Promise;

const db = {
  Account,
  AccountDetail,
  Role,
  UsedToken
};

db.connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URL;
    console.log(`Connecting to MongoDB: ${process.env.MONGODB_URL}`);
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Successfully connected to MongoDB: ${process.env.DB_NAME}`);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = db;