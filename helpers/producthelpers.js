var db = require('../config/connection');

var collections = require('../config/collection');

var objectId = require('mongodb').ObjectId;
const { response } = require('express');
module.exports = {
    addProduct:(data)=>{

return new Promise(async(resolve,reject)=>{

    let response = {}

   productExist = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({productid:data.productid});

   if(productExist){
       response.exist = true;
       resolve(response);
   }else{

    
    await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).insertOne(data).then((data)=>{
        console.log(data)
        response.exist = false;
        response.data = data;
        console.log(response);
        resolve(response)
        
    });
   }


})

    },

  getProduct:()=>{
      return new Promise(async(resolve,reject)=>{
        let allProducts = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find().toArray();

        resolve(allProducts);
      })
  },
  getSingleProductDetails:(data)=>{
return new Promise(async(resolve,reject)=>{
    let singleProduct = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({productid:data.productid});
    resolve(singleProduct);
})

  },
  getSingleProductDetailsForEdit:(data)=>{
  
      return new Promise(async(resolve,reject)=>{
          let productDetails = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({_id:objectId(data.id)}) 
          resolve(productDetails);

      })

  },

  editProduct:(data,productid)=>{
     console.log(data);
      return new Promise(async(resolve,reject)=>{


await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION)
 .updateOne({productid:productid.productid},{$set:data},{upsert:true}).then((status)=>{
    resolve(status);
 })


      })
  },
  deleteProduct:(data)=>{
      return new Promise(async(resolve,reject)=>{
          await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION)
          .deleteOne({_id:objectId(data.id)}).then((data)=>{
              resolve(data);
          })
      })
  },


  addToCart:(proId,size,userId)=>{
      let proObj = {}
      if(size === "smallquantity"){
       
        proObj.item = objectId(proId),
        proObj.smallquantity = 1,
        proObj.size = "smallquantity"
      }

      if(size === "mediumquantity"){
        proObj.item = objectId(proId),
        proObj.mediumquantity = 1,
        proObj.size = "mediumquantity"
      }

      if(size === "largequantity"){
     
            proObj.item = objectId(proId),
            proObj.largequantity = 1,
            proObj.size = "largequantity"
        
      }
     
return new Promise(async(resolve,reject)=>{
    let userCart = await db.get().collection(collections.CART_DETAILS_COLLECTION).findOne({user:objectId(userId)})

   if(userCart){
db.get().collection(collections.CART_DETAILS_COLLECTION)
.updateOne({user:objectId(userId)},{$push:{products:proObj}})
   }else{
       let cartObj = {
           user:objectId(userId),
           products:[proObj]
       }
       db.get().collection(collections.CART_DETAILS_COLLECTION).insertOne(cartObj).then((response)=>{
           resolve();
       })
   }

})
  },




  getCartProducts:(userId)=>{
      return new Promise(async(resolve,reject)=>{
     
let cartItems =await db.get().collection(collections.CART_DETAILS_COLLECTION)
.aggregate([
    {
        $match:{user:objectId(userId)}
    },


]).toArray()



      })
  }


}