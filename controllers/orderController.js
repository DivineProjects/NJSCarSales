const OrderModel = require('../models/order-model');

const showOrderForm = async (req, res) => {
    try {
      const { inv_id } = req.params;
        const inventory = await OrderModel.getInventoryList();
        const formData = { inv_id }
      res.render('order/order-form', { inventory, error: null, formData });
    } catch (err) {
      res.status(500).send('Error loading form');
    }
  };


const placeOrder = async (req, res) => {
    const { account_id, inv_id, quantity } = req.body;
    const parsedQty = parseInt(quantity, 10);
  
    try {
      if (!parsedQty || parsedQty <= 0) throw new Error('Invalid quantity');
  
      const vehicle = await OrderModel.getVehicleById(inv_id);
      const totalPrice = parsedQty * vehicle.inv_price;
  
      const order = await OrderModel.createOrder(account_id, inv_id, parsedQty, totalPrice);
      res.render('order/order-success', { order });
    } catch (err) {
      const inventory = await OrderModel.getInventoryList();
      const formData = { account_id, inv_id, quantity };
      res.render('order-form', { inventory, error: err.message, formData });
    }
  };
  

module.exports = {
  showOrderForm,
  placeOrder
};
