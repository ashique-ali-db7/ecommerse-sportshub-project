const { response } = require('express');
var express = require('express');
var router = express.Router();

var producthelpers = require('../helpers/producthelpers');
var brandhelpers = require('../helpers/brandhelpers');
var categoryhelpers = require('../helpers/categoryhelpers');
var userhelpers = require('../helpers/userhelpers');
var objectId = require('mongodb').ObjectId;
const session = require('express-session');

const serviceId = process.env.serviceId;
const accountId = process.env.accountId;
const authToken = process.env.authToken;

const client = require("twilio")(accountId,authToken)


var paypal = require('paypal-rest-sdk');
const { Db } = require('mongodb');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  client_id: process.env.client_id,
  client_secret: process.env.client_secret
});




var confirmPasswordError = "";
var emailphonenumberExistError = "";
var loginError = "";
var phonenumberExistError = "";
var blockedError = "";
var cartItemsEmpty = "";
var existDefaultAddress = "";
var paypalcancel = "";


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
router.get('/',blockCheck,async function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
let user = req.session.user;
let cartcount =await producthelpers.getCartCount(req.session.user?._id);
let allCategory = await categoryhelpers.getCategory();
let bannerOne = await categoryhelpers.getBannerOne();
let bannerTwo = await categoryhelpers.getBannerTwo();
let categorybannerOne = await categoryhelpers.getCategoryBannerOne();
let categorybannerTwo = await categoryhelpers.getCategoryBannerTwo();
let categorybannerThree = await categoryhelpers.getCategoryBannerThree();

let productOneForHomecategory = await categoryhelpers.categoryProductOneForHome();
let productOneForHomecategorysubcategory = await categoryhelpers.allSubCategories(productOneForHomecategory.category);
let productOneForHomecategoryProducts = await producthelpers.categoryProductOneForHomeProducts(productOneForHomecategory.category);


let productTwoForHomecategory = await categoryhelpers.categoryProductTwoForHome();
let productTwoForHomecategorysubcategory = await categoryhelpers.allSubCategories(productTwoForHomecategory.category);
let productTwoForHomecategoryProducts = await producthelpers.categoryProductTwoForHomeProducts(productTwoForHomecategory.category);


let todayDate = new Date().toISOString().slice(0, 10);






   let result1 =   await producthelpers.startCategoryOffers(todayDate);


    let result2 = await producthelpers.startProductOffers(todayDate);














  producthelpers.deleteExpiredproductoffers(todayDate).then(()=>{
   producthelpers.deleteExpiredCategoryoffers(todayDate).then(()=>{
    res.render('users/home',{ admin:false,user,cartcount,allCategory,bannerOne,bannerTwo,categorybannerOne,categorybannerTwo,categorybannerThree,productOneForHomecategoryProducts,productTwoForHomecategoryProducts,productOneForHomecategory,productTwoForHomecategory});
   })
  })



  
});


/* GET clothings view. loginverification not required*/
// router.get('/clothings',blockCheck,async function(req, res) {
//   let user = req.session.user;
//   let cartcount =await producthelpers.getCartCount(req.session.user?._id);
//   producthelpers.getProduct().then((products)=>{
   
//     res.render('users/clothings', { admin:false,products,user,cartcount});
//   })
// });

// get all product based on category category
router.get('/shopcategory',blockCheck,async(req,res)=>{
  let user = req.session.user;
    let categoryname =  req.query.categoryname;
    let products =   await  producthelpers.allCategoryProducts(categoryname);
    let allsubcategories =await categoryhelpers.allSubCategories(categoryname);
    let cartcount =await producthelpers.getCartCount(req.session.user?._id);
    let allCategory = await categoryhelpers.getCategory();
    let allBrands  =  await brandhelpers.getBrand();
    let todayDate = new Date().toISOString().slice(0, 10);
  
    let result1 =   await producthelpers.startCategoryOffers(todayDate);


    let result2 = await producthelpers.startProductOffers(todayDate);


    producthelpers.deleteExpiredproductoffers(todayDate).then(()=>{
      producthelpers.deleteExpiredCategoryoffers(todayDate).then(()=>{
        res.render('users/clothings', { admin:false,products,user,cartcount,allCategory,allBrands,allsubcategories});
      })
     })
     
       
    
  
  
    
})

