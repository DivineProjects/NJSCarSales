const jwt = require("jsonwebtoken")
require("dotenv").config()

const invModel = require("../models/inventory-model")
const Util = {}

/* ***************
    Construct the nav HTML undered list
    **************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassification()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row)=> {
        list += "<li>"
        list += 
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
    list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += `<a href="/order/${vehicle.inv_id}" class="btn btn-order">Place Your Order</a>`
        grid += '</li>'
        
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

Util.buildInventorySingleGrid = async function (data) {
  let grid
  try {
    if (data && Object.keys(data).length> 0) {
      const grid = `
        <div class="vehicle-grid">
          <div class="vehicle-image">
            <a href="/inv/detail/${data.inv_id}" title="View ${data.inv_make} ${data.inv_model} details">
              <img src="${data.inv_thumbnail}" alt="Image of ${data.inv_make} ${data.inv_model} on CSE Motors" loading="lazy">
            </a>
          </div>
          <section class="vehicle-details">
            <h2>Vehicle Details</h2>
            <p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(Number(data.inv_price))}</p>
            <p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(data.inv_miles)} miles</p>
            <p><strong>Description:</strong> ${data.inv_description}</p>
            <a href="/order/${data.inv_id}" class="btn btn-order">Place Your Order</a>
          </section>
        </div>
      `;
    } else {
      grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
  } catch (error) {
    grid = '<p class="notice">An error occurred while loading vehicle details. Please try again later.</p>'
  }
  
  return grid
}

/* *****************************************
 * Build Order for inventory
*/ 

Util.buildOrder = async function (data) {
  let form
  
  if (data && Object.keys(data).length > 0) { 
    form = `
      <form method="POST" action="/order" class="order-form">
        <input type="hidden" name="inv_id" value="${data.inv_id || ''}" />
        <input type="hidden" name="account_id" value="${data.account_id || 2}" />
        <input type="hidden" name="unit_price" value="${data.inv_price}" />
        <input type="hidden" name="order_date" value="${new Date().toISOString().split('T')[0]}" />
        
        <div class="vehicle-details">
          <h2>Order Details</h2>
          <p><strong>Make:</strong> ${data.inv_make || 'N/A'}</p>
          <p><strong>Model:</strong> ${data.inv_model || 'N/A'}</p>
          <p><strong>Year:</strong> ${data.inv_year || 'N/A'}</p>
          <p><strong>Price:</strong> $${data.inv_price ? new Intl.NumberFormat('en-US').format(data.inv_price) : 'N/A'}</p>
        </div>
        
        <div class="form-group">
          <label for="quantity">Quantity:</label>
          <input 
            type="number" 
            id="quantity"
            name="quantity" 
            min="1" 
            max="10"
            value="${data.quantity || 1}" 
            required
          />
        </div>
        

        
        <button type="submit" class="btn btn-order">Place Order</button>
      </form>`
  } else {
    form = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  
  return form
}




/* *****************************************
 * Build Classification list for inventory add ejs
*/
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassification()
  
  let classificationList =
    '<select class="formSelect customSelect" name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 
/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


/* ****************************************
 *  Order
 * ************************************ */
 Util.buildInventorySingleGrid = async function (data) {
  let grid
  try {
    if (data && Object.keys(data).length> 0) {
      grid = `
              <div class="vehicle-grid">
                <div class="vehicle-image">
                  <a href="../../inv/detail/${data.inv_id}" 
                    title="View ${data.inv_make} ${data.inv_model} details">
                    <img src="${data.inv_thumbnail}" 
                        alt="Image of ${data.inv_make} ${data.inv_model} on CSE Motors" />
                  </a>
                </div>
                <section class="vehicle-details">
                  <h2>Vehicle Details</h2>
                  <p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(Number(data.inv_price))}</p>
                  <p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(data.inv_miles)}</p>
                  <p><strong>Description:</strong> ${data.inv_description}</p>
                  
                  <form method="GET" action="/order/${data.inv_id}">
                    <input type="hidden" name="inv_id" value="${data.inv_id}" />
                    <button type="submit" class="btn btn-order">Place Your Order</button>
                  </form>
                </section>
              </div>
            `
    } else {
      grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
  } catch (error) {
    grid = '<p class="notice">An error occurred while loading vehicle details. Please try again later.</p>'
  }
  
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
 * Middleware For Interntinal 500 Errors
 * 
 * Error in the Footer
 **************************************** */
Util.intentionalErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util