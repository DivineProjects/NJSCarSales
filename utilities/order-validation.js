const { body, validationResult } = require('express-validator');
const utilities = require('.');
// const inventoryModel = require('../models/order-model');
const inventoryModel = require("../models/inventory-model")


const validate = {};

validate.orderRules = () => {
  return [
    // account_id validation
    body('account_id')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Account ID is required')
      .isInt({ min: 1 })
      .withMessage('Account ID must be a positive integer'),
      
    // inv_id validation
    body('inv_id')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Inventory ID is required')
      .isInt({ min: 1 })
      .withMessage('Inventory ID must be a positive integer'),
      
    // quantity validation
    body('quantity')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Quantity is required')
      .isInt({ min: 1, max: 10 })
      .withMessage('Quantity must be between 1 and 10'),
      
      
    // unit_price validation
    body('unit_price')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Unit price is required')
      .isFloat({ min: 0 })
      .withMessage('Unit price must be a positive number'),
      
  ];
};

validate.checkOrderData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Get vehicle data for the form
    const vehicle = await inventoryModel.getInventoryByInvId(req.body.inv_id);
    const form = await utilities.buildOrder({
      ...vehicle,
      ...req.body,
      errors: 'Please correct the errors below'
    }, errors.mapped());

    return res.render('order/order-form', {
      errors,
      title: vehicle ? `${vehicle.inv_make} ${vehicle.inv_model}` : 'Order Form',
      nav: await utilities.getNav(),
      form
    });
  }
  next();
};

module.exports = validate;