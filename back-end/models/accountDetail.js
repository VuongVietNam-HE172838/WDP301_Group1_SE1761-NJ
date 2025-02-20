const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountDetailSchema = new Schema({
  account_id: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  full_name: { type: String, required: true },
  phone_number: { type: String, required: false },
  birth_of_date: { type: Date, required: false },
  id_number: { type: String, required: false },
  gender: { type: String, required: false },
  address: { type: String, required: false },
  profile_picture: { type: String, required: false }
});

const AccountDetail = mongoose.model('AccountDetail', accountDetailSchema);

module.exports = AccountDetail;