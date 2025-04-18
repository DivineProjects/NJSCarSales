const utilities = require(".")
const {body, validationResult} = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model")

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
      // classification_name is required and must be string and numbers
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a Classification name.") // on error this message is sent.
        .custom(async (classification_name)=>{
          const classificationExist = await inventoryModel.checkExistingClassification(classification_name)
          // console.log("inside classrules")
          // /console.log(body("classification_name"))
          if (classificationExist){
            throw new Error("Inventory Classification exists. Please use different classification")
          }
          }),

    ]
  }


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  // console.log(classification_name)
  // const className = req.body
  // const classification_name = className.classificationName
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}



/*  **********************************
  *  Inventry Data Validation Rules
  * ********************************* */
validate.inventryDataRules = () => {
  return [
    // inv_make is required and must be a string
    body('inv_make')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a make name.'), // on error this message is sent.

    // inv_model is required and must be a string
    body('inv_model')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage('Please provide a model name.'), // on error this message is sent.

    // inv_year is required and must be a valid year
    body('inv_year')
      .isInt({ min: 1886, max: new Date().getFullYear() + 1 })
      .withMessage('Please provide a valid year.'),

    // inv_description is required
    body('inv_description')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide a description.'),

    // inv_image is required and must be a valid URL
    body('inv_image')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide a valid image URL.'),

    // inv_thumbnail is required and must be a valid URL
    body('inv_thumbnail')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide a valid thumbnail URL.'),

    // inv_price is required and must be a positive number
    body('inv_price')
      .isFloat({ min: 0 })
      .withMessage('Please provide a valid price.'),

    // inv_miles is required and must be a non-negative integer
    body('inv_miles')
      .isInt({ min: 0 })
      .withMessage('Please provide valid miles.'),

    // inv_color is required and must be a string
    body('inv_color')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide a color.'),

    // classification_id is required and must be an integer
    body('classification_id')
      .isInt()
      .withMessage('Please select a valid classification.'),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
    return
  }
  next()
}


/* ******************************
 * Check data and return errors or continue to Update Inventory Item
  Error will be redirected to Edit view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    
    res.render("inventory/edit-inventory", {
      errors,
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationSelect: classificationSelect,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    })
    return
  }
  next()
}


/*  **********************************
  *  Delete Inventry Item Validation Rules
  * ********************************* */
validate.deleteInventoryDataRules = () => {
  return [
    body('inv_id')
      .isInt({ min: 0 })
      .withMessage('Please provide a valid inventory ID.')
  ];
};


/* ******************************
 * Check data and return errors or continue to Delete Inventory Item
  Error will be redirected to Confirm Delete  view
 * ***************************** */
  validate.checkDeleteData = async (req, res, next) => {
    const { inv_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      // Attempt to fetch inventory data if inv_id is a valid integer
    if (!isNaN(inv_id)) {
      inventory = await inventoryModel.getInventoryByInvId(inv_id);
    }

    // Prepare variables with default values in case inventory is not found
    const inv_make = inventory?.inv_make || '';
    const inv_model = inventory?.inv_model || '';
    const inv_price = inventory?.inv_price || '';
    const inv_year = inventory?.inv_year || '';
    const itemName = `${inv_make} ${inv_model}`.trim();

    res.render("inventory/delete-confirm", {
      errors,
      nav,
      title: "Confirm Delete " + itemName,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price
    })
      return
    }
    next()
  }
  

module.exports = validate
