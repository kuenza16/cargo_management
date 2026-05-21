const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');
const Procurement = require('../models/Procurement');
const Shipment = require('../models/Shipment');
const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');

exports.getSummary = async (req, res) => {
  try {
    const [customers, suppliers, procurements, shipments, invoices, expenses] = await Promise.all([
      Customer.countDocuments(),
      Supplier.countDocuments(),
      Procurement.countDocuments(),
      Shipment.countDocuments(),
      Invoice.find(),
      Expense.find()
    ]);

    const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.grandTotal || 0), 0);
    const paidRevenue = invoices.reduce((sum, inv) => sum + Number(inv.paidAmount || 0), 0);
    const pendingRevenue = totalRevenue - paidRevenue;
    const totalExpense = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

    const activeShipments = await Shipment.countDocuments({ status: { $nin: ['Delivered', 'Cancelled'] } });
    const deliveredShipments = await Shipment.countDocuments({ status: 'Delivered' });

    res.json({
      success: true,
      data: {
        customers,
        suppliers,
        procurements,
        shipments,
        activeShipments,
        deliveredShipments,
        totalRevenue,
        paidRevenue,
        pendingRevenue,
        totalExpense,
        profitEstimate: paidRevenue - totalExpense
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
