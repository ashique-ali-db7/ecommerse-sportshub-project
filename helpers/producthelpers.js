var db = require('../config/connection');

var collections = require('../config/collection');

var objectId = require('mongodb').ObjectId;
const { response } = require('express');
const { ItemAssignmentContext } = require('twilio/lib/rest/numbers/v2/regulatoryCompliance/bundle/itemAssignment');
const collection = require('../config/collection');
const { Collection } = require('mongodb');
module.exports = {
    addProduct:(data)=>{
data.smallquantity = Number(data.smallquantity);
data.mediumquantity = Number(data.mediumquantity);
data.largequantity = Number(data.largequantity);
data.price = Number(data.price);
data.landingprice = Number(data.landingprice);



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
    .insertOne({productid:data.productid,productname:data.productname,category:data.category,subcategory:data.subcategory,brand:data.brand,landingprice:data.price,price:data.price,description:data.description,instock:[{id:smallid,size:'s',quantity:data.smallquantity},{id:mediumid,size:'m',quantity:data.mediumquantity},{id:largeid,size:'l',quantity:data.largequantity}]}).then((data)=>{
      
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
data.price = Number(data.price);
data.landingprice = Number(data.landingprice);
      return new Promise(async(resolve,reject)=>{


await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION)
 .updateOne({productid:productid.productid},{$set:{productname:data.productname,category:data.category,subcategory:data.subcategory,brand:data.brand,landingprice:data.price,price:data.price,description:data.description,instock:[{size:'s',quantity:data.smallquantity},{size:'m',quantity:data.mediumquantity},{size:'l',quantity:data.largequantity}]}}).then((status)=>{
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


  addToCart:(proId,size,userId,subtotal)=>{
   
      let proObj = {}
    
      
      if(size === "s"){
       
        proObj.item = objectId(proId),
        proObj.quantity = 1,
        proObj.size = "s",
        proObj.subtotal = Number(subtotal);
      }

      if(size === "m"){
        proObj.item = objectId(proId),
        proObj.quantity = 1,
        proObj.size = "m",
        proObj.subtotal = Number(subtotal);
      }

      if(size === "l"){
     
            proObj.item = objectId(proId),
            proObj.quantity = 1,
            proObj.size = "l",
            proObj.subtotal = Number(subtotal);
        
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
            size:'$products.size',
            subtotal:"$products.subtotal"
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
            item:1,quantity:1,size:1,subtotal:1,productdetails:{$arrayElemAt:['$productdetails',0]}
        }
    }    

]).toArray()

resolve(cartItems)


      })
  },

  changeProductQuantity:(data)=>{
   data.price = Number(data.price)
      data.count = Number(data.count);
      return new Promise((resolve,reject)=>{

        if(data.count == -1){
            db.get().collection(collections.CART_DETAILS_COLLECTION)
            .updateOne({$and:[{_id:objectId(data.cart),"products":{$elemMatch:{item:objectId(data.product),size:data.size}}}]},
                        {$inc:{'products.$.quantity':data.count,'products.$.subtotal':data.price * -1}} 
            ).then(()=>{
              
                resolve({status:true});
            })



        }else{

            db.get().collection(collections.CART_DETAILS_COLLECTION)
            .updateOne({$and:[{_id:objectId(data.cart),"products":{$elemMatch:{item:objectId(data.product),size:data.size}}}]},
                        {$inc:{'products.$.quantity':data.count,'products.$.subtotal':data.price}} 
            ).then(()=>{
              
                resolve({status:true});
            })



        }





      })
  },
 
  deletecartitems:(data)=>{
      console.log(data);
      return new Promise(async(resolve,reject)=>{
          await db.get().collection(collections.CART_DETAILS_COLLECTION)
          .updateOne({_id:objectId(data.cartId)},{$pull:{products:{item:objectId(data.proId),size:data.size}}}).then((response)=>{
             resolve();
          })
      })
  },
  getTotalAmount:(userId)=>{

    return new Promise(async(resolve,reject)=>{
     
        let total =await db.get().collection(collections.CART_DETAILS_COLLECTION)
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
            },
            {
                $group:{
                    _id:null,
                    total:{$sum:{$multiply:['$quantity','$productdetails.price']}}
                }
            }    
        
        ]).toArray()
       if(total[0]?.total){
        resolve(total[0].total)
       }else{
           resolve();
       }
       
        
              })


},
// getSubTotalAmount:(userId)=>{

//     return new Promise(async(resolve,reject)=>{
     
