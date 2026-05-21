const express = require('express');
const controller = require('../controllers/supplierController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.route('/').get(controller.getSuppliers).post(authorize('admin', 'staff'), controller.createSupplier);
router.route('/:id').get(controller.getSupplier).put(authorize('admin', 'staff'), controller.updateSupplier).delete(authorize('admin'), controller.deleteSupplier);

module.exports = router;
