const express = require('express');
const router = express.Router();
const { bookSlot } = require('../controllers/bookingController');

router.post('/book', bookSlot);

module.exports = router;