const express = require('express');
const controller = require('../controllers/invoiceController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.route('/').get(controller.getInvoices).post(authorize('admin', 'staff'), controller.createInvoice);
router.get('/:id/pdf', controller.downloadInvoicePdf);
router.put('/:id/payment', authorize('admin', 'staff'), controller.updatePayment);
router.route('/:id').get(controller.getInvoice).put(authorize('admin', 'staff'), controller.updateInvoice).delete(authorize('admin'), controller.deleteInvoice);

module.exports = router;
