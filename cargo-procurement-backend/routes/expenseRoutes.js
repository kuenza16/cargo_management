const express = require('express');
const controller = require('../controllers/expenseController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.route('/').get(controller.getExpenses).post(authorize('admin', 'staff'), controller.createExpense);
router.route('/:id').put(authorize('admin', 'staff'), controller.updateExpense).delete(authorize('admin'), controller.deleteExpense);

module.exports = router;
