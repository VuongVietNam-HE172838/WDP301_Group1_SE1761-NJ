const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workScheduleSchema = new Schema({
  account_detail_id: { type: Schema.Types.ObjectId, ref: 'AccountDetail', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  working_days: [{
    shift_id: { type: Schema.Types.ObjectId, ref: 'Shift', required: true },
    date: { type: Date, required: true },
    check_in_at: { type: Date, required: true },
    check_out_at: { type: Date, required: true }
  }]
});

const WorkSchedule = mongoose.model('WorkSchedule', workScheduleSchema);

module.exports = WorkSchedule;