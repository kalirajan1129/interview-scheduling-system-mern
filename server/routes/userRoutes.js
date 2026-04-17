const express = require('express');
const router = express.Router();
const { createUser, registerUser, loginUser, updateEmailConfig } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/create', auth, createUser);
router.put('/email-config', auth, updateEmailConfig);

module.exports = router;