//         let subtotal =await db.get().collection(collections.CART_DETAILS_COLLECTION)
//         .aggregate([
//             {
//                 $match:{user:objectId(userId)}
//             },
//             {
//                 $unwind:"$products"
//             },
//             {
//                 $project:{
//                     item:"$products.item",
//                     quantity:"$products.quantity",
//                     size:'$products.size'
//                 }
//             },
//             {
//                 $lookup:{
//                     from:collections.PRODUCTS_DETAILS_COLLECTION,
//                     localField:'item',
//                     foreignField:'_id',
//                     as:'productdetails'    }
//             },
//             {
//                 $project:{
//                     item:1,quantity:1,size:1,productdetails:{$arrayElemAt:['$productdetails',0]}
//                 }
//             },
//             {
//                 $group:{
//                     _id:{item:"$item",size:"$size"},
//                     subtotal:{$sum:{$multiply:['$quantity','$productdetails.price']}}
//                 }
//             }    
        
//         ]).toArray()
       
//        resolve(subtotal);
        
//               })




// }


getCartCount:(userId)=>{

    return new Promise(async(resolve,reject)=>{
        let count = 0;
         let cart =await db.get().collection(collections.CART_DETAILS_COLLECTION).findOne({user:objectId(userId)});
         if(cart){

            count = cart.products.length;
         }
         resolve(count);
    })

},

allCategoryProducts:(categoryname)=>{
    return new Promise(async(resolve,reject)=>{

   let allSingleCategoryProduct =   await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find({category:categoryname}).toArray();
   resolve(allSingleCategoryProduct);

    })
},


categoryProductOneForHomeProducts:(category)=>{
    return new Promise(async(resolve,reject)=>{
      let homeProductsOne = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find({category:category}).toArray();
      resolve(homeProductsOne);
    })
   
},

categoryProductTwoForHomeProducts:(category)=>{
    return new Promise(async(resolve,reject)=>{
        let homeProductsTwo = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find({category:category}).toArray();
        resolve(homeProductsTwo);
      })
},

addCategoryOffer:(data)=>{
    return new Promise(async(resolve,reject)=>{
let result={};
       let exist =  await db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION).findOne({category:data.category});

       if(exist){
        
           result.exist = true
           resolve(result);
       }
       else{
       
       db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION).insertOne(data); 


      let productsForoffer =  await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find({category:data.category,offer:{$exists:false}}).toArray();
    
    


      await productsForoffer.map(async(product)=>{
          let price = product.landingprice;
          let offer = (price/100)*data.discountpercentage;
          let offerprice = (price - offer).toFixed(0);
          offerprice = Number(offerprice);
          

          db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({_id:objectId(product._id)},{$set:{price:offerprice,offer:true,offerpercentage:data.discountpercentage}})

        
      })

      result.exist = false;
        
      resolve(result);

       

       }
    })
},


getAllCategoryOffers:()=>{
    return new Promise(async(resolve,reject)=>{

        let allCategoryOffers =await db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION).find().toArray();
    
        resolve(allCategoryOffers)
    })
},
addProductOffer:(data)=>{
    return new Promise(async(resolve,reject)=>{
        let response = {};
        let productAlreadyHaveOffer =await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({productname:data.productname,offer:{$exists:true}});
        console.log("idadada");
        console.log(productAlreadyHaveOffer);
      if(productAlreadyHaveOffer){
  response.exist = true;
  resolve(response);
      }else{
          db.get().collection(collections.PRODUCTOFFER_DETAILS_COLLECTION).insertOne(data);
        let productdetails = await  db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({productname:data.productname});

        let price = productdetails?.landingprice;
        let offer = (price/100)*data.discount;
        let offerprice = (price - offer).toFixed(0);
        offerprice = Number(offerprice);

         db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({productname:data.productname},{$set:{price:offerprice,offer:true,offerpercentage:data.discount}});
         response.exist = false;
         resolve(response);
      }
    })
},

getAllProductsOffers:()=>{
    return new Promise(async(resolve,reject)=>{
        let allproductOffers =  await db.get().collection(collections.PRODUCTOFFER_DETAILS_COLLECTION).find().toArray();
        resolve(allproductOffers)
    })
},

categoryoffereditdataForEdit:(id)=>{
    return new Promise(async(resolve,reject)=>{
        let categoryoffer = await db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION).findOne({_id:objectId(id)});
        resolve(categoryoffer);
    })
},
editCategoryOffer:(data)=>{
    return new Promise(async(resolve,reject)=>{
        let dataOfProductOffer = await db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION).findOne({category:data.category})
        db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION)
        .updateOne({category:data.category},{$set:{discountpercentage:data.discountpercentage,caofferstartdate:data.caofferstartdate,caofferenddate:data.caofferenddate}});


        let productsForoffer =  await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find({category:data.category,offer:{$exists:true},offerpercentage:dataOfProductOffer.discountpercentage}).toArray();

        await productsForoffer.map(async(product)=>{
            let price = product.landingprice;
            let offer = (price/100)*data.discountpercentage;
            let offerprice = (price - offer).toFixed(0);
            offerprice = Number(offerprice);
            
  
            db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({_id:objectId(product._id)},{$set:{price:offerprice,offer:true,offerpercentage:data.discountpercentage}})
            resolve();
  
        })

    })
},

