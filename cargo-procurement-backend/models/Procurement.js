const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const procurementSchema = new mongoose.Schema(
  {
    requestNo: { type: String, unique: true, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    items: [itemSchema],
    currency: { type: String, enum: ['BTN', 'INR', 'USD', 'CNY'], default: 'BTN' },
    totalAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Requested', 'Approved', 'Purchased', 'Shipped', 'Completed', 'Cancelled'],
      default: 'Requested'
    },
    note: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

procurementSchema.pre('validate', function (next) {
  this.items = this.items.map((item) => ({
    ...item.toObject?.() || item,
    total: Number(item.quantity) * Number(item.unitPrice)
  }));
  this.totalAmount = this.items.reduce((sum, item) => sum + Number(item.total || 0), 0);
  next();
});

module.exports = mongoose.model('Procurement', procurementSchema);
