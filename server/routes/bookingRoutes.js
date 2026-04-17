const express = require('express');
const router = express.Router();
const { getPublicDriveDetails, bookSlot } = require('../controllers/bookingController');

// Public endpoints, NO auth required
router.get('/:driveId/:token', getPublicDriveDetails);
router.post('/book', bookSlot);

module.exports = router;