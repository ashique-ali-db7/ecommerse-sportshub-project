var db = require('../config/connection');

var collections = require('../config/collection');

var objectId = require('mongodb').ObjectId;
const { response } = require('express');
module.exports = {
    addProduct:(data)=>{
data.smallquantity = Number(data.smallquantity);
data.mediumquantity = Number(data.mediumquantity);
data.largequantity = Number(data.largequantity);



let smallid = new objectId();
let mediumid = new objectId();
let largeid = new objectId();

return new Promise(async(resolve,reject)=>{

    let response = {}

   productExist = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({productid:data.productid});

   if(productExist){
       response.exist = true;
       resolve(response);
   }else{

    
    await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION)
    .insertOne({productid:data.productid,productname:data.productname,category:data.category,subcategory:data.subcategory,brand:data.brand,landingprice:data.landingprice,price:data.price,description:data.description,instock:[{id:smallid,size:'s',quantity:data.smallquantity},{id:mediumid,size:'m',quantity:data.mediumquantity},{id:largeid,size:'l',quantity:data.largequantity}]}).then((data)=>{
      
        response.exist = false;
        response.data = data;
    
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
    data.smallquantity = Number(data.smallquantity);
data.mediumquantity = Number(data.mediumquantity);
data.largequantity = Number(data.largequantity);
      return new Promise(async(resolve,reject)=>{


await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION)
 .updateOne({productid:productid.productid},{$set:{productname:data.productname,category:data.category,subcategory:data.subcategory,brand:data.brand,landingprice:data.landingprice,price:data.price,description:data.description,instock:[{size:'s',quantity:data.smallquantity},{size:'m',quantity:data.mediumquantity},{size:'l',quantity:data.largequantity}]}}).then((status)=>{
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
  instock:(id)=>{
      

return new Promise(async(resolve,reject)=>{
 let stockArray =   await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({_id:objectId(id)},{instock:1})
console.log(stockArray);
 
})
  },


  addToCart:(proId,size,userId)=>{
      let proObj = {}
    
      
      if(size === "s"){
       
        proObj.item = objectId(proId),
        proObj.quantity = 1,
        proObj.size = "s"
      }

      if(size === "m"){
        proObj.item = objectId(proId),
        proObj.mediumquantity = 1,
        proObj.size = "m"
      }

      if(size === "l"){
     
            proObj.item = objectId(proId),
            proObj.largequantity = 1,
            proObj.size = "l"
        
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