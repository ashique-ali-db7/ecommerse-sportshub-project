const { response } = require('express');
var express = require('express');
var router = express.Router();

var producthelpers = require('../helpers/producthelpers');
var brandhelpers = require('../helpers/brandhelpers');
var categoryhelpers = require('../helpers/categoryhelpers');
var userhelpers = require('../helpers/userhelpers');
const session = require('express-session');

const serviceId = process.env.serviceId;
const accountId = process.env.accountId;
const authToken = process.env.authToken;

const client = require("twilio")(accountId,authToken)




var confirmPasswordError = "";
var emailphonenumberExistError = "";
var loginError = "";
var phonenumberExistError = "";
var blockedError = "";


// verify login middleware
  const verifyLogin = (req,res,next)=>{
    if(req.session.user){
      res.redirect('/');
    
    }else{
      next();
    }
  }

const blockCheck = (req,res,next)=>{
  if(req.session.user){
     
    userhelpers.blockedOrNot(req.session.user.phonenumber).then((response)=>{
       if(response.blocked == true){

         req.session.user = null;
        res.redirect('/');
       }else{
        next();
       }
     })
   
   }else{
     next();
   }
}

 const verifyLoginForLoginpage = (req,res,next)=>{
   if(req.session.user){
     
    userhelpers.blockedOrNot(req.session.user.phonenumber).then((response)=>{
       if(response.blocked == true){

         req.session.user = null;
        res.redirect('/');
       }else{
        next();
       }
     })
   
   }else{
     res.redirect('/userlogin')
   }
 }

/* GET users listing. loginverification not required*/
router.get('/',blockCheck, function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
let user = req.session.user;

  res.render('users/home',{ admin:false,user});
});


/* GET clothings view. loginverification not required*/
router.get('/clothings',blockCheck, function(req, res, next) {
  let user = req.session.user;
  producthelpers.getProduct().then((products)=>{
    
    res.render('users/clothings', { admin:false,products,user});
  })
});

/* GET shopping cart. */
router.get('/shopping-cart',verifyLoginForLoginpage, async(req, res, next) =>{
  let user = req.session.user;
  let userId = req.session.user._id;
  let cartItems = await producthelpers.getCartProducts(userId)
  res.render('users/shopping-cart',{ admin:false,user,notheader:true,cartItems});
});


/* GET single product view. loginverification not required*/
router.get('/product',blockCheck, function(req, res) {
  let user = req.session.user;
  let quantity = {};
producthelpers.getSingleProductDetails(req.query).then((response)=>{

console.log(response.instock[2].quantity);
  if(response.instock[0].quantity == 0){
quantity.smalloutofstock = true;
  }
  if(response.instock[1].quantity == 0){
    quantity.mediumoutofstock = true;
      }
      if(response.instock[2].quantity == 0){
        quantity.largeoutofstock = true;
          }

  
 
  res.render('users/product',{ admin:false,response,user,quantity});
})
  
  
});

/* GET checkout. */
router.get('/checkout',verifyLoginForLoginpage, function(req, res, next) {
  let user = req.session.user;
  res.render('users/checkout',{ admin:false,user,notheader:true});
});


/* GET user register. */

router.get('/register',verifyLogin, function(req, res) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(req.session.user){
    res.redirect('/');
  }else{
    res.render('users/register',{ admin:false,confirmPasswordError,emailphonenumberExistError,notheader:true});
    confirmPasswordError="";
    emailphonenumberExistError = "";
  }
  
});

/* post user register. */
router.post('/register',verifyLogin, function(req, res) {
  req.session.phonenumber = req.body.phonenumber;
  if(req.body.password == req.body.confirmpassword){
  delete req.body.confirmpassword;
userhelpers.emailAndPasswordCheck(req.body).then((response)=>{
  if(response?.exist){
    emailphonenumberExistError = "Entered email or phone number is already exist"
    res.redirect('/register');
  }else{
    let phoneNumber = req.body.phonenumber;
    req.session.tempararysignup = req.body;
let phonenumber = Number(req.body.phonenumber);
    client.verify
    .services(serviceId)
    .verifications.create({
      to:`+91${phonenumber}`,
      channel:"sms"
    })
    .then((resp)=>{
      // console.log(resp);
      // res.status(200).json({resp});
      res.render('users/otplogin',{admin:false,phoneNumber,notheader:true,registerotp:true})
    });
  }
})
}else{
  confirmPasswordError = "Password is not matching"
  res.redirect('/register');
}
 
});



//register for resend
router.get('/registerresend',verifyLogin,(req,res)=>{
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  let phoneNumber = req.session.phonenumber
 
 
  
       client.verify
       .services(serviceId)
       .verifications.create({
         to:`+91${req.session.phonenumber}`,
         channel:"sms"
       })
       .then((resp)=>{
         
          res.render('users/otplogin',{admin:false,phoneNumber,notheader:true,registerotp:true})
       });
   
 
 
 
 
 
 })






