const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const qaSchema = new Schema({
  customer_name: { type: String, required: true },
  phone_number: { type: String, required: true },
  email: { type: String, required: true },
  question: { type: String, required: true },
  status: { type: String, required: true },
  send_at: { type: Date, default: Date.now },
  answer_by: { type: Schema.Types.ObjectId, ref: 'AccountDetail' },
  answer_at: { type: Date }
});

const QA = mongoose.model('QA', qaSchema);

module.exports = QA;