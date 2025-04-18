const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.get('/:inv_id', orderController.showOrderForm);
router.post('/', orderController.placeOrder);

module.exports = router;
