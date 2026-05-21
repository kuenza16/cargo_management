const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    rate: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, unique: true, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    shipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment' },
    procurementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Procurement' },
    items: [invoiceItemSchema],
    currency: { type: String, enum: ['BTN', 'INR', 'USD', 'CNY'], default: 'BTN' },
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['Unpaid', 'Partial', 'Paid'], default: 'Unpaid' },
    dueDate: { type: Date },
    note: { type: String }
  },
  { timestamps: true }
);

invoiceSchema.pre('validate', function (next) {
  this.items = this.items.map((item) => ({
    ...item.toObject?.() || item,
    amount: Number(item.quantity) * Number(item.rate)
  }));
  this.subtotal = this.items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  this.grandTotal = this.subtotal + Number(this.tax || 0) - Number(this.discount || 0);
  if (this.paidAmount <= 0) this.paymentStatus = 'Unpaid';
  else if (this.paidAmount < this.grandTotal) this.paymentStatus = 'Partial';
  else this.paymentStatus = 'Paid';
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
