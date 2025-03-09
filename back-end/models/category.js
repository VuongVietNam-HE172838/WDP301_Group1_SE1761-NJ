const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },  
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },  
});


const Category = mongoose.model('Category', categorySchema);

module.exports = Category;