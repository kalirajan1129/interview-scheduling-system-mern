const express = require('express');
const router = express.Router();
const { createInterview, getInterviews ,getAvailableSlots } = require('../controllers/interviewController');

router.post('/create', createInterview);
router.get('/', getInterviews);
router.get('/:id/slots', getAvailableSlots);
module.exports = router;
