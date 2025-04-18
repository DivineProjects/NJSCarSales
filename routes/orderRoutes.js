const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.get('/order/:inv_id', orderController.showOrderForm);
router.post('/order', orderController.placeOrder);

module.exports = router;
