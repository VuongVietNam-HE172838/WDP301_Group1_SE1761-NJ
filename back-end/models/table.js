const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tableSchema = new Schema({
  table_number: { type: Number, required: true },
  status: { type: String, required: true },
  seat_number: { type: Number, required: true }
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;