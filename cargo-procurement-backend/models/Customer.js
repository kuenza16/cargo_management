const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true },
    companyName: { type: String },
    email: { type: String },
    phone: { type: String, required: true },
    address: { type: String },
    country: { type: String, default: 'Bhutan' },
    taxNo: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
