const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredienceSchema = new Schema({
  name: { type: String, required: true },
  quantity_unit: { type: String, required: true }
});

const Ingredience = mongoose.model('Ingredience', ingredienceSchema);

module.exports = Ingredience;