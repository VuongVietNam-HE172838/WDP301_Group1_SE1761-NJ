const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  customer_name: { type: String, required: false }, // for offline orders
  customer_phone: { type: String, required: false }, // for online orders
  customer_address: { type: String, required: false }, // for online orders
  total_amount: { type: Number, required: true },
  items: [
    {
      item_id: { type: Schema.Types.ObjectId, ref: 'Dish', required: true },
      size: { type: String, required: false },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  delivery_method: { type: String, required: true },
  delivery_time: { type: Date, required: true },
  isPaid: { type: Boolean, default: false }, // Ensure isPaid is false by default
  created_at: { type: Date, default: Date.now },
  use_refund_balance: { type: Boolean, default: false }, // for online orders
  refund_balance: { type: Number, default: 0 }, // for online orders
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;