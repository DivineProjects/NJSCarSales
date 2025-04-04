const utilities = require("../utilities/")
const errorController = {}

errorController.triggerError = async function (req, res) {
    // const nav = await utilities.getNav()
    res.render("index", {title: "Home", nav})
}

module.exports = errorController