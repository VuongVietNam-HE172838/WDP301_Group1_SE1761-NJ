const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  cart_id: { type: Schema.Types.ObjectId, ref: 'Cart', required: true },
  dish_id: { type: Schema.Types.ObjectId, ref: 'Dish', required: true },
  quantity: { type: Number, required: true },
  note: { type: String, required: false }
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;