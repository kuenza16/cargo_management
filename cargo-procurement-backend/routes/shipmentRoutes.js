const express = require('express');
const controller = require('../controllers/shipmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const router = express.Router();

router.get('/track/:trackingNo', controller.trackShipment);

router.use(protect);
router.route('/').get(controller.getShipments).post(authorize('admin', 'staff'), controller.createShipment);
router.put('/:id/status', authorize('admin', 'staff'), controller.updateShipmentStatus);
router.post('/:id/documents', authorize('admin', 'staff'), upload.array('documents', 10), controller.uploadShipmentDocuments);
router.route('/:id').get(controller.getShipment).put(authorize('admin', 'staff'), controller.updateShipment).delete(authorize('admin'), controller.deleteShipment);

module.exports = router;