/* GET shopping cart. */
router.get('/shopping-cart',verifyLoginForLoginpage, async(req, res, next) =>{
  let user = req.session.user;
  let userId = req.session.user._id;
  let cartItems = await producthelpers.getCartProducts(userId);
   let total =  await producthelpers.getTotalAmount(req.session.user._id);
  //  let subtotal = await producthelpers.getSubTotalAmount(req.session.user._id);
  if(cartItems.length>=1){
    cartItemsEmpty = false;
  }else{
    cartItemsEmpty = true;
  }
  res.render('users/shoppingnewcart',{ admin:false,user,cartItems,notheader:true,total,cartItemsEmpty});

});


/* GET single product view. loginverification not required*/
router.get('/product',blockCheck,async function(req, res) {
  let user = req.session.user;
  let quantity = {};
  let cartcount =await producthelpers.getCartCount(req.session.user?._id);
  let allCategory = await categoryhelpers.getCategory();
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

  
 
  res.render('users/product',{ admin:false,response,user,quantity,cartcount,allCategory});
})
  
  
});

// get product for wishlist modal


 router.get('/productwishlist',blockCheck,async function(req, res) {
   let user = req.session.user;
   let data = {
     quantity:{

     },
     productdetails:{
       
     }
   }
   
  //  let cartcount =await producthelpers.getCartCount(req.session.user?._id);
  //  let allCategory = await categoryhelpers.getCategory();
 producthelpers.getSingleProductDetails(req.query).then((response)=>{
console.log("idh setttan");
  console.log(response);
   if(response.instock[0].quantity == 0){
 data.quantity.smalloutofstock = true;
   }
   if(response.instock[1].quantity == 0){
    data.quantity.mediumoutofstock = true;
       }
      if(response.instock[2].quantity == 0){
        data.quantity.largeoutofstock = true;
          }
data.productdetails = response;
  res.send(data);
 })
  
  
 });






