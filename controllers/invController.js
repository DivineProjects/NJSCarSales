const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  let className = ""
  if (data[0]){
    className = data[0].classification_name
  }
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by single inventory (ID) view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInvId(inv_id)
  const grid = await utilities.buildInventorySingleGrid(data)
  let nav = await utilities.getNav()
  let vehicleName = "";
  if (data) {
    vehicleName = `${data.inv_make} ${data.inv_model} (${data.inv_year})`
  } 
  res.render("./inventory/vehicle", {
    title: vehicleName,
    nav,
    grid,
  })
}

/* ****************************************
*  Bulid Management view
* *************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Bulid Classification view
* *************************************** */
invCont.buildClassification =  async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Add Classification data to the database
* *************************************** */
invCont.addClassification = async function addClassification(req, res) {
  let nav = await utilities.getNav()
  // const classificationHTML  = req.body
  // const classification_name = classificationHTML.classificationName
  const { classification_name } = req.body
  // console.log("inside add classification")
  // console.log(classification_name)
  const addClass = await invModel.addClassification(
    classification_name
  )
//  console.log(addClass)
  if (addClass) {
    req.flash(
      "success",
      `Congratulations, New Classification: ${ classification_name } added`
    )
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
    errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the classification entry failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  }
}

/* ****************************************
*  Deliver Add Inventory View
* *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let buildClassificationList = await utilities.buildClassificationList()
  
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    buildClassificationList,
    errors: null,
  })
}

/* ****************************************
*  Add New Inventrory to database
* *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let buildClassificationList = await utilities.buildClassificationList()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const addInv = await invModel.addInventoryData(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (addInv) {
    req.flash(
      "success",
      `Congratulations, inventory data added sucessfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, dataentry failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      buildClassificationList,
      nav,
    })
  }
}

module.exports = invCont