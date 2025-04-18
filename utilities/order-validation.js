const utilities = require(".")
const {body, validationResult} = require("express-validator")
const validate = {}
const inventoryModel = require("../models/order-model")

validate.orderRules = () => {
    return [
      // account_id is required and must be string and numbers
      body("account_id")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a Account ID.") // on error this message is sent.
        .isNumeric()
        .withMessage("Account ID must be a number."),
      // inv_id is required and must be string and numbers
      body("inv_id")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a Inventory ID.") // on error this message is sent.
        .isNumeric()
        .withMessage("Inventory ID must be a number."),
      // quantity is required and must be string and numbers
      body("quantity")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a Quantity.") // on error this message is sent.
        .isNumeric()
        .withMessage("Quantity must be a number.")
    ]
  }