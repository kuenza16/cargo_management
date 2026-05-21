const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    shipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment' },
    procurementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Procurement' },
    type: { type: String, enum: ['Fuel', 'Customs', 'Warehouse', 'Driver', 'Packaging', 'Other'], required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ['BTN', 'INR', 'USD', 'CNY'], default: 'BTN' },
    note: { type: String },
    date: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
