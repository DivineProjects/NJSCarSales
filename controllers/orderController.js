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


// const placeOrder = async (req, res) => {
//   console.log('placeOrder called') 
//   console.log(req.body)
//     const { account_id, inv_id, quantity } = req.body;
//     const parsedQty = parseInt(quantity, 10);
  
//     try {
//       if (!parsedQty || parsedQty <= 0) throw new Error('Invalid quantity');
  
//       const vehicle = await OrderModel.getVehicleById(inv_id);
//       const totalPrice = parsedQty * vehicle.inv_price;
  
//       const order = await OrderModel.createOrder(account_id, inv_id, parsedQty, totalPrice);
//       res.render('order/order-success', { order });
//     } catch (err) {
//       const inventory = await OrderModel.getInventoryList();
//       const formData = { account_id, inv_id, quantity };
//       res.render('order/order-form', { inventory, error: err.message, formData });
//     }
//   }


  const placeOrder = async (req, res) => {
    console.log('placeOrder called') 
    console.log(req.body)
    
    const { account_id, inv_id, quantity } = req.body;
    const parsedQty = parseInt(quantity, 10);
  
    try {
      if (!parsedQty || parsedQty <= 0) {
        throw new Error('Invalid quantity');
      }
  
      // Get vehicle details
      const vehicle = await invModel.getInventoryByInvId(inv_id);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }
  
      // Calculate total
      const totalPrice = parsedQty * vehicle.inv_price;
  
      // Create order
      const order = await OrderModel.createOrder(account_id, inv_id, parsedQty, totalPrice);
      
      // Render success page
      res.render('order/order-success', { 
        order,
        title: 'Order Confirmation',
        nav: await utilities.getNav()
      });
      
    } catch (err) {
      console.error('Order error:', err);
      
      // Get vehicle data again for the form
      const vehicle = await invModel.getInventoryByInvId(inv_id);
      const form = await utilities.buildOrder({
        ...vehicle,
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
