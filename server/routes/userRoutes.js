const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');
const { registerUser, loginUser } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/create', createUser);

module.exports = router;