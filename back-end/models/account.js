const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  user_name: { type: String, required: true },
  role_id: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  start_working: { type: Date, required: true },
  is_working: { type: Boolean, default: true },
  updated_at: { type: Date, default: Date.now }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;