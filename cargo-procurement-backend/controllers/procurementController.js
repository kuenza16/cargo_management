const Procurement = require('../models/Procurement');
const generateNumber = require('../utils/numberGenerator');

exports.createProcurement = async (req, res) => {
  try {
    req.body.requestNo = req.body.requestNo || generateNumber('PR');
    req.body.createdBy = req.user?._id;
    const procurement = await Procurement.create(req.body);
    res.status(201).json({ success: true, data: procurement });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getProcurements = async (req, res) => {
  try {
    const procurements = await Procurement.find()
      .populate('customerId supplierId createdBy')
      .sort('-createdAt');
    res.json({ success: true, count: procurements.length, data: procurements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProcurement = async (req, res) => {
  try {
    const procurement = await Procurement.findById(req.params.id).populate('customerId supplierId createdBy');
    if (!procurement) return res.status(404).json({ success: false, message: 'Procurement not found' });
    res.json({ success: true, data: procurement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProcurement = async (req, res) => {
  try {
    const procurement = await Procurement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!procurement) return res.status(404).json({ success: false, message: 'Procurement not found' });
    res.json({ success: true, data: procurement });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteProcurement = async (req, res) => {
  try {
    const procurement = await Procurement.findByIdAndDelete(req.params.id);
    if (!procurement) return res.status(404).json({ success: false, message: 'Procurement not found' });
    res.json({ success: true, message: 'Procurement deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
