const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shiftSchema = new Schema({
  name: { type: String, required: true },
  time_range: { type: String, required: true },
  max_number_employee: { type: Number, required: true }
});

const Shift = mongoose.model('Shift', shiftSchema);

module.exports = Shift;