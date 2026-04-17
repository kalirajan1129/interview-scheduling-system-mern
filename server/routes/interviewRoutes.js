const express = require('express');
const router = express.Router();
const { createInterview, getInterviews, getInterviewById, deleteInterview, sendEmails } = require('../controllers/interviewController');
const auth = require('../middleware/auth');

router.post('/create', auth, createInterview);
router.get('/', auth, getInterviews);
router.get('/:id', auth, getInterviewById);
router.delete('/:id', auth, deleteInterview);
router.post('/:id/send-emails', auth, sendEmails);

module.exports = router;
