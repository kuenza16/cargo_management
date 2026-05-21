const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema(
  {
    trackingNo: { type: String, unique: true, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    procurementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Procurement' },
    originCountry: { type: String, required: true },
    originAddress: { type: String },
    destination: { type: String, required: true },
    weight: { type: Number, default: 0 },
    packageCount: { type: Number, default: 1 },
    shippingMode: { type: String, enum: ['Road', 'Air', 'Sea', 'Sea + Road'], default: 'Road' },
    status: {
      type: String,
      enum: ['Pending', 'Received', 'In Transit', 'At Border', 'Customs Clearance', 'In Warehouse', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    estimatedDeliveryDate: { type: Date },
    deliveredDate: { type: Date },
    documents: [
      {
        filename: String,
        originalName: String,
        path: String,
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    statusHistory: [
      {
        status: String,
        location: String,
        note: String,
        date: { type: Date, default: Date.now },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shipment', shipmentSchema);
