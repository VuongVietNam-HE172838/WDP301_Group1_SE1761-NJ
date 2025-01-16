const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  table_id: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
  status: { type: String, required: true },
  bill: [{
    dish: {
      dish_id: { type: Schema.Types.ObjectId, ref: 'Dish', required: true },
      price: { type: Number, required: true }
    }
  }],
  order_by: {
    account_detail_id: { type: Schema.Types.ObjectId, ref: 'AccountDetail', required: true }
  },
  updated_at: { type: Date, default: Date.now },
  payment_at: { type: Date }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;