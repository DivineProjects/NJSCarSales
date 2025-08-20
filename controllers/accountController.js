const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require('bcryptjs')


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null
    })
  }

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
      hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.');
      return res.status(500).render("account/register", {  // Added return
          title: "Registration",
          nav,
          errors: null,
          account_firstname,
          account_lastname,
          account_email,
      });
  }

  try {
      const regResult = await accountModel.registerAccount(
          account_firstname,
          account_lastname,
          account_email,
          hashedPassword
      );

      if (regResult) {
          req.flash(
              "success",
              `Congratulations O:) ${account_firstname}, you're registered. Please log in.`
          );
          return res.status(201).render("account/login", {  // Added return
              title: "Login",
              nav,
          });
      } else {
          req.flash("notice", "Sorry, the registration failed.");
          return res.status(400).render("account/register", {  // Added return
              title: "Registration",
              nav,
          });
      }
  } catch (error) {
      req.flash("notice", "Sorry, there was an error processing your registration.");
      return res.status(500).render("account/register", {  // Added return
          title: "Registration",
          nav,
          errors: null,
          account_firstname,
          account_lastname,
          account_email,
      });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {

      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      // ✅ store session user
      req.session.user = {
        id: accountData.account_id,
        firstName: accountData.account_firstname,
        email: accountData.account_email,
      }
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("/", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}  

/* ****************************************
*  Deliver Management view
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/management", {
    title: "Management",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Process logout request
 * ************************************ */
function accountLogout(req, res) {
  // Destroy the session
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err)
      // If error occurs, redirect anyway
      return res.redirect("/")
    }
    // Clear the cookie
    res.clearCookie("connect.sid") // default cookie name for express-session
    // Redirect to home or login page
    res.redirect("/")
  })
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, accountLogout  }