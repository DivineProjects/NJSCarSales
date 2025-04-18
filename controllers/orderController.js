const OrderModel = require('../models/order-model')
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")


const showOrderForm = async (req, res) => {
      const inv_id = parseInt(req.params.inv_id)

      let nav = await utilities.getNav()
      const vehicle = await invModel.getInventoryByInvId(inv_id) 
      const form = await utilities.buildOrder(vehicle)
      let vehicleName = ""
      if (vehicle) {
        vehicleName = `${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})`
      } 
      res.render("./order/order-form", {
        errors: null,
        title: vehicleName,
        nav,
        form,
      })
  };

  const placeOrder = async (req, res) => {
    const { account_id, inv_id, quantity } = req.body;
    const parsedQty = parseInt(quantity, 10);
  
    try {
      // Validate input
      if (!parsedQty || parsedQty <= 0) throw new Error('Invalid quantity');
  
      // Get vehicle details to calculate total price
      const vehicle = await invModel.getInventoryByInvId(inv_id);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }
  
      // Calculate total price
      const total_price = parsedQty * vehicle.inv_price;
      const order_date = new Date().toISOString(); // Current timestamp
  
      // Create order - matches model's expected parameters
      const order = await OrderModel.createOrder(
        parseInt(account_id, 10),  // account_id
        parseInt(inv_id, 10),      // inv_id
        parsedQty,                 // quantity
        total_price                // total_price
      );
  
      res.render('order/order-success', {
        order,
        title: 'Order Confirmation',
        nav: await utilities.getNav()
      });
  
    } catch (err) {
      console.error('Order error:', err);
      
      const vehicle = await invModel.getInventoryByInvId(inv_id);
      const form = await utilities.buildOrder({
        ...vehicle,
        ...req.body,
        quantity: parsedQty,
        error: err.message
      });
  
      res.render('order/order-form', {
        errors: err.message,
        title: `${vehicle.inv_make} ${vehicle.inv_model}`,
        nav: await utilities.getNav(),
        form
      });
    }
  };
  

module.exports = {
  showOrderForm,
  placeOrder
};
