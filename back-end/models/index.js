const mongoose = require("mongoose");

const account = require("./account");
const accountDetail = require("./accountDetail");
const role = require("./role");
const bill = require("./bill");
const billImportGood = require("./billImportGood");
const blog = require("./blog");
const category = require("./category");
const dish = require("./dish");
const ingredient = require("./ingredience");
const menu = require("./menu");
const order = require("./order");
const qa = require("./qa");
const salaryFactor = require("./salaryFactor");
const shift = require("./shift");
const shiftDetail = require("./shiftDetail");
const table = require("./table");
const workSchedule = require("./workSchedule");

mongoose.Promise = global.Promise;

const db = {
  account: account,
  accountDetail: accountDetail,
  role: role,
  bill: bill,
  billImportGood: billImportGood,
  blog: blog,
  category: category,
  dish: dish,
  ingredient: ingredient,
  menu: menu,
  order: order,
  qa: qa,
  salaryFactor: salaryFactor,
  shift: shift,
  shiftDetail: shiftDetail,
  table: table,
  workSchedule: workSchedule,
};


// Function to connect to MongoDB
db.connectDB = async () => {
    try {
      // Determine whether to use Atlas or Local MongoDB
      const mongoURI = process.env.USE_ATLAS === "true" ? process.env.MONGO_URI : process.env.MONGO_LOCAL_URL;
  
      await mongoose.connect(mongoURI, {
        dbName: process.env.DB_NAME, // Set the database name
      });
  
      console.log(`Successfully connected to MongoDB: ${process.env.DB_NAME}`);
    } catch (err) {
      console.error("Error connecting to MongoDB:", err.message);
      process.exit(1);
    }
  };
  
  module.exports = db;