/* GET checkout. */
router.get('/checkout',verifyLoginForLoginpage, async(req, res) =>{

  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  let user = req.session.user;
  let userId  = req.session.user?._id;
     let defaultaddress =  await userhelpers.getdefaultaddress(req.session.user._id);
      let otheraddress = await userhelpers.getotheraddress(req.session.user._id);
      let total =  await producthelpers.getTotalAmount(req.session.user._id);
      let cartItems = await producthelpers.getCartProducts(userId);
      if(cartItems.length>=1){
        res.render('users/checkout',{ admin:false,user,notheader:true,defaultaddress,otheraddress,total,cartItems,userId,existDefaultAddress,paypalcancel});
        existDefaultAddress = "";
        paypalcancel = "";
      }else{
       
        res.redirect('/')
      }
 
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
      phonenumberExistError = "Entered phone number does not exist";
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
    let subtotal = req.query.subtotal;
    let userId = req.session.user._id
   
    producthelpers.addToCart(productId,productSize,userId,subtotal).then((result)=>{
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
   producthelpers.changeProductQuantity(req.body).then(async(response)=>{
    response.total =  await producthelpers.getTotalAmount(req.body.userId);
    response.updated = true;
    res.json(response);
   
     

   })
 });

 //delete cart product
 router.post('/deletecartproduct',(req,res)=>{
  
   producthelpers.deletecartitems(req.body).then((response)=>{
    res.send("hi")
   })
 })



// checkout address
// router.get('/checkout',verifyLoginForLoginpage,(req,res)=>{
//   res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
//   res.render('users/checkout');
// })



// address post
router.post('/addaddress',verifyLoginForLoginpage,(req,res)=>{
 
  userhelpers.addAddress(req.body,req.session.user._id).then((response)=>{
    if(response.default){
      existDefaultAddress = "Default address already exist only you can edit it"
res.redirect('/checkout')
    }
   else if(response.success){
      res.redirect('/checkout');
    }
  })
})

//edit default address

router.get('/editdefaultaddress',async(req,res)=>{
 
  let defaultaddress =  await userhelpers.getdefaultaddress(req.session.user._id);
  res.send(defaultaddress);
});

router.post('/defaultaddressedit',(req,res)=>{
 userhelpers.editdefaultaddress(req.body,req.session.user._id).then(()=>{
   res.redirect('/checkout');
 })
});

//edit other one address
router.get('/editotheraddress',async(req,res)=>{

 
   userhelpers.editotheraddress(req.query.id,req.session.user._id).then((response)=>{
res.send(response);
   })
});

router.post('/otheraddressedit',(req,res)=>{
 userhelpers.editAndUpdateOtherAddress(req.body,req.session.user._id).then(()=>{
   res.redirect('/checkout');
 })
})


// place order

 router.get('/place-order',async(req,res)=>{

   let deliveryaddressid = req.query.deliveryaddress;
  let userId = req.query.userId;

  req.session.deliveryaddressid = req.query.deliveryaddress;
  req.session.userId = req.query.userId;
 
  let deliveryaddressAndMethod = await userhelpers.editotheraddress(deliveryaddressid,userId)

  deliveryaddressAndMethod.paymentmethod = req.query.paymentmethod;

  req.session.paymentmethod = req.query.paymentmethod


 

  let products = await userhelpers.getCartProductList(userId);
  

  let totalPrice =  await producthelpers.getTotalAmount(userId);
  req.session.totalPrice = totalPrice;
  
  let sampleprice = (totalPrice/70).toFixed(2);
 

 let  totalpriceForpaypal =  sampleprice.toString();




  let onlinepaymentid = new objectId();

 
 

 userhelpers.placeOrder(deliveryaddressAndMethod,products,totalPrice,userId).then(()=>{
 

 
   if(req.query?.paymentmethod === 'cod' ){
    res.json({codsuccess:true})
   }
   
   
   else if(req.query?.paymentmethod === 'razorpay'){
      userhelpers.generateRazorpay(onlinepaymentid,totalPrice).then((response)=>{
      
       
        res.json(response);
      })
       
      
   }else if(req.query?.paymentmethod === 'paypal'){
  
    var create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:3000/success",
          "cancel_url": "http://localhost:3000/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                
               
                  "price": totalpriceForpaypal,
                  "currency": "USD",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "USD",
              "total": totalpriceForpaypal
          },
          "description": "Sports hub."
      }]
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
       for(let i=0;i<payment.links.length;i++){
  if(payment.links[i].rel === 'approval_url'){
  
 let url = payment.links[i].href;
  res.json({data:true,url:url})
  }
       }
        
    }
});
   


   }
  
 })


 });




//get buynow place order



router.get('/buynowplace-order',async(req,res)=>{

  let deliveryaddressid = req.query.deliveryaddress;
 let userId = req.query.userId;

 req.session.deliveryaddressid = req.query.deliveryaddress;
 req.session.userId = req.query.userId;

 let deliveryaddressAndMethod = await userhelpers.editotheraddress(deliveryaddressid,userId)

 deliveryaddressAndMethod.paymentmethod = req.query.paymentmethod;

 req.session.paymentmethod = req.query.paymentmethod;




 let products = await userhelpers.getBuynowProductList(userId);
 

 let totalPrice =  await producthelpers.getBuyNowTotalAmount(userId);
 req.session.totalPrice = totalPrice;
 
 let sampleprice = (totalPrice/70).toFixed(2);


let  totalpriceForpaypal =  sampleprice.toString();




 let onlinepaymentid = new objectId();




userhelpers.buynowplaceOrder(deliveryaddressAndMethod,products,totalPrice,userId).then(()=>{



  if(req.query?.paymentmethod === 'cod' ){
   res.json({codsuccess:true})
  }
  
  
  else if(req.query?.paymentmethod === 'razorpay'){
     userhelpers.generateRazorpay(onlinepaymentid,totalPrice).then((response)=>{
     
      
       res.json(response);
     })
      
     
  }else if(req.query?.paymentmethod === 'paypal'){
 
   var create_payment_json = {
     "intent": "sale",
     "payer": {
         "payment_method": "paypal"
     },
     "redirect_urls": {
         "return_url": "http://localhost:3000/buynowsuccess",
         "cancel_url": "http://localhost:3000/buynowcancel"
     },
     "transactions": [{
         "item_list": {
             "items": [{
               
              
                 "price": totalpriceForpaypal,
                 "currency": "USD",
                 "quantity": 1
             }]
         },
         "amount": {
             "currency": "USD",
             "total": totalpriceForpaypal
         },
         "description": "Sports hub."
     }]
 };

 paypal.payment.create(create_payment_json, function (error, payment) {
   if (error) {
       throw error;
   } else {
      for(let i=0;i<payment.links.length;i++){
 if(payment.links[i].rel === 'approval_url'){
 
let url = payment.links[i].href;
 res.json({data:true,url:url})
 }
      }
       
   }
});
  


  }
 
})


});





 //deleteotheraddress
 router.get('/deleteotheraddress',(req,res)=>{
  let addressId = req.query.addressid;
userhelpers.deleteOtheraddress(addressId,req.session.user._id).then(()=>{
  res.json({status:true})
})
 });


