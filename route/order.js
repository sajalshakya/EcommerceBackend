const express = require('express');

const {getOrders, storeOrders} = require('../controller/order');
const {checkAuthentication,isBuyer} = require('../middleware/auth')

const router = express.Router();

router.get("/orders", checkAuthentication, getOrders);
router.post("/orders", checkAuthentication, isBuyer,storeOrders);

module.exports = router;