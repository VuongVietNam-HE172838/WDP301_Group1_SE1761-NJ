const mongoose = require('mongoose');
require('dotenv').config();

const Account = require('./account');
const AccountDetail = require('./accountDetail');
const Role = require('./role');
const UsedToken = require('./usedToken');

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
    console.log(`Connecting to MongoDB: ${mongoURI}`);
    
    await mongoose.connect(mongoURI); // Không cần useNewUrlParser, useUnifiedTopology
    
    console.log(`Successfully connected to MongoDB: ${process.env.DB_NAME}`);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};


module.exports = db;