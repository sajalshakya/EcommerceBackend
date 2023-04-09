const express = require('express');

const {login, signup} = require('../controller/auth');
const {login_middleware,signup_middleware} = require('../middleware/auth');

const router = express.Router();

router.post("/login",login_middleware, login);
router.post("/signup",signup_middleware, signup);

module.exports = router;