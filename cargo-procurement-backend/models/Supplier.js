const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    supplierName: { type: String, required: true },
    companyName: { type: String },
    email: { type: String },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String },
    productCategories: [{ type: String }],
    paymentTerms: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Supplier', supplierSchema);
