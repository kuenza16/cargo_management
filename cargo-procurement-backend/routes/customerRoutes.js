const express = require('express');
const controller = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.route('/').get(controller.getCustomers).post(authorize('admin', 'staff'), controller.createCustomer);
router.route('/:id').get(controller.getCustomer).put(authorize('admin', 'staff'), controller.updateCustomer).delete(authorize('admin'), controller.deleteCustomer);

module.exports = router;
