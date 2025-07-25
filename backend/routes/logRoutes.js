const express = require('express');
const {
  getLogs,
  getLogById,
  createLog,
  updateLog,
  deleteLog,
} = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getLogs).post(protect, createLog);
router
  .route('/:id')
  .get(protect, getLogById)
  .put(protect, updateLog)
  .delete(protect, deleteLog);

module.exports = router; 