// get register otp check and sessions creation
router.get("/registerotplogin",(req,res)=>{
 
  let phoneNumber = req.query.phonenumber;
  let otpNumber = req.query.otpnumber;
typeof(otpNumber)
  client.verify
  .services(serviceId)
  .verificationChecks.create({
    to:"+91"+phoneNumber,
    code:otpNumber
  })
  .then((resp=>{
    if(resp.valid){
 let user = req.session.tempararysignup;
 userhelpers.addUser(user).then((response)=>{
   console.log(response)
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




/* GET user login. */

router.get('/userlogin', function(req, res) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(req.session.user){
    res.redirect('/')
  }else{
    res.render('users/userlogin',{ admin:false,loginError,notheader:true,blockedError});
    blockedError = "";
    loginError = "";
  }

  
});

/* post user login. */

router.post('/userlogin', function(req, res) {
  console.log(req.body);
  userhelpers.checkLogin(req.body).then((response)=>{
    if(response?.blocked){
      blockedError = "you are blocked";
res.redirect('/userlogin');
    }
    else{

      if(response.exist){
        req.session.user = response.user;
        req.session.user.loggedIn = true;
  
  
  res.redirect('/');
      }else{
        loginError = "Invalid user name or password";
        res.redirect('/userlogin');
      }

    }
  
  })
  
});



//get user phonenumber
router.get('/phonenumberpage',(req,res)=>{
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(req.session.user){
    res.redirect('/')
  }else{
    res.render('users/phonenumberpage',{admin:false,phonenumberExistError,notheader:true,blockedError});
    blockedError = "";
  }



  
  phonenumberExistError = "";
});


//post user phonenumber
router.post('/phonenumberpage',(req,res)=>{
  req.session.phonenumber = req.body.number;
// let phoneNumber = req.body.number
phoneNumber = req.session.phonenumber.toString();

userhelpers.phoneNumberChecking(phoneNumber).then((response)=>{
  if(response?.blocked){
    blockedError = "you are blocked";
    res.redirect('/phonenumberpage');


  }else{

    if(response.exist){
      client.verify
      .services(serviceId)
      .verifications.create({
        to:`+91${req.session.phonenumber}`,
        channel:"sms"
      })
      .then((resp)=>{
     
       res.render('users/otplogin',{admin:false,phoneNumber,notheader:true})
      });
    }else{
      phonenumberExistError = "Enterd phone number does not exist";
     res.redirect('/phonenumberpage');
 
    }

  }
  
})


});


//login for resend
router.get('/loginresend',verifyLogin,(req,res)=>{
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
 let phoneNumber = req.session.phonenumber


 
      client.verify
      .services(serviceId)
      .verifications.create({
        to:`+91${req.session.phonenumber}`,
        channel:"sms"
      })
      .then((resp)=>{
        // console.log(resp);
        // res.status(200).json({resp});
         res.render('users/otplogin',{admin:false,phoneNumber,notheader:true})
      });
  





})


//post otp login
 router.get("/otplogin",(req,res)=>{

   let phoneNumber = req.query.phonenumber;
   let otpNumber = req.query.otpnumber;
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
  res.render('users/loginidentify',{admin:false,notheader:true,phonenumberExistError,blockedError})
  phonenumberExistError = "";
  blockedError="";
});

//  post forgotten password
router.post('/loginidentify',(req,res)=>{
  req.session.phonenumber = req.body.number;
  let phoneNumber = req.body.number
  phoneNumber = phoneNumber.toString();
  
  userhelpers.phoneNumberChecking(phoneNumber).then((response)=>{
    if(response?.blocked){
      blockedError = "you are blocked";
      res.redirect('/loginidentify');

    }else{


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

    }

     



    
  
  })
  
});


//password for resend
router.get('/loginresendpassword',verifyLogin,(req,res)=>{
  console.log("edamone")
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
 let phoneNumber = req.session.phonenumber


 
      client.verify
      .services(serviceId)
      .verifications.create({
        to:`+91${req.session.phonenumber}`,
        channel:"sms"
      })
      .then((resp)=>{
        // console.log(resp);
        // res.status(200).json({resp});
         res.render('users/otploginforpassword',{admin:false,phoneNumber,notheader:true})
      });
  





})







//get for password otp
router.get("/otploginforpassword",(req,res)=>{
 
  let phoneNumber = req.query.phonenumber;
  let otpNumber = req.query.otpnumber;
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
  if(req.session.user){

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
  
   req.session.user = response;
   req.session.user.loggedIn = true;
   res.redirect('/')
    
  })
});



//get addtocart

router.get('/addtocartproduct',(req,res)=>{

  let response = {}
  if(req.session.user){
    let productSize = req.query.size;
    let productId = req.query.productid;
    let userId = req.session.user._id
   
    producthelpers.addToCart(productId,productSize,userId).then((result)=>{
      if(result.added){
        response.added = true;
res.json(response);
      }else if(result.exist){
        response.exist = true;
        res.json(response);
      }
    })
  
  }else{
response.sessionrequired = true;
res.json(response);
  }

})

// increase quantityof cart product
 router.post('/change-product-quantity',(req,res)=>{
   producthelpers.changeProductQuantity(req.body).then((response)=>{
res.send(response);
   })
 })









// get user logout
router.get('/userlogout',(req,res)=>{
  
  // req.session.userloggedIn = false;
  req.session.user = null;
  res.redirect('/');
  
})






module.exports = router;
