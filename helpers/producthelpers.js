var db = require('../config/connection');

var collections = require('../config/collection');

var objectId = require('mongodb').ObjectId;
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
  }


}