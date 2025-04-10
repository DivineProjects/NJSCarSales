// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")


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
    utilities.handleErrors(invController.addClassification))
// router to build add inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))
router.post(
    "/add-inventory",
    utilities.handleErrors(invController.addInventory))

module.exports = router;