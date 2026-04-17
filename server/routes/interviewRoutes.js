const express = require('express');
const router = express.Router();
const { createInterview, getInterviews ,getAvailableSlots } = require('../controllers/interviewController');
const auth = require('../middleware/auth');

router.post('/create', auth, createInterview);
router.get('/', getInterviews);
router.get('/:id/slots', getAvailableSlots);
module.exports = router;
