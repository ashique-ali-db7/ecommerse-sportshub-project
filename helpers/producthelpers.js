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
        proObj.quantity = 1,
        proObj.size = "m"
      }

      if(size === "l"){
     
            proObj.item = objectId(proId),
            proObj.quantity = 1,
            proObj.size = "l"
        
      }
     
return new Promise(async(resolve,reject)=>{

let response = {};


    let userCart = await db.get().collection(collections.CART_DETAILS_COLLECTION).findOne({user:objectId(userId)});
  
   if(userCart){
    
   let userProductExist = await db.get().collection(collections.CART_DETAILS_COLLECTION).aggregate([
       {$match:{user:objectId(userId)}},
       {$unwind:"$products"},
       {$match:{"products.item":objectId(proId),"products.size":size}},
    ]).toArray();
    console.log(userProductExist);
if(userProductExist.length>0){
    response.exist = true;
    resolve(response);
   
}else{

    db.get().collection(collections.CART_DETAILS_COLLECTION)
    .updateOne({user:objectId(userId)},{$push:{products:proObj}})
    response.added = true;
    resolve(response);

 

  
}

 
   
  
  
       
     
     
}
     

   
   
   
   else{
       let cartObj = {
           user:objectId(userId),
           products:[proObj]
       }
       db.get().collection(collections.CART_DETAILS_COLLECTION).insertOne(cartObj).then((response)=>{
           response.added = true;
           resolve(response);
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
    {
        $unwind:"$products"
    },
    {
        $project:{
            item:"$products.item",
            quantity:"$products.quantity",
            size:'$products.size'
        }
    },
    {
        $lookup:{
            from:collections.PRODUCTS_DETAILS_COLLECTION,
            localField:'item',
            foreignField:'_id',
            as:'productdetails'    }
    },
    {
        $project:{
            item:1,quantity:1,size:1,productdetails:{$arrayElemAt:['$productdetails',0]}
        }
    }    

]).toArray()
resolve(cartItems)


      })
  },

  changeProductQuantity:(data)=>{
   
      data.count = Number(data.count);
      return new Promise((resolve,reject)=>{
db.get().collection(collections.CART_DETAILS_COLLECTION)
.updateOne({$and:[{_id:objectId(data.cart),"products":{$elemMatch:{item:objectId(data.product),size:data.size}}}]},
            {
                $inc:{'products.$.quantity':data.count}
            } 
).then(()=>{
    resolve();
})
      })
  }


}