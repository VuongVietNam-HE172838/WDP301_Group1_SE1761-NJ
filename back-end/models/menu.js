const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
  created_at: { type: Date, default: Date.now },
  created_by: { type: Schema.Types.ObjectId, ref: 'AccountDetail', required: true },
  updated_at: { type: Date, default: Date.now },
  updated_by: { type: Schema.Types.ObjectId, ref: 'AccountDetail', required: true },
  category: {
    category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    dish: {
      dish_id: { type: Schema.Types.ObjectId, ref: 'Dish', required: true }
    }
  }
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;