var express = require('express');
var router = express.Router();

var authController = require('../app/auth/controllers/AuthController.js');
var passportConfig = require('../app/auth/passport.js');

router.post('/signup',authController.localSignup);
router.post('/login',authController.localLogin);

module.exports = router;