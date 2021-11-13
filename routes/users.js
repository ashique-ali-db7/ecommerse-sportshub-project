const { response } = require('express');
var express = require('express');
var router = express.Router();

var producthelpers = require('../helpers/producthelpers');
var brandhelpers = require('../helpers/brandhelpers');
var categoryhelpers = require('../helpers/categoryhelpers');
var userhelpers = require('../helpers/userhelpers');
const session = require('express-session');


var confirmPasswordError = "";
var emailphonenumberExistError = "";
var loginError = "";


// verify login middleware
const verifyLogin = (req,res,next)=>{
  if(req.session?.user){
next();
  }else{
    res.redirect('/userlogin');
  }
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  
let user = req.session.user;

  res.render('users/home',{ admin:false,user});
});


/* GET clothings view. */
router.get('/clothings', function(req, res, next) {
  let user = req.session.user;
  producthelpers.getProduct().then((products)=>{
    
    res.render('users/clothings', { admin:false,products,user});
  })
});

/* GET shopping cart. */
router.get('/shopping-cart', function(req, res, next) {
  let user = req.session.user;
  res.render('users/shopping-cart',{ admin:false,user});
});


/* GET single product view. */
router.get('/product', function(req, res, next) {
  let user = req.session.user;
producthelpers.getSingleProductDetails(req.query).then((response)=>{
  res.render('users/product',{ admin:false,response,user});
})
  
  
});

/* GET checkout. */
router.get('/checkout', function(req, res, next) {
  let user = req.session.user;
  res.render('users/checkout',{ admin:false,user});
});


/* GET user register. */

router.get('/register', function(req, res) {
  
  res.render('users/register',{ admin:false,confirmPasswordError,emailphonenumberExistError});
  confirmPasswordError="";
  emailphonenumberExistError = "";
});

/* post user register. */
router.post('/register', function(req, res) {
if(req.body.password == req.body.confirmpassword){
  delete req.body.confirmpassword;
userhelpers.emailAndPasswordCheck(req.body).then((response)=>{
  if(response?.exist){
    emailphonenumberExistError = "Entered email or phone number is already exist"
    res.redirect('/register');
  }else{
res.redirect('/userlogin')
  }
})
}else{
  confirmPasswordError = "Password is not matching"
  res.redirect('/register');
}
 
});

/* GET user login. */

router.get('/userlogin', function(req, res, next) {
  res.render('users/userlogin',{ admin:false,loginError});
});

/* post user login. */

router.post('/userlogin', function(req, res) {
  console.log(req.body);
  userhelpers.checkLogin(req.body).then((response)=>{
    if(response.exist){
      req.session.user = response.user;
req.session.user.loggedIn = true;

res.redirect('/');
    }else{
      loginError = "Invalid user name or password";
      res.redirect('/userlogin');
    }
  })
  
});

// get user logout
router.get('/userlogout',(req,res)=>{
  
  req.session.user = ""
  res.redirect('/');
  
})

module.exports = router;
