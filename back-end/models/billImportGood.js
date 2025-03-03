const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billImportGoodSchema = new Schema({
  ingredience: {
    ingredience_id: { type: Schema.Types.ObjectId, ref: 'Ingredience', required: true },
    quantity: { type: Number, required: true },
    unit_price: { type: Number, required: true }
  },
  created_by: { type: Schema.Types.ObjectId, ref: 'AccountDetail', required: true },
  created_at: { type: Date, default: Date.now },
  is_approve_by_accountance: {
    account_detail_id: { type: Schema.Types.ObjectId, ref: 'AccountDetail', required: true },
    status: { type: Boolean, required: true }
  },
  is_approve_by_admin: {
    account_detail_id: { type: Schema.Types.ObjectId, ref: 'AccountDetail', required: true },
    status: { type: Boolean, required: true }
  }
});

const BillImportGood = mongoose.model('BillImportGood', billImportGoodSchema);

module.exports = BillImportGood;