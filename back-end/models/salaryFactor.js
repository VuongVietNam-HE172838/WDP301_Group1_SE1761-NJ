const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salaryFactorSchema = new Schema({
  role_id: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  salary_coefficient: { type: Number, required: true },
  effective_date: { type: Date, required: true },
  created_by: { type: Schema.Types.ObjectId, ref: 'AccountDetail', required: true },
  updated_by: { type: Schema.Types.ObjectId, ref: 'AccountDetail', required: true },
  created_at: { type: Date, default: Date.now }
});

const SalaryFactor = mongoose.model('SalaryFactor', salaryFactorSchema);

module.exports = SalaryFactor;