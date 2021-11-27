var db = require('../config/connection');

var collections = require('../config/collection');

var bcryptjs = require('bcryptjs');
var objectId = require('mongodb').ObjectId;
const { response } = require('express');
const Razorpay = require('razorpay');
var crypto = require('crypto');
const { resolve } = require('path');
var instance = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret,
  });

module.exports = {

    

    emailAndPasswordCheck:(data)=>{
        return new Promise(async(resolve,reject)=>{
            let response={};
            let exist = await db.get().collection(collections.USERS_DETAILS_COLLECTION)
            .findOne({$or:[{phonenumber:data.phonenumber},{emailaddress:data.emailaddress}]})
            if(exist){
            response.exist = true;
            resolve(response)
            }else{
                response.exist = false;
                resolve(response);
            }
          
            //  else{

            //      data.password = await bcryptjs.hash(data.password,10)
            //       db.get().collection(collections.USERS_DETAILS_COLLECTION)
            //      .insertOne(data);
            //      response.exist = false;
            //      resolve(response)
            //  }
        })
    },

    checkLogin:(data)=>{
return new Promise(async(resolve,reject)=>{

let response = {};

let user =await db.get().collection(collections.USERS_DETAILS_COLLECTION).findOne({emailaddress:data.emailaddress});

if(user){
    if(user.blocked){
response.blocked = true;
resolve(response);
    }else{
        bcryptjs.compare(data.password,user.password).then((status)=>{
        
            if(status){
                console.log(status)
                
                response.user = user;
                response.exist = true;
                resolve(response)
            }else{
                response.exist = false;
                resolve(response);
            }
                })
    }

}else{
    response.exist = false;
    resolve(response);
}

})
    },
    otpLogin:(phonenumber)=>{
        return new Promise(async(resolve,reject)=>{
let user = await db.get().collection(collections.USERS_DETAILS_COLLECTION).findOne({phonenumber:phonenumber});
resolve(user);
        })
    },

    phoneNumberChecking:(phonenumber)=>{

        return new Promise(async(resolve,reject)=>{
            let response = {}
            let user = await db.get().collection(collections.USERS_DETAILS_COLLECTION).findOne({phonenumber:phonenumber});
            if(user){
                if(user.blocked){
response.blocked = true;
resolve(response);
                }else{
                    response.exist = true;
                    resolve(response);
                }
             
            }else{
                response.exist = false;
                resolve(response);
            }
        })
    },
    adminLogin:(data)=>{
       return new Promise(async(resolve,reject)=>{
        let   response={}
        let user =   await db.get().collection(collections.ADMIN_DETAILS_COLLECTION).findOne({$and:[{emailaddres:data.emailaddress},{password:data.password}]})
        if(user){
            response.exist = true;
            resolve(response);
        }else{
            response.exist = false;
            resolve(response);
        }
       })
    },


    findNumberChangepassword:(data)=>{
        return new Promise(async(resolve,reject)=>{
            data.newpassword = await bcryptjs.hash(data.newpassword,10);

          let user =  await db.get().collection(collections.USERS_DETAILS_COLLECTION)
            .findOne({phonenumber:data.phonenumber})



            await db.get().collection(collections.USERS_DETAILS_COLLECTION)
            .updateOne({phonenumber:data.phonenumber},{$set:{password:data.newpassword}}).then((data)=>{
              resolve(user);
            })
        })

    },

    addUser:(data)=>{
        data.blocked = false;
return new Promise(async(resolve,reject)=>{
    data.password = await bcryptjs.hash(data.password,10)
   await db.get().collection(collections.USERS_DETAILS_COLLECTION).insertOne(data);
  let user = db.get().collection(collections.USERS_DETAILS_COLLECTION).findOne({phonenumber:data.phonenumber})

   resolve(user);
})


    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
          let alluser = await db.get().collection(collections.USERS_DETAILS_COLLECTION).find().toArray();
       resolve(alluser)
        })
    },
    
    blockUser:(phonenumber)=>{
        return new Promise(async(resolve,reject)=>{
          await db.get().collection(collections.USERS_DETAILS_COLLECTION).updateOne({phonenumber:phonenumber},{$set:{blocked:true}}).then((status)=>{
              resolve();
          })
        })
    },
    unblockUser:(phonenumber)=>{
        return new Promise(async(resolve,reject)=>{
          await db.get().collection(collections.USERS_DETAILS_COLLECTION).updateOne({phonenumber:phonenumber},{$set:{blocked:false}}).then((status)=>{
              resolve();
          })
        })
    },

    blockedOrNot:(phonenumber)=>{
        return new Promise(async(resolve,reject)=>{
         let response = {}
      let user = await db.get().collection(collections.USERS_DETAILS_COLLECTION).findOne({phonenumber:phonenumber});
resolve(user);
        })
    },

    addAddress:(data,userId)=>{
        return new Promise(async(resolve,reject)=>{
          let response = {};
          let _id = new objectId();
          data._id = _id;
     
            if(data.defaultaddress){
              
let exist = await db.get().collection(collections.USERS_DETAILS_COLLECTION).findOne({$and:[{_id:objectId(userId),"address":{$elemMatch:{defaultaddress:"on"}}}]})
if(exist){
    response.default = true;
    resolve(response)
}else{
    db.get().collection(collections.USERS_DETAILS_COLLECTION)
    .updateOne({_id:objectId(userId)},{$push:{address:data}});
    response.success = true
    resolve(response);
}
            }else{
                data.defaultaddress = "";
                db.get().collection(collections.USERS_DETAILS_COLLECTION)
                .updateOne({_id:objectId(userId)},{$push:{address:data}});
                response.success = true
                resolve(response);
            }
        
        })
    },


    getdefaultaddress:(userId)=>{
        return new Promise(async(resolve,reject)=>{
           
      let defaultaddress = await db.get().collection(collections.USERS_DETAILS_COLLECTION)
  .aggregate([
      {$match:{_id:objectId(userId)}},
      {$unwind:"$address"},
      {$match:{"address.defaultaddress":'on'}}
  ]).toArray();
  if(defaultaddress[0]?.address){
    resolve(defaultaddress[0].address)
  }else{
      resolve();
  }

        })

    },
    getotheraddress:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let otheraddress = await db.get().collection(collections.USERS_DETAILS_COLLECTION)
            .aggregate([
                {$match:{_id:objectId(userId)}},
                {$unwind:"$address"},
                {$match:{"address.defaultaddress":""}}
            ]).toArray();
            resolve(otheraddress);
        })
    },

    editdefaultaddress:(data,userId)=>{
  
        return new Promise(async(resolve,reject)=>{

       


           await db.get().collection(collections.USERS_DETAILS_COLLECTION).updateOne({_id:objectId(userId),"address._id":objectId(data._id)},{$set:{"address.$.name":data.name,"address.$.housename":data.housename,"address.$.street":data.street,"address.$.district":data.district,"address.$.state":data.state,"address.$.pincode":data.pincode,"address.$.mobilenumber":data.mobilenumber}})
          resolve();
        })
    },
    editotheraddress:(otheraddressid,userId)=>{

        return new Promise(async(resolve,reject)=>{
let getSingleOtherAddressForEdit =  await db.get().collection(collections.USERS_DETAILS_COLLECTION)
.aggregate([
    {$match:{_id:objectId(userId)}},
    {$unwind:"$address"},
    {$match:{"address._id":objectId(otheraddressid)}}
]).toArray();

 resolve(getSingleOtherAddressForEdit[0].address)
        })

    },

    editAndUpdateOtherAddress:(data,userId)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collections.USERS_DETAILS_COLLECTION).updateOne({_id:objectId(userId),"address._id":objectId(data._id)},{$set:{"address.$.name":data.name,"address.$.housename":data.housename,"address.$.street":data.street,"address.$.district":data.district,"address.$.state":data.state,"address.$.pincode":data.pincode,"address.$.mobilenumber":data.mobilenumber}});
            resolve();
        })

    },
    

     getCartProductList:(userId)=>{
     
       
         return new Promise(async(resolve,reject)=>{

        let cart = await db.get().collection(collections.CART_DETAILS_COLLECTION).findOne({user:objectId(userId)})
        resolve(cart?.products);
         })
     },


     placeOrder:(orderdetails,products,total,userId)=>{
        
       return new Promise(async(resolve,reject)=>{
          
           if(orderdetails.paymentmethod === 'cod'){
            let status = "placed";
            products.array.forEach(element => {
                element.status = status;
            });

     let orderObj = {
         deliveryDetails:{
            name: orderdetails.name,
            housename: orderdetails.housename,
            street: orderdetails.street,
            district: orderdetails.district,
            state: orderdetails.state,
            pincode: orderdetails.pincode,
            mobilenumber: orderdetails.mobilenumber
         },
         userId:objectId(userId),
         paymentmethod:orderdetails.paymentmethod,
         products:products,
        
         total:total,
         date:new Date()
     }
     
     db.get().collection(collections.ORDER_DETAILS_COLLECTION).insertOne(orderObj).then((response)=>{
       
            db.get().collection(collections.CART_DETAILS_COLLECTION).remove({user:objectId(userId)})
             let id = new objectId();
        
         resolve();
     })
    }else if(orderdetails.paymentmethod === 'razorpay'){
       
     


       
        
         resolve();
    }
       })
    },


    deleteOtheraddress:(addressId,userId)=>{
        db.get().collection(collections.USERS_DETAILS_COLLECTION).update({_id:objectId(userId)},{$pull:{"address":{_id:objectId(addressId)}}})
    },

    getOrderDetails:()=>{
        
        return new Promise(async(resolve,reject)=>{
           let allOrders = await db.get().collection(collections.ORDER_DETAILS_COLLECTION).find().toArray();
           resolve(allOrders);
        })
    },
    // changeOrderStatus:(orderid,orderstatus)=>{

    //     return new Promise(async(resolve,reject)=>{
    //        await db.get().collection(collections.ORDER_DETAILS_COLLECTION).updateOne({_id:objectId(orderid)},{$set:{status:orderstatus}})
    //        resolve();
    //     })

    // },
    getorderedproditdetils:(orderid)=>{

        return new Promise(async(resolve,reject)=>{

     let vieworderproductdetails =  await db.get().collection(collections.ORDER_DETAILS_COLLECTION)
     .aggregate([
         {
             $match:{_id:objectId(orderid)}
         },
         {
             $unwind:'$products'
         },
          {
              $project:{
                 item:"$products.item",
                  quantity:"$products.quantity",
                  size:"$products.size",
                  subtotal:"$products.subtotal"
              }
            },
              {
              $lookup:{
                  from:collections.PRODUCTS_DETAILS_COLLECTION,
                  localField:'item',
                  foreignField:'_id',
             as:'productdetail'
             
                      }
              },
              {
                  $project:{
                      item:1,quantity:1,size:1,subtotal:1,productdetail:{$arrayElemAt:['$productdetail',0]}
                  }
              }
     ]).toArray();

      resolve(vieworderproductdetails);

        })

       
        
    },

    generateRazorpay:(orderid,totalPrice)=>{
       ;
        return new Promise(async(resolve,reject)=>{
        var options = {
            amount:totalPrice*100,
            currency:"INR",
            receipt:""+orderid
        } ;
        instance.orders.create(options,function(err,order){
            if(err){
              
                console.log(err);
            }else{
              
                console.log("New order:",order);
                resolve(order) 
            }
          
        })           
        })
    },

    verifyPayment:(data)=>{
        return new Promise(async(resolve,reject)=>{
          let hmac = crypto.createHmac('sha256',process.env.key_secret)
          hmac.update(data['payment[razorpay_order_id]']+'|'+data['payment[razorpay_payment_id]'])
          hmac=hmac.digest('hex')
          if(hmac==data['payment[razorpay_signature]']){
              resolve()
          }else{
              reject()
          }
        })
    },
    // changePaymentStatus:(orderId)=>{
       
    //      return new Promise(async(resolve,reject)=>{
    //          db.get().collection(collections.ORDER_DETAILS_COLLECTION)
    //          .updateOne({_id:objectId(orderId)},{$set:{status:'placed'}}).then(()=>{
    //              resolve();
    //          })
    //      })
    // },


    deleteCartForPayment:(userId)=>{
        return new Promise(async(resolve,reject)=>{

            db.get().collection(collections.CART_DETAILS_COLLECTION).remove({user:objectId(userId)}).then(()=>{
                resolve();
            })
        })
    },


    razorpayPlaceorder:(orderdetails,products,total,userId)=>{
        console.log("please");
        console.log(products);
        return new Promise(async(resolve,reject)=>{

            let status = "placed";
            products.array.forEach(element => {
                element.status = status;
            });
      

     let orderObj = {
         deliveryDetails:{
            name: orderdetails.name,
            housename: orderdetails.housename,
            street: orderdetails.street,
            district: orderdetails.district,
            state: orderdetails.state,
            pincode: orderdetails.pincode,
            mobilenumber: orderdetails.mobilenumber
         },
         userId:objectId(userId),
         paymentmethod:orderdetails.paymentmethod,
         products:products,
        
         total:total,
         date:new Date()
     }
     
     db.get().collection(collections.ORDER_DETAILS_COLLECTION).insertOne(orderObj).then((response)=>{
       
            db.get().collection(collections.CART_DETAILS_COLLECTION).remove({user:objectId(userId)})
            
        
         resolve();
     })
       
   
      
    
    })
    },
    saveProfile:(data,userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USERS_DETAILS_COLLECTION).update({_id:objectId(userId)},{$set:{profile:data}}).then(async(response)=>{
       var details =   await  db.get().collection(collections.USERS_DETAILS_COLLECTION).findOne({_id:objectId(userId)})
              console.log("kjsf");
              console.log(details);
                resolve(details);
            })
        })
    },
//     profilexist:(userId)=>{
//         return new Promise(async(resolve,reject)=>{

//             let userprofile =await db.get().collection(collections.USERS_DETAILS_COLLECTION).findOne({_id:objectId(userId), 'profile' : { '$exists' : true }});
//             resolve(userprofile)
//     })
// }
    



}