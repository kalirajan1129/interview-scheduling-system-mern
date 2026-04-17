const express = require('express');
const router = express.Router();
const { createInterview } = require('../controllers/interviewController');

router.post('/create', createInterview);

module.exports = router;