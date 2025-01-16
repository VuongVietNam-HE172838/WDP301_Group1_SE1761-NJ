const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountDetailSchema = new Schema({
  account_id: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  full_name: { type: String, required: true },
  phone_number: { type: String, required: true },
  birth_of_date: { type: Date, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  profile_picture: { type: String, required: true },
  work_schedule_id: { type: Schema.Types.ObjectId, ref: 'WorkSchedule', required: true },
  salary_factor_id: { type: Schema.Types.ObjectId, ref: 'SalaryFactor', required: true }
});

const AccountDetail = mongoose.model('AccountDetail', accountDetailSchema);

module.exports = AccountDetail;