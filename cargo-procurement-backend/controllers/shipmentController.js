const Shipment = require('../models/Shipment');
const generateNumber = require('../utils/numberGenerator');

exports.createShipment = async (req, res) => {
  try {
    req.body.trackingNo = req.body.trackingNo || generateNumber('TRK');
    req.body.statusHistory = [{ status: req.body.status || 'Pending', location: req.body.originCountry, note: 'Shipment created', updatedBy: req.user?._id }];
    const shipment = await Shipment.create(req.body);
    res.status(201).json({ success: true, data: shipment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().populate('customerId procurementId').sort('-createdAt');
    res.json({ success: true, count: shipments.length, data: shipments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id).populate('customerId procurementId');
    if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
    res.json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.trackShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ trackingNo: req.params.trackingNo }).populate('customerId procurementId');
    if (!shipment) return res.status(404).json({ success: false, message: 'Tracking number not found' });
    res.json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
    res.json({ success: true, data: shipment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateShipmentStatus = async (req, res) => {
  try {
    const { status, location, note } = req.body;
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });

    shipment.status = status;
    if (status === 'Delivered') shipment.deliveredDate = new Date();
    shipment.statusHistory.push({ status, location, note, updatedBy: req.user?._id });
    await shipment.save();

    res.json({ success: true, data: shipment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.uploadShipmentDocuments = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });

    const docs = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path
    }));

    shipment.documents.push(...docs);
    await shipment.save();

    res.json({ success: true, data: shipment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndDelete(req.params.id);
    if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
    res.json({ success: true, message: 'Shipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
