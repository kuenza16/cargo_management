const PDFDocument = require('pdfkit');
const Invoice = require('../models/Invoice');
const generateNumber = require('../utils/numberGenerator');

exports.createInvoice = async (req, res) => {
  try {
    req.body.invoiceNo = req.body.invoiceNo || generateNumber('INV');
    const invoice = await Invoice.create(req.body);
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('customerId shipmentId procurementId').sort('-createdAt');
    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('customerId shipmentId procurementId');
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { paidAmount } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    invoice.paidAmount = Number(paidAmount || 0);
    await invoice.save();
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.downloadInvoicePdf = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('customerId shipmentId');
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${invoice.invoiceNo}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text('Cargo Procurement Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice No: ${invoice.invoiceNo}`);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
    doc.text(`Customer: ${invoice.customerId?.customerName || ''}`);
    doc.text(`Phone: ${invoice.customerId?.phone || ''}`);
    if (invoice.shipmentId) doc.text(`Tracking No: ${invoice.shipmentId.trackingNo}`);
    doc.moveDown();

    doc.fontSize(13).text('Items', { underline: true });
    doc.moveDown(0.5);
    invoice.items.forEach((item, index) => {
      doc.fontSize(11).text(`${index + 1}. ${item.description} | Qty: ${item.quantity} | Rate: ${item.rate} | Amount: ${item.amount}`);
    });

    doc.moveDown();
    doc.text(`Subtotal: ${invoice.currency} ${invoice.subtotal}`);
    doc.text(`Tax: ${invoice.currency} ${invoice.tax}`);
    doc.text(`Discount: ${invoice.currency} ${invoice.discount}`);
    doc.fontSize(14).text(`Grand Total: ${invoice.currency} ${invoice.grandTotal}`);
    doc.text(`Paid Amount: ${invoice.currency} ${invoice.paidAmount}`);
    doc.text(`Payment Status: ${invoice.paymentStatus}`);
    doc.moveDown();
    doc.fontSize(10).text('Thank you for your business.', { align: 'center' });
    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