//  order success get
router.get('/ordersuccess',verifyLoginForLoginpage,(req,res)=>{
  let user = req.session.user;

  res.render('users/ordersuccess',{user,admin:false,user,notheader:true})
})

// post verify payment 
router.post('/verify-payment',async(req,res)=>{


  let deliveryaddressAndMethod = await userhelpers.editotheraddress(req.session.deliveryaddressid,req.session.userId)

  deliveryaddressAndMethod.paymentmethod = req.session.paymentmethod;


 

  let products = await userhelpers.getCartProductList(req.session.userId);
  

  let totalPrice =  await producthelpers.getTotalAmount(req.session.userId);



 
 userhelpers.verifyPayment(req.body).then(()=>{
  //  userhelpers.changePaymentStatus(req.body['order[receipt]']).then(()=>{
     userhelpers.deleteCartForPayment(req.session.user._id).then(()=>{
    
       userhelpers.razorpayPlaceorder(deliveryaddressAndMethod,products,totalPrice,req.session.userId).then(()=>{
     
        res.json({status:true})
       })
    
     })
    
  //  })
   .catch(()=>{
res.json({status:false,errMsg:''})
   })
 })
})


// post buynow verify payment 
router.post('/buynowverify-payment',async(req,res)=>{


  let deliveryaddressAndMethod = await userhelpers.editotheraddress(req.session.deliveryaddressid,req.session.userId)

  deliveryaddressAndMethod.paymentmethod = req.session.paymentmethod;


 

  let products = await userhelpers.getBuynowProductList(req.session.userId);
  

  let totalPrice =  await producthelpers.getBuyNowTotalAmount(req.session.userId);



 
 userhelpers.verifyPayment(req.body).then(()=>{
  //  userhelpers.changePaymentStatus(req.body['order[receipt]']).then(()=>{
    //  userhelpers.deleteCartForPayment(req.session.user._id).then(()=>{
    
       userhelpers. buynowrazorpayPlaceorder(deliveryaddressAndMethod,products,totalPrice,req.session.userId).then(()=>{
     
        res.json({status:true})
       })
    
    //  })
    
  //  })
   .catch(()=>{
res.json({status:false,errMsg:''})
   })
 })
})




// get user profile

router.get('/userprofile',verifyLoginForLoginpage,async(req,res)=>{
  let user = req.session.user;
  let cartcount =await producthelpers.getCartCount(req.session.user?._id);
  let allCategory = await categoryhelpers.getCategory();
  let profileExist
  if(user.profile){
    profileExist = true;
  }
 else{
  profileExist = false;
 }

  res.render('users/userprofile',{admin:false,user,cartcount,allCategory,profileExist});
});




// post user profile
router.post('/profile',(req,res)=>{
  userhelpers.saveProfile(req.body,req.session.user._id).then((response)=>{
    req.session.user = response;
    res.redirect('/userprofile')
  })
});

// Edit profile

