const { response } = require('express');
var express = require('express');
var router = express.Router();

var producthelpers = require('../helpers/producthelpers');
var brandhelpers = require('../helpers/brandhelpers');
var categoryhelpers = require('../helpers/categoryhelpers');
var userhelpers = require('../helpers/userhelpers');
const session = require('express-session');

const serviceId = "VA50948f9669d28fb947244dc94fdebacd";
const accountId = "AC5d0a3d2d3944bd50b8d94628b9d1fcb0";
const authToken = "0156c9f1cfdaecef274beea8db4876ad";

const client = require("twilio")(accountId,authToken)




var confirmPasswordError = "";
var emailphonenumberExistError = "";
var loginError = "";
var phonenumberExistError = "";
var signupotp = "";


// verify login middleware
  const verifyLogin = (req,res,next)=>{
    if(req.session.user?.loggedIn){
      res.redirect('/');
    
    }else{
      next();
    }
  }



 const verifyLoginForLoginpage = (req,res,next)=>{
   if(req.session.user?.loggedIn){
    next();
   }else{
     res.redirect('/userlogin')
   }
 }

/* GET users listing. loginverification not required*/
router.get('/', function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
let user = req.session.user;

  res.render('users/home',{ admin:false,user});
});


/* GET clothings view. loginverification not required*/
router.get('/clothings', function(req, res, next) {
  let user = req.session.user;
  producthelpers.getProduct().then((products)=>{
    
    res.render('users/clothings', { admin:false,products,user});
  })
});

/* GET shopping cart. */
router.get('/shopping-cart',verifyLoginForLoginpage, function(req, res, next) {
  let user = req.session.user;
  res.render('users/shopping-cart',{ admin:false,user,notheader:true});
});


/* GET single product view. loginverification not required*/
router.get('/product', function(req, res) {
  let user = req.session.user;
producthelpers.getSingleProductDetails(req.query).then((response)=>{
  res.render('users/product',{ admin:false,response,user});
})
  
  
});

/* GET checkout. */
router.get('/checkout', function(req, res, next) {
  let user = req.session.user;
  res.render('users/checkout',{ admin:false,user,notheader:true});
});


/* GET user register. */

router.get('/register',verifyLogin, function(req, res) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(req.session.user?.loggedIn){
    res.redirect('/');
  }else{
    res.render('users/register',{ admin:false,confirmPasswordError,emailphonenumberExistError,notheader:true});
    confirmPasswordError="";
    emailphonenumberExistError = "";
  }
  
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

router.get('/userlogin', function(req, res) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(req.session.user?.loggedIn){
    res.redirect('/')
  }else{
    res.render('users/userlogin',{ admin:false,loginError,notheader:true});
    loginError = "";
  }

  
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



//get user phonenumber
router.get('/phonenumberpage',(req,res)=>{
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(req.session.user?.loggedIn){
    res.redirect('/')
  }else{
    res.render('users/phonenumberpage',{admin:false,phonenumberExistError,notheader:true});
  }



  
  phonenumberExistError = "";
});


//post user phonenumber
router.post('/phonenumberpage',(req,res)=>{
let phoneNumber = req.body.number
phoneNumber = phoneNumber.toString();

userhelpers.phoneNumberChecking(phoneNumber).then((response)=>{
  if(response.exist){
    client.verify
    .services(serviceId)
    .verifications.create({
      to:`+91${req.body.number}`,
      channel:"sms"
    })
    .then((resp)=>{
      // console.log(resp);
      // res.status(200).json({resp});
      res.render('users/otplogin',{admin:false,phoneNumber,notheader:true})
    });
  }else{
    phonenumberExistError = "Enterd phone number does not exist";
    res.redirect('/phonenumberpage')

  }
})


});



//post otp login
 router.get("/otplogin",(req,res)=>{
 
   let phoneNumber = req.query.phonenumber;
   let otpNumber = Number(req.query.otpnumber);
 typeof(otpNumber)
   client.verify
   .services(serviceId)
   .verificationChecks.create({
     to:"+91"+phoneNumber,
     code:otpNumber
   })
   .then((resp=>{
     if(resp.valid){
       userhelpers.otpLogin(phoneNumber).then((response)=>{
         req.session.user = response;
       
         req.session.user.loggedIn = true;
         let valid = true;
        res.send(valid);
       })
     }else{
       let valid = false;

       res.send(valid);
     }
   }));
 })


//  get forgote password
router.get('/loginidentify',verifyLogin,(req,res)=>{
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.render('users/loginidentify',{admin:false,notheader:true,phonenumberExistError})
  phonenumberExistError = "";
});

//  post forgotten password
router.post('/loginidentify',(req,res)=>{
  let phoneNumber = req.body.number
  phoneNumber = phoneNumber.toString();
  
  userhelpers.phoneNumberChecking(phoneNumber).then((response)=>{
    if(response.exist){
      client.verify
      .services(serviceId)
      .verifications.create({
        to:`+91${req.body.number}`,
        channel:"sms"
      })
      .then((resp)=>{
        // console.log(resp);
        // res.status(200).json({resp});
        res.render('users/otploginforpassword',{admin:false,phoneNumber,notheader:true})
      });
    }else{
      phonenumberExistError = "Entered phone number does not exist";
      res.redirect('/loginidentify')
  
    }
  })
  
});


//get for password otp
router.get("/otploginforpassword",(req,res)=>{
 
  let phoneNumber = req.query.phonenumber;
  let otpNumber = Number(req.query.otpnumber);
typeof(otpNumber)
  client.verify
  .services(serviceId)
  .verificationChecks.create({
    to:"+91"+phoneNumber,
    code:otpNumber
  })
  .then((resp=>{
    
    if(resp.valid){
  
       
        let valid = true;
       res.send(valid);
    
    }else{
      let valid = false;

      res.send(valid);
    }
  }));
});



//get change for password otp
router.get('/passwordchange',(req,res)=>{
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(req.session.user?.loggedIn){

    res.redirect('/');
  }
  else{
    let phonenumber = req.query.phonenumber;
    res.render('users/newpassword',{admin:false,notheader:true,phonenumber})
  }
  
});

//post change for password otp
router.post('/passwordchange',(req,res)=>{
 
   userhelpers.findNumberChangepassword(req.body).then((response)=>{
    console.log(response)
   req.session.user = response;
   req.session.user.loggedIn = true;
   res.redirect('/')
    
  })
});














// get user logout
router.get('/userlogout',(req,res)=>{
  
  req.session.user.loggedIn = false;
  req.session.user = null;
  res.redirect('/');
  
})






module.exports = router;
