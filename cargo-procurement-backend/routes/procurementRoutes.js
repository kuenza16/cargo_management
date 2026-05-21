const express = require('express');
const controller = require('../controllers/procurementController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.route('/').get(controller.getProcurements).post(authorize('admin', 'staff'), controller.createProcurement);
router.route('/:id').get(controller.getProcurement).put(authorize('admin', 'staff'), controller.updateProcurement).delete(authorize('admin'), controller.deleteProcurement);

module.exports = router;