router.post('/profiledit',(req,res)=>{
  userhelpers.saveProfile(req.body,req.session.user._id).then((response)=>{
    req.session.user = response;
    res.redirect('/userprofile')
  })
})


// get profile addresses
router.get('/profileaddress',async(req,res)=>{
  let user = req.session.user;
  let cartcount =await producthelpers.getCartCount(req.session.user?._id);
  let allCategory = await categoryhelpers.getCategory();
  let defaultaddress =  await userhelpers.getdefaultaddress(req.session?.user._id);
  let otheraddress = await userhelpers.getotheraddress(req.session.user._id);

res.render('users/profileaddress',{admin:false,user,cartcount,allCategory,defaultaddress,otheraddress,existDefaultAddress});
existDefaultAddress = ""
});
//profile address post
router.post('/profileaddaddress',verifyLoginForLoginpage,(req,res)=>{
 
  userhelpers.addAddress(req.body,req.session.user._id).then((response)=>{
    if(response.default){
      existDefaultAddress = "Default address already exist only you can edit it"
res.redirect('/profileaddress')
    }
   else if(response.success){
      res.redirect('/profileaddress');
    }
  })
});

// edit default profile address
router.get('/profileeditdefaultaddress',async(req,res)=>{
  
  console.log("edamone");
 
  let defaultaddress =  await userhelpers.getdefaultaddress(req.session.user._id);
  res.send(defaultaddress);
});

router.post('/profiledefaultaddressedit',(req,res)=>{
  userhelpers.editdefaultaddress(req.body,req.session.user._id).then(()=>{
    res.redirect('/profileaddress');
  })
 });
//  edit other one addres

router.post('/profileotheraddressedit',(req,res)=>{
  userhelpers.editAndUpdateOtherAddress(req.body,req.session.user._id).then(()=>{
    res.redirect('/profileaddress');
  })
 })

 //get user order details

 router.get('/userorderdetails',verifyLoginForLoginpage,async(req,res)=>{
  let user = req.session.user;
  let cartcount =await producthelpers.getCartCount(req.session.user?._id);
  let allCategory = await categoryhelpers.getCategory();
   let userAllOrderedProducts =    await userhelpers.getAllOrderedProductForUser(req.session.user._id);
   res.render('users/userorderdetails',{admin:false,user,cartcount,allCategory,userAllOrderedProducts});
 });

// paypal success

 router.get('/success',async(req,res)=>{
  let user = req.session.user;
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  let deliveryaddressAndMethod = await userhelpers.editotheraddress(req.session.deliveryaddressid,req.session.userId)

  deliveryaddressAndMethod.paymentmethod = req.session.paymentmethod;


 

  let products = await userhelpers.getCartProductList(req.session.userId);
  

  let totalPrice =  await producthelpers.getTotalAmount(req.session.userId);

 

  let sampleprice = (totalPrice/70).toFixed(2);
 

  let  totalpriceForpaypal =  sampleprice.toString();
 
  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": totalpriceForpaypal
        }
    }]
  };


    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
      
    

        userhelpers.deleteCartForPayment(req.session.user._id).then(()=>{
    
          userhelpers.razorpayPlaceorder(deliveryaddressAndMethod,products,totalPrice,req.session.userId).then(()=>{
        
          
            console.log(JSON.stringify(payment));
         
            res.render('users/ordersuccess',{user,admin:false,user,notheader:true})
          })
       
        })

      }
  });
  

  
 });



//buynow paypal success

