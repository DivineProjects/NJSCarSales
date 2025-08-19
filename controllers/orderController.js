const OrderModel = require('../models/order-model');
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const showOrderForm = async (req, res) => {
  try {
    const inv_id = parseInt(req.params.inv_id, 10);

    const nav = await utilities.getNav();
    const vehicle = await invModel.getInventoryByInvId(inv_id);

    let vehicleName = "";
    if (vehicle) {
      vehicleName = `${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})`;
    }

    const form = await utilities.buildOrder(vehicle);

    res.render("./order/order-form", {
      errors: null,
      title: vehicleName,
      nav,
      form,
    });
  } catch (err) {
    console.error("Show Order Form error:", err);
    res.status(500).send("Unable to load order form");
  }
};

const placeOrder = async (req, res) => {
  const { account_id, inv_id, quantity } = req.body;
  const parsedQty = parseInt(quantity, 10);

  try {
    // Validate input
    if (!parsedQty || parsedQty <= 0) throw new Error("Invalid quantity");

    // Get vehicle details
    const vehicle = await invModel.getInventoryByInvId(parseInt(inv_id, 10));
    if (!vehicle) throw new Error("Vehicle not found");

    // Calculate total price
    const total_price = parsedQty * vehicle.inv_price;

    // Save order
    const order = await OrderModel.createOrder(
      parseInt(account_id, 10),
      parseInt(inv_id, 10),
      parsedQty,
      total_price
    );

    res.render("order/order-success", {
      order,
      title: "Order Confirmation",
      nav: await utilities.getNav(),
    });
  } catch (err) {
    console.error("Order error:", err);

    let vehicle = null;
    try {
      vehicle = await invModel.getInventoryByInvId(parseInt(inv_id, 10));
    } catch (e) {
      console.error("Vehicle fetch failed:", e);
    }

    const form = await utilities.buildOrder({
      ...(vehicle || {}),
      ...req.body,
      quantity: parsedQty,
      error: err.message,
    });

    res.render("order/order-form", {
      errors: err.message,
      title: vehicle ? `${vehicle.inv_make} ${vehicle.inv_model}` : "Order Error",
      nav: await utilities.getNav(),
      form,
    });
  }
};

const showOrderHistory = async (req, res) => {
  try {
    const account_id = req.session.account_id; // assuming session stores logged-in user id
    if (!account_id) {
      return res.redirect("/account/login"); // 
    }

    const nav = await utilities.getNav();
    const orders = await OrderModel.getAllOrders();

    res.render("order/history", {
      title: "My Orders",
      nav,
      orders
    });
  } catch (err) {
    console.error("Order history error:", err);
    res.status(500).send("Unable to load order history");
  }
};



module.exports = {
  showOrderForm,
  placeOrder,
  showOrderHistory
};
