const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  table_id: { type: Schema.Types.ObjectId, ref: 'Table', required: false }, // Optional for online orders
  status: { type: String, required: true },
  bill: { type: Schema.Types.ObjectId, ref: 'Bill', required: true },
  order_by: { type: Schema.Types.ObjectId, ref: 'AccountDetail', required: true },
  order_type: { type: String, enum: ['counter', 'online'], required: true }, // Add order type
  updated_at: { type: Date, default: Date.now },
  payment_at: { type: Date }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;