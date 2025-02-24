const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billSchema = new Schema({
  order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  total_price: { type: Number, required: true },
  created_by: { type: Schema.Types.ObjectId, ref: 'AccountDetail', required: true },
  method: { type: String, required: true },
  customer_phone_num: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;