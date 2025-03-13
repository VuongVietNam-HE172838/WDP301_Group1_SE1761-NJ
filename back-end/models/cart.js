const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  account_id: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  items: [{ type: Schema.Types.ObjectId, ref: 'CartItem' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;