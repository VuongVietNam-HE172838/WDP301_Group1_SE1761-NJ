const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shiftDetailSchema = new Schema({
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  date: { type: Date, required: true },
  shift_detail: {
    shift_id: { type: Schema.Types.ObjectId, ref: 'Shift', required: true },
    account_detail_id: { type: Schema.Types.ObjectId, ref: 'AccountDetail', required: true }
  }
});

const ShiftDetail = mongoose.model('ShiftDetail', shiftDetailSchema);

module.exports = ShiftDetail;