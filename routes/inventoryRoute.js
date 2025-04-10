// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
// const classficationValidate = require('../utilities/inventory-validation')
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to build inventory by single Id
router.get("/detail/:invId", invController.buildByInvId)
// router to build management view
router.get("/management", utilities.handleErrors(invController.buildManagement))
// router to build add-classification
router.get("/add-classification", utilities.handleErrors(invController.buildClassification))
router.post(
    "/add-classification", 
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification))
// router to build add inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))
router.post(
    "/add-inventory",
    invValidate.inventryDataRules(),
    invValidate.checkInventoryData, 
    utilities.handleErrors(invController.addInventory))

module.exports = router;