deleteCategoryOffers:(data)=>{
    console.log(data);
return new Promise(async(resolve,reject)=>{
   db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION).deleteOne({category:data.category});

   let allProducts = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find({category:data.category,offerpercentage:data.percentage}).toArray();
   
   await allProducts.map(async(product)=>{
     let landingprice = product.landingprice;
    // let offer = (price/100)*data.discountpercentage;
    // let offerprice = (price - offer).toFixed(0);
    // offerprice = Number(offerprice);

    db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({_id:objectId(product._id)},{$unset:{offer:"",offerpercentage:""}});
    db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({_id:objectId(product._id)},{$set:{price:landingprice}});


    
resolve();
    // db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({_id:objectId(product._id)},{$set:{price:offerprice,offer:true,offerpercentage:data.discountpercentage}})
    // resolve();



})

})
},


getEditOfferProduct:(data)=>{
    return new Promise(async(resolve,reject)=>{
        let productOffer =await db.get().collection(collections.PRODUCTOFFER_DETAILS_COLLECTION).findOne({_id:objectId(data.id)})
        resolve(productOffer);
    })
},



editProductOffer:(data)=>{
    console.log(data);

return new Promise(async(resolve,reject)=>{
    db.get().collection(collections.PRODUCTOFFER_DETAILS_COLLECTION).updateOne({productname:data.productname},{$set:{discount:data.discountpercentageproduct,profferstartdate:data.profferstartdate,profferenddate:data.profferenddate}});

   let productdetails =  await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({productname:data.productname})

   let price = productdetails.landingprice;
   let offer = (price/100)*data.discountpercentageproduct;
   let offerprice = (price - offer).toFixed(0);
   offerprice = Number(offerprice);

   db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({productname:data.productname},{$set:{price:offerprice,offer:true,offerpercentage:data.discountpercentageproduct}});

resolve();
})

},

deleteProductOffers:(data)=>{
   
return new Promise(async(resolve,reject)=>{
   db.get().collection(collections.PRODUCTOFFER_DETAILS_COLLECTION).deleteOne({productname:data.productname});

  let product =  await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({productname:data.productname});

  db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({productname:data.productname},{$set:{price:product.landingprice}});
  db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({productname:data.productname},{$unset:{offer:"",offerpercentage:""}});
  resolve();
})
},


 deleteExpiredproductoffers:(date)=>{
 
 return new Promise(async(resolve,reject)=>{

  let existingProductOffer =  await db.get().collection(collections.PRODUCTOFFER_DETAILS_COLLECTION).findOne({profferenddate:date});

   if(existingProductOffer){

db.get().collection(collections.PRODUCTOFFER_DETAILS_COLLECTION).deleteOne({productname:existingProductOffer.productname});


let product =  await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({productname:existingProductOffer.productname});

db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({productname:product.productname},{$set:{price:product.landingprice}});
db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({productname:product.productname},{$unset:{offer:"",offerpercentage:""}});
resolve();

   }else{
    resolve(); 
   }
    
 })
 },


 deleteCategoryoffers:(date)=>{
 return new Promise(async(resolve,reject)=>{

    let existingCategoryOffer = await db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION).findOne({caofferenddate:date});
    if(existingCategoryOffer){
db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION).deleteOne({caofferenddate:date})


        let allProducts = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find({category:existingCategoryOffer.category,offerpercentage:existingCategoryOffer.discountpercentage}).toArray();

         await allProducts.map(async(product)=>{
        //   let landingprice = product.landingprice;
        //  // let offer = (price/100)*data.discountpercentage;
        //  // let offerprice = (price - offer).toFixed(0);
        //  // offerprice = Number(offerprice);
     
          db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({_id:objectId(product._id)},{$unset:{offer:"",offerpercentage:""}});
          db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({_id:objectId(product._id)},{$set:{price:product.landingprice}});


         resolve();

    }
         )
 }else{
     resolve();
 }
})
 },

 deliveredOrders:()=>{
     return new Promise(async(resolve,reject)=>{
      let result =  await  db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
            {
                 $unwind:"$products"
             },
             {
                 $match:{'products.status':'delivered'}
             },
             {
                 $count:"deliverdorders"
             }
         ]).toArray();
      if(result[0]?.deliverdorders){
        resolve(result[0].deliverdorders);
      }else{
          resolve();
      }
        
     })
 },
 placedOrders:()=>{
    return new Promise(async(resolve,reject)=>{
        let result =  await  db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
              {
                   $unwind:"$products"
               },
               {
                   $match:{'products.status':'placed'}
               },
               {
                   $count:"placeddorders"
               }
           ]).toArray();
        if(result[0]?.placeddorders){
            resolve(result[0].placeddorders);
        }else{
            resolve();
        }
          
       })
 },
 pendingOrders:()=>{
    return new Promise(async(resolve,reject)=>{
        let result =  await  db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
              {
                   $unwind:"$products"
               },
               {
                   $match:{'products.status':'pending'}
               },
               {
                   $count:"pendingdorders"
               }
           ]).toArray();
        if(result[0]?.pendingdorders){
            resolve(result[0].pendingdorders);
        }else{
resolve();
        }
          
       })
 },
 canceledOrders:()=>{
    return new Promise(async(resolve,reject)=>{
        let result =  await  db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
              {
                   $unwind:"$products"
               },
               {
                   $match:{'products.status':'canceled'}
               },
               {
                   $count:"canceleddorders"
               }
           ]).toArray();
        if(result[0]?.canceleddorders){
            resolve(result[0].canceleddorders);
        }else{
resolve();
        }
          
       })
 },
 totalOrders:()=>{
     return new Promise(async(resolve,reject)=>{
         let totalCount = await db.get().collection(collections.ORDER_DETAILS_COLLECTION).count()
       resolve(totalCount)
     })
 },
 totalRevenue:()=>{
     return new Promise(async(resolve,reject)=>{
         let totalRevenue  =await db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
             {
                 $unwind:"$products"
                },
                {
                    $match:{'products.status':'delivered'}

                },
                {
                    $project:{
                        subtotal:'$products.subtotal',
                       
                    },

                },
              {
                 $project:{
                     subtotal:1,
                     _id:0
                 }
                 
              },
              {
                  $group:{
                 _id:null,
                 total:{$sum:'$subtotal'}
                  }
              }
                

         ]).toArray();
        if(totalRevenue[0]?.total){
            resolve(totalRevenue[0].total);
        }else{
resolve();
        }
         
     })
 },
 totalUsers:()=>{
     
    return new Promise(async(resolve,reject)=>{
       let users = await db.get().collection(collections.USERS_DETAILS_COLLECTION).count();

       resolve(users);
    })
 },

 totalProducts:()=>{
     return new Promise(async(resolve,reject)=>{
        let products = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).count();

        resolve(products);
     })
 },

 paymentCount:()=>{
     return new Promise(async(resolve,reject)=>{
         let data  = await db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
             {
                 $project:{
                     payments:'$paymentmethod'
                 }
             },
             {
                 $group:{
                     _id:'$payments',
                     count:{$sum:1}
                 }
             },{
                 $sort:{_id:1}
             },
         ]).toArray();
       resolve(data);
     })
 },

 dailysalescount:()=>{




    {
        $unwind:"$products"
       },
       {
           $match:{'products.status':'delivered'}

       },
       {
           $project:{
               subtotal:'$products.subtotal',
              
           },

       },
     {
        $project:{
            subtotal:1,
            _id:0
        }
        
     },
     {
         $group:{
        _id:null,
        total:{$sum:'$subtotal'}
         }
     }




    return new Promise(async(resolve,reject)=>{
        let data =await db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
            {
               $project:{
                   date:"$date"
               }
            },
            {
                $group:{
                    _id:"$date",
                    count:{$sum:1}
                }
            },
            {
                $sort:{_id:1}
            },
            {
                $limit:7
            }
        ]).toArray();
        console.log("ordere");
      console.log(data);
       resolve(data)
    })
   
   
 },

 totalCategorysales:()=>{
     return new Promise(async(resolve,reject)=>{

        let categorywisesales =  await db.get().collection(collections.ORDER_DETAILS_COLLECTION)
        .aggregate([
           
          
            {
                $unwind:'$products'
            },
             {
                 $project:{
                    item:"$products.item",
                  
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
                         item:1,productdetail:{$arrayElemAt:['$productdetail.category',0]}
                     }
                 },{
                     $group:{
                         _id:"$productdetail",
                         count:{$sum:1}
                     }
                 },
              
        ]).toArray();
      
        var newArraycategorywisesales = categorywisesales.filter((item) => item._id !== null);
      resolve(newArraycategorywisesales)
     
     
     })
 }




}