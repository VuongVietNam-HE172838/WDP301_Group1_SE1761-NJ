const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishSchema = new Schema({
  name: { type: String, required: true },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String, required: true },
  optional: {
    size: { type: String, optional: true },
    price: { type: Number, optional: true }
  },
  created_at: { type: Date, default: Date.now },
  created_by: { type: Schema.Types.ObjectId, ref: 'AccountDetail', required: true },
  updated_at: { type: Date, default: Date.now },
  updated_by: { type: Schema.Types.ObjectId, ref: 'AccountDetail', required: true },
  img: {type: String},
  quantity: {type: Number}
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;