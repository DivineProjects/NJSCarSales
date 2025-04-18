const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')
const validate = require('../utilities/order-validation')

router.get('/:inv_id', orderController.showOrderForm)
router.post('/', 
    validate.orderRules(), 
    validate.checkOrderData, 
    orderController.placeOrder
  )

module.exports = router;