router.get('/buynowsuccess',async(req,res)=>{
  let user = req.session.user;
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  let deliveryaddressAndMethod = await userhelpers.editotheraddress(req.session.deliveryaddressid,req.session.userId)

  deliveryaddressAndMethod.paymentmethod = req.session.paymentmethod;


 

  let products = await userhelpers.getBuynowProductList(req.session.userId);
  

  let totalPrice =  await producthelpers.getBuyNowTotalAmount(req.session.userId);

 

  let sampleprice = (totalPrice/70).toFixed(2);
 

  let  totalpriceForpaypal =  sampleprice.toString();
 
  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": totalpriceForpaypal
        }
    }]
  };


    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
      
    

        // userhelpers.deleteCartForPayment(req.session.user._id).then(()=>{
    
          userhelpers.buynowrazorpayPlaceorder(deliveryaddressAndMethod,products,totalPrice,req.session.userId).then(()=>{
        
          
            console.log(JSON.stringify(payment));
         
            res.render('users/ordersuccess',{user,admin:false,user,notheader:true})
          })
       
        // })

      }
  });
  

  
 });




 router.get('/cancel',(req,res)=>{
   paypalcancel = "payment is cancelled you can try again"
   res.redirect('/checkout')
 });

 router.get('/buynowcancel',(req,res)=>{
  paypalcancel = "payment is cancelled you can try again"
  res.redirect('/buynowcheckout')
})


// userOrderProductcancel

router.get('/usercancelorder',(req,res)=>{
   userhelpers.userChangeOrderStatus(req.query.orderId,req.query.proId,req.query.size).then(()=>{
     res.json({exist:true})
   })
});


//get buy now

router.get('/addToBuyNowProduct',(req,res)=>{

  let response = {}
  if(req.session.user){
    let productSize = req.query.size;
    let productId = req.query.productid;
    let subtotal = req.query.subtotal;
    let userId = req.session.user._id
   
    producthelpers.addToBuyProduct(productId,productSize,userId,subtotal).then(()=>{
   
        response.ok = true;
res.json(response);
  
     
  
    })
  
  }else{
response.sessionrequired = true;
res.json(response);
  }
 
});




/*buynow GET checkout. */
router.get('/buynowcheckout',verifyLoginForLoginpage, async(req, res) =>{

  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  let user = req.session.user;
  let userId  = req.session.user?._id;
     let defaultaddress =  await userhelpers.getdefaultaddress(req.session.user._id);
      let otheraddress = await userhelpers.getotheraddress(req.session.user._id);
      let total =  await producthelpers.getBuyNowTotalAmount(req.session.user._id);
      let cartItems = await producthelpers.getBuyNowProducts(userId);
      // if(cartItems.length>=1){
        res.render('users/buynowcheckout',{ admin:false,user,notheader:true,defaultaddress,otheraddress,total,cartItems,userId,existDefaultAddress,paypalcancel});
        existDefaultAddress = "";
        paypalcancel = "";
      // }else{
       
        // res.redirect('/')
      // }
 
});

router.get('/wishlist',verifyLoginForLoginpage,async(req,res)=>{
  let user = req.session.user;
    let categoryname =  req.query.categoryname;
    // let products =   await  producthelpers.allCategoryProducts(categoryname);
    let allsubcategories =await categoryhelpers.allSubCategories(categoryname);
    let cartcount =await producthelpers.getCartCount(req.session.user?._id);
    let allCategory = await categoryhelpers.getCategory();
    let allBrands  =  await brandhelpers.getBrand();
     let wishlist  = await producthelpers.getWishListProducts(req.session.user._id);

    let todayDate = new Date().toISOString().slice(0, 10);
    producthelpers.deleteExpiredproductoffers(todayDate).then(()=>{
      producthelpers.deleteCategoryoffers(todayDate).then(()=>{
        res.render('users/wishlist', { admin:false,user,cartcount,allBrands,allsubcategories,allCategory,wishlist});
      })
    })


});


router.post('/addtowishlist',(req,res)=>{

let response = {};


if(req.session.user){
  let productId = req.body.productId;
  let userId  =req.session.user._id;
  
producthelpers.addToWishList(productId,userId).then((result)=>{
  if(result.exist){
response.exist = true;
res.json(response);
  }else{
response.added = true;
res.json(response);
  }
})

}else{
  response.sessionrequired =true;
res.json(response)
}



})



router.get('/removefromwishlistpage',(req,res)=>{
  let proId = req.query.productId;
  producthelpers.removeProductFromWishlistPage(proId,req.session.user._id).then(()=>{
    res.json({status:true})
  })
})




// get user logout
router.get('/userlogout',(req,res)=>{
  
  // req.session.userloggedIn = false;
  req.session.user = null;
  res.redirect('/');
  
})






module.exports = router;
