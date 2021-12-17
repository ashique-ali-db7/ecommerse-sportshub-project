var db = require('../config/connection');

var collections = require('../config/collection');

var objectId = require('mongodb').ObjectId;
const { response } = require('express');
const { ItemAssignmentContext } = require('twilio/lib/rest/numbers/v2/regulatoryCompliance/bundle/itemAssignment');
const collection = require('../config/collection');
const { Collection } = require('mongodb');
const { USERS_DETAILS_COLLECTION } = require('../config/collection');
module.exports = {
    addProduct: (data) => {
        data.smallquantity = Number(data.smallquantity);
        data.mediumquantity = Number(data.mediumquantity);
        data.largequantity = Number(data.largequantity);
        data.price = Number(data.price);
        data.landingprice = Number(data.landingprice);
       data.firstprice = Number(data.firstprice);


        let smallid = new objectId();
        let mediumid = new objectId();
        let largeid = new objectId();

        return new Promise(async (resolve, reject) => {

            let response = {}

            productExist = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({ productid: data.productid });

            if (productExist) {
                response.exist = true;
                resolve(response);
            } else {


                await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION)
                    .insertOne({ productid: data.productid, productname: data.productname, category: data.category, subcategory: data.subcategory, brand: data.brand,firstprice:data.firstprice, landingprice: data.price, price: data.price, description: data.description, instock: [{ id: smallid, size: 's', quantity: data.smallquantity }, { id: mediumid, size: 'm', quantity: data.mediumquantity }, { id: largeid, size: 'l', quantity: data.largequantity }] }).then((data) => {

                        response.exist = false;
                        response.data = data;

                        resolve(response)

                    });
            }


        })

    },

    getProduct: () => {
        return new Promise(async (resolve, reject) => {
            let allProducts = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find().toArray();

            resolve(allProducts);
        })
    },
    getSingleProductDetails: (data) => {

        return new Promise(async (resolve, reject) => {
            let singleProduct = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({ productid: data.productid });

            resolve(singleProduct);
        })

    },
    getSingleProductDetailsForEdit: (data) => {

        return new Promise(async (resolve, reject) => {
            let productDetails = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({ _id: objectId(data.id) })

            resolve(productDetails);

        })

    },

    editProduct: (data, productid) => {
        data.smallquantity = Number(data.smallquantity);
        data.mediumquantity = Number(data.mediumquantity);
        data.largequantity = Number(data.largequantity);
        data.price = Number(data.price);
        data.landingprice = Number(data.landingprice);
        return new Promise(async (resolve, reject) => {


            await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION)
                .updateOne({ productid: productid.productid }, { $set: { productname: data.productname, category: data.category, subcategory: data.subcategory, brand: data.brand, landingprice: data.price, price: data.price, description: data.description, instock: [{ size: 's', quantity: data.smallquantity }, { size: 'm', quantity: data.mediumquantity }, { size: 'l', quantity: data.largequantity }] } }).then((status) => {
                    resolve(status);
                })


        })
    },
    deleteProduct: (data) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION)
                .deleteOne({ _id: objectId(data.id) }).then((data) => {
                    resolve(data);
                })
        })
    },
    instock: (id) => {


        return new Promise(async (resolve, reject) => {
            let stockArray = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({ _id: objectId(id) }, { instock: 1 })


        })
    },


    addToCart: (proId, size, userId, subtotal) => {

        let proObj = {}


        if (size === "s") {

            proObj.item = objectId(proId),
                proObj.quantity = 1,
                proObj.size = "s",
                proObj.subtotal = Number(subtotal);
        }

        if (size === "m") {
            proObj.item = objectId(proId),
                proObj.quantity = 1,
                proObj.size = "m",
                proObj.subtotal = Number(subtotal);
        }

        if (size === "l") {

            proObj.item = objectId(proId),
                proObj.quantity = 1,
                proObj.size = "l",
                proObj.subtotal = Number(subtotal);

        }

        return new Promise(async (resolve, reject) => {

            let response = {};


            let userCart = await db.get().collection(collections.CART_DETAILS_COLLECTION).findOne({ user: objectId(userId) });

            if (userCart) {

                let userProductExist = await db.get().collection(collections.CART_DETAILS_COLLECTION).aggregate([
                    { $match: { user: objectId(userId) } },
                    { $unwind: "$products" },
                    { $match: { "products.item": objectId(proId), "products.size": size } },
                ]).toArray();
              
                if (userProductExist.length > 0) {
                    response.exist = true;
                    resolve(response);

                } else {

                    db.get().collection(collections.CART_DETAILS_COLLECTION)
                        .updateOne({ user: objectId(userId) }, { $push: { products: proObj } })
                    response.added = true;
                    resolve(response);




                }








            }





            else {
                let cartObj = {
                    user: objectId(userId),
                    products: [proObj]
                }
                db.get().collection(collections.CART_DETAILS_COLLECTION).insertOne(cartObj).then((response) => {
                    response.added = true;
                    resolve(response);
                })
            }

        })
    },




    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {

            let cartItems = await db.get().collection(collections.CART_DETAILS_COLLECTION)
                .aggregate([
                    {
                        $match: { user: objectId(userId) }
                    },
                    {
                        $unwind: "$products"
                    },
                    {
                        $project: {
                            item: "$products.item",
                            quantity: "$products.quantity",
                            size: '$products.size',
                            subtotal: "$products.subtotal"
                        }
                    },
                    {
                        $lookup: {
                            from: collections.PRODUCTS_DETAILS_COLLECTION,
                            localField: 'item',
                            foreignField: '_id',
                            as: 'productdetails'
                        }
                    },


                    {
                        $project: {
                            item: 1, quantity: 1, size: 1, subtotal: 1, productdetails: { $arrayElemAt: ['$productdetails', 0] }
                        }
                    },
                    // {
                    //     $unwind: "$productdetails.instock"
                    // },

                    // {
                    //     $project: {
                    //         item: 1, quantity: 1, size: 1, subtotal: 1, productdetails: 1, instock: "$productdetails.instock"
                    //     }
                    // },
                    //     {
                    //     $eq:["$size","instock.size"]
                    //     }
                    //  {
                    //      $group:{
                    //          _id:"$size",

                    //  }



                ]).toArray()
          
              resolve(cartItems)


        })
    },

    changeProductQuantity: (data) => {
        data.price = Number(data.price)
        data.count = Number(data.count);
        return new Promise(async (resolve, reject) => {

            if (data.count == -1) {
                db.get().collection(collections.CART_DETAILS_COLLECTION)
                    .updateOne({ $and: [{ _id: objectId(data.cart), "products": { $elemMatch: { item: objectId(data.product), size: data.size } } }] },
                        { $inc: { 'products.$.quantity': data.count, 'products.$.subtotal': data.price * -1 } }
                    ).then(() => {

                        resolve({ status: true });
                    })



            }

            else {

                db.get().collection(collections.CART_DETAILS_COLLECTION)
                    .updateOne({ $and: [{ _id: objectId(data.cart), "products": { $elemMatch: { item: objectId(data.product), size: data.size } } }] },
                        { $inc: { 'products.$.quantity': data.count, 'products.$.subtotal': data.price } }
                    ).then(() => {

                        resolve({ status: true });
                    })



            }





        })
    },

    deletecartitems: (data) => {
        console.log(data);
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collections.CART_DETAILS_COLLECTION)
                .updateOne({ _id: objectId(data.cartId) }, { $pull: { products: { item: objectId(data.proId), size: data.size } } }).then((response) => {
                    resolve();
                })
        })
    },
    getTotalAmount: (userId) => {

        return new Promise(async (resolve, reject) => {

            let total = await db.get().collection(collections.CART_DETAILS_COLLECTION)
                .aggregate([
                    {
                        $match: { user: objectId(userId) }
                    },
                    {
                        $unwind: "$products"
                    },
                    {
                        $project: {
                            item: "$products.item",
                            quantity: "$products.quantity",
                            size: '$products.size'
                        }
                    },
                    {
                        $lookup: {
                            from: collections.PRODUCTS_DETAILS_COLLECTION,
                            localField: 'item',
                            foreignField: '_id',
                            as: 'productdetails'
                        }
                    },
                    {
                        $project: {
                            item: 1, quantity: 1, size: 1, productdetails: { $arrayElemAt: ['$productdetails', 0] }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: { $multiply: ['$quantity', '$productdetails.price'] } }
                        }
                    }

                ]).toArray()
            if (total[0]?.total) {
                resolve(total[0].total)
            } else {
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


    getCartCount: (userId) => {

        return new Promise(async (resolve, reject) => {
            let count = 0;
            let cart = await db.get().collection(collections.CART_DETAILS_COLLECTION).findOne({ user: objectId(userId) });
            if (cart) {

                count = cart.products.length;
            }
            resolve(count);
        })

    },

    allCategoryProducts: (categoryname) => {
        return new Promise(async (resolve, reject) => {

            let allSingleCategoryProduct = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find({ category: categoryname }).toArray();
            resolve(allSingleCategoryProduct);

        })
    },


    categoryProductOneForHomeProducts: (category) => {
        return new Promise(async (resolve, reject) => {
            let homeProductsOne = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find({ category: category }).toArray();
            resolve(homeProductsOne);
        })

    },

    categoryProductTwoForHomeProducts: (category) => {
        return new Promise(async (resolve, reject) => {
            let homeProductsTwo = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find({ category: category }).toArray();
            resolve(homeProductsTwo);
        })
    },

    addCategoryOffer: (data) => {

        let endDateIso = new Date(data.caofferenddate)
        data.endDateIso = endDateIso;
        let startDateIso = new Date(data.caofferstartdate)
        data.startDateIso = startDateIso;
        return new Promise(async (resolve, reject) => {
            let result = {};
            let exist = await db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION).findOne({ category: data.category });

            if (exist) {

                result.exist = true
                resolve(result);
            }
            else {

                db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION).insertOne(data);


                //   let productsForoffer =  await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find({category:data.category,offer:{$exists:false}}).toArray();




                //   await productsForoffer.map(async(product)=>{
                //       let price = product.landingprice;
                //       let offer = (price/100)*data.discountpercentage;
                //       let offerprice = (price - offer).toFixed(0);
                //       offerprice = Number(offerprice);


                //       db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({_id:objectId(product._id)},{$set:{price:offerprice,offer:true,offerpercentage:data.discountpercentage}})


                //   })

                result.exist = false;

                resolve(result);



            }
        })
    },


    getAllCategoryOffers: () => {
        return new Promise(async (resolve, reject) => {

            let allCategoryOffers = await db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION).find().toArray();

            resolve(allCategoryOffers)
        })
    },
    addProductOffer: (data) => {
        return new Promise(async (resolve, reject) => {
            let proendDateIso = new Date(data.profferenddate)
            data.proendDateIso = proendDateIso;
            let prostartDateIso = new Date(data.profferstartdate)
            data.prostartDateIso = prostartDateIso;
            let response = {};
            let productAlreadyHaveOffer = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({ productname: data.productname, offer: { $exists: true } });


            if (productAlreadyHaveOffer) {
                response.exist = true;
               
                resolve(response);
            } else {
                db.get().collection(collections.PRODUCTOFFER_DETAILS_COLLECTION).insertOne(data);
                // let productdetails = await  db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({productname:data.productname});

                // let price = productdetails?.landingprice;
                // let offer = (price/100)*data.discount;
                // let offerprice = (price - offer).toFixed(0);
                // offerprice = Number(offerprice);

                //  db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({productname:data.productname},{$set:{price:offerprice,offer:true,offerpercentage:data.discount}});
                response.exist = false;
                resolve(response);
            }
        })
    },

    getAllProductsOffers: () => {
        return new Promise(async (resolve, reject) => {
            let allproductOffers = await db.get().collection(collections.PRODUCTOFFER_DETAILS_COLLECTION).find().toArray();
            resolve(allproductOffers)
        })
    },

    categoryoffereditdataForEdit: (id) => {
        return new Promise(async (resolve, reject) => {
            let categoryoffer = await db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION).findOne({ _id: objectId(id) });
            resolve(categoryoffer);
        })
    },



    coupenoffereditdataForEdit: (id) => {
        return new Promise(async (resolve, reject) => {
            let coupenoffer = await db.get().collection(collections.COUPEN_DETAILS_COLLECTION).findOne({ _id: objectId(id) });
            resolve(coupenoffer);
        })
    },

    editCategoryOffer: (data) => {
        let endDateIso = new Date(data.caofferenddate)
        data.endDateIso = endDateIso;
        let startDateIso = new Date(data.caofferstartdate)
        data.startDateIso = startDateIso;
        return new Promise(async (resolve, reject) => {
            let dataOfProductOffer = await db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION).findOne({ category: data.category })
            db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION)
                .updateOne({ category: data.category }, { $set: { discountpercentage: data.discountpercentage, caofferstartdate: data.caofferstartdate, caofferenddate: data.caofferenddate, endDateIso: data.endDateIso, startDateIso: data.startDateIso } });


            // let productsForoffer =  await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find({category:data.category,offer:{$exists:true},offerpercentage:dataOfProductOffer.discountpercentage}).toArray();

            // await productsForoffer.map(async(product)=>{
            //     let price = product.landingprice;
            //     let offer = (price/100)*data.discountpercentage;
            //     let offerprice = (price - offer).toFixed(0);
            //     offerprice = Number(offerprice);


            //     db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({_id:objectId(product._id)},{$set:{price:offerprice,offer:true,offerpercentage:data.discountpercentage}})


            // })
            resolve();

        })
    },

    editCouponOffer: (data) => {
        return new Promise(async (resolve, reject) => {
            let coupenIsoStartDate = new Date(data.couponfferstartdate);
            let coupenIsoEndDate = new Date(data.couponofferenddate);
            db.get().collection(collections.COUPEN_DETAILS_COLLECTION)
                .updateOne({ coupencode: data.coupen }, { $set: { coupenpercentage: data.coupondiscountpercentage, coupenstartdate: data.couponfferstartdate, coupenenddate: data.couponofferenddate, coupenIsoStartDate: coupenIsoStartDate, coupenIsoEndDate: coupenIsoEndDate,available:false } });
            resolve()
        })
    },


    deleteCategoryOffers: (data) => {

        return new Promise(async (resolve, reject) => {
            db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION).deleteOne({ category: data.category });

            let allProducts = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find({ category: data.category, offerpercentage: data.percentage }).toArray();

            await allProducts.map(async (product) => {
                let landingprice = product.landingprice;
                // let offer = (price/100)*data.discountpercentage;
                // let offerprice = (price - offer).toFixed(0);
                // offerprice = Number(offerprice);

                db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({ _id: objectId(product._id) }, { $unset: { offer: "", offerpercentage: "" } });
                db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({ _id: objectId(product._id) }, { $set: { price: landingprice } });



                resolve();
                // db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({_id:objectId(product._id)},{$set:{price:offerprice,offer:true,offerpercentage:data.discountpercentage}})
                // resolve();



            })

        })
    },


    getEditOfferProduct: (data) => {
        return new Promise(async (resolve, reject) => {
            let productOffer = await db.get().collection(collections.PRODUCTOFFER_DETAILS_COLLECTION).findOne({ _id: objectId(data.id) })
            resolve(productOffer);
        })
    },



    editProductOffer: (data) => {

        let proendDateIso = new Date(data.profferenddate)
        data.proendDateIso = proendDateIso;

        let prostartDateIso = new Date(data.profferstartdate)
        data.prostartDateIso = prostartDateIso;


        return new Promise(async (resolve, reject) => {
            db.get().collection(collections.PRODUCTOFFER_DETAILS_COLLECTION).updateOne({ productname: data.productname }, { $set: { discount: data.discountpercentageproduct, profferstartdate: data.profferstartdate, profferenddate: data.profferenddate, proendDateIso: data.proendDateIso, prostartDateIso: data.prostartDateIso } });

            //    let productdetails =  await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({productname:data.productname})

            //    let price = productdetails.landingprice;
            //    let offer = (price/100)*data.discountpercentageproduct;
            //    let offerprice = (price - offer).toFixed(0);
            //    offerprice = Number(offerprice);

            //    db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({productname:data.productname},{$set:{price:offerprice,offer:true,offerpercentage:data.discountpercentageproduct}});

            resolve();
        })

    },

    deleteProductOffers: (data) => {

        return new Promise(async (resolve, reject) => {
            db.get().collection(collections.PRODUCTOFFER_DETAILS_COLLECTION).deleteOne({ productname: data.productname });

            let product = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({ productname: data.productname });

            db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({ productname: data.productname }, { $set: { price: product.landingprice } });
            db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({ productname: data.productname }, { $unset: { offer: "", offerpercentage: "" } });
            resolve();
        })
    },


    deleteExpiredproductoffers: (date) => {
        let proendDateIso = new Date(date)

        return new Promise(async (resolve, reject) => {

            let existingProductOffer = await db.get().collection(collections.PRODUCTOFFER_DETAILS_COLLECTION).find({ proendDateIso: { $lte: proendDateIso } }).toArray();

            if (existingProductOffer.length > 0) {
                await existingProductOffer.map(async (onedata) => {
                    db.get().collection(collections.PRODUCTOFFER_DETAILS_COLLECTION).deleteOne({ productname: onedata.productname });
                    let product = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({ productname: onedata.productname });

                    db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({ productname: onedata.productname }, { $set: { price: product.landingprice } });
                    db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({ productname: onedata.productname }, { $unset: { offer: "", offerpercentage: "" } });

                })
                // db.get().collection(collections.PRODUCTOFFER_DETAILS_COLLECTION).deleteOne({productname:existingProductOffer.productname});


                // let product =  await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({productname:existingProductOffer.productname});

                // db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({productname:product.productname},{$set:{price:product.landingprice}});
                // db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({productname:product.productname},{$unset:{offer:"",offerpercentage:""}});
                // resolve();

                //    }else{
                //     resolve(); 
                //    }
                resolve();
            }

            else {
                resolve();
            }
        })
    },


    deleteCategoryoffers: (date) => {
        let caendDateIso = new Date(date);

        return new Promise(async (resolve, reject) => {

            let existingCategoryOffer = await db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION).findOne({ endDateIso: { $lte: caendDateIso } });
            if (existingCategoryOffer) {
                db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION).deleteOne({ category: existingCategoryOffer.category })


                let allProducts = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find({ category: existingCategoryOffer.category, offerpercentage: existingCategoryOffer.discountpercentage }).toArray();

                await allProducts.map(async (product) => {
                    //   let landingprice = product.landingprice;
                    //  // let offer = (price/100)*data.discountpercentage;
                    //  // let offerprice = (price - offer).toFixed(0);
                    //  // offerprice = Number(offerprice);

                    db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({ _id: objectId(product._id) }, { $unset: { offer: "", offerpercentage: "" } });
                    db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({ _id: objectId(product._id) }, { $set: { price: product.landingprice } });


                    resolve();

                }
                )
            } else {
                resolve();
            }
        })
    },

    deliveredOrders: () => {
        return new Promise(async (resolve, reject) => {
            let result = await db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
                {
                    $unwind: "$products"
                },
                {
                    $match: { 'products.status': 'delivered' }
                },
                {
                    $count: "deliverdorders"
                }
            ]).toArray();
            if (result[0]?.deliverdorders) {
                resolve(result[0].deliverdorders);
            } else {
                resolve();
            }

        })
    },
    placedOrders: () => {
        return new Promise(async (resolve, reject) => {
            let result = await db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
                {
                    $unwind: "$products"
                },
                {
                    $match: { 'products.status': 'placed' }
                },
                {
                    $count: "placeddorders"
                }
            ]).toArray();
            if (result[0]?.placeddorders) {
                resolve(result[0].placeddorders);
            } else {
                resolve();
            }

        })
    },
    pendingOrders: () => {
        return new Promise(async (resolve, reject) => {
            let result = await db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
                {
                    $unwind: "$products"
                },
                {
                    $match: { 'products.status': 'pending' }
                },
                {
                    $count: "pendingdorders"
                }
            ]).toArray();
            if (result[0]?.pendingdorders) {
                resolve(result[0].pendingdorders);
            } else {
                resolve();
            }

        })
    },
    canceledOrders: () => {
        return new Promise(async (resolve, reject) => {
            let result = await db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
                {
                    $unwind: "$products"
                },
                {
                    $match: { 'products.status': 'canceled' }
                },
                {
                    $count: "canceleddorders"
                }
            ]).toArray();
            if (result[0]?.canceleddorders) {
                resolve(result[0].canceleddorders);
            } else {
                resolve();
            }

        })
    },
    totalOrders: () => {
        return new Promise(async (resolve, reject) => {
            let totalCount = await db.get().collection(collections.ORDER_DETAILS_COLLECTION).count()
            resolve(totalCount)
        })
    },
    totalRevenue: () => {
        return new Promise(async (resolve, reject) => {
            let totalRevenue = await db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
                {
                    $unwind: "$products"
                },
                {
                    $match: { 'products.status': 'delivered' }

                },
                {
                    $project: {
                        subtotal: '$products.subtotal',

                    },

                },
                {
                    $project: {
                        subtotal: 1,
                        _id: 0
                    }

                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$subtotal' }
                    }
                }


            ]).toArray();
            if (totalRevenue[0]?.total) {
                resolve(totalRevenue[0].total);
            } else {
                resolve();
            }

        })
    },
    totalUsers: () => {

        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collections.USERS_DETAILS_COLLECTION).count();

            resolve(users);
        })
    },

    totalProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).count();

            resolve(products);
        })
    },

    paymentCount: () => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
                {
                    $project: {
                        payments: '$paymentmethod'
                    }
                },
                {
                    $group: {
                        _id: '$payments',
                        count: { $sum: 1 }
                    }
                }, {
                    $sort: { _id: 1 }
                },
            ]).toArray();
            resolve(data);
        })
    },

    dailysalescount: () => {




        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
                {
                    $unwind: "$products"
                },

                //    {
                //     $match:{'products.status':'delivered'}

                // },
                {
                    $project: {
                        subtotal: '$products.subtotal',
                        date: "$date"
                    }
                },
                {
                    $group: {
                        _id: "$date",
                        total: { $sum: '$subtotal' }
                    }
                },



                {
                    $sort: { _id: -1 }
                },
                {
                    $limit: 7
                }
            ]).toArray();
           
            resolve(data)
        })


    },

    totalCategorysales: () => {
        return new Promise(async (resolve, reject) => {

            let categorywisesales = await db.get().collection(collections.ORDER_DETAILS_COLLECTION)
                .aggregate([


                    {
                        $unwind: '$products'
                    },
                    {
                        $project: {
                            item: "$products.item",

                        }
                    },
                    {
                        $lookup: {
                            from: collections.PRODUCTS_DETAILS_COLLECTION,
                            localField: 'item',
                            foreignField: '_id',
                            as: 'productdetail'

                        }
                    },
                    {
                        $project: {
                            item: 1, productdetail: { $arrayElemAt: ['$productdetail.category', 0] }
                        }
                    }, {
                        $group: {
                            _id: "$productdetail",
                            count: { $sum: 1 }
                        }
                    },

                ]).toArray();

            var newArraycategorywisesales = categorywisesales.filter((item) => item._id !== null);
            resolve(newArraycategorywisesales)


        })
    },


    topSellingProducts: () => {
        return new Promise(async (resolve, reject) => {

            let data = await db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
                {
                    $unwind: "$products"
                },

                // {
                //     $match: { 'products.status': 'delivered' }

                // },
                {
                    $project: {
                        item: "$products.item",

                    }
                },
                {
                    $group: {
                        _id: "$item",
                        count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: collections.PRODUCTS_DETAILS_COLLECTION,
                        localField: '_id',
                        foreignField: '_id',
                        as: 'productdetail'

                    }
                },
                {
                    $project: {
                        count: 1, productdetail: { $arrayElemAt: ['$productdetail', 0] }
                    }
                },
                {
                    $sort: { count: -1 }
                },
                {
                    $limit: 8
                }




            ]).toArray();


            resolve(data)

        })
    },
    recenteOrders: () => {

        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: "$products.item",

                        date: "$date",
                        total: "$total",
                        status: "$products.status",
                        paymentmethod: "$paymentmethod",
                        userId: "$userId"


                    }
                },
                {
                    $lookup: {
                        from: collections.USERS_DETAILS_COLLECTION,
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'productdetail'

                    }
                },
                {
                    $project: {
                        item: 1, date: 1, total: 1, status: 1, paymentmethod: 1, productdetail: { $arrayElemAt: ['$productdetail', 0] }
                    }
                },

                {
                    $sort: { date: -1 }
                },
                {
                    $limit: 10
                }
            ]).toArray();

            resolve(data);
        })




    },


    todaySales: (todaydate) => {

        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
                {
                    $match: { "date": todaydate }
                },
                {
                    $project: {
                        total: "$total",
                        date: "$date"
                    }
                },
                {
                    $group: {
                        _id: "$date",
                        todaytotal: { $sum: '$total' }
                    }
                },
                //   {
                //      $project:{
                //          todaytotal:1,date:1
                //      }
                //  },
            ]).toArray();

            resolve(data);

        })
    },

    todayOrders: (todaydate) => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
                {
                    $match: { "date": todaydate }
                },
                {
                    $project: {
                        date: "$date"
                    }
                },
                {
                    $group: {
                        _id: "$date",
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        date: 1, count: 1
                    }
                }
            ]).toArray();
            resolve(data);

        })
    },





    addToBuyProduct: (proId, size, userId, subtotal) => {

        let proObj = {}


        if (size === "s") {

            proObj.item = objectId(proId),
                proObj.quantity = 1,
                proObj.size = "s",
                proObj.subtotal = Number(subtotal);
        }

        if (size === "m") {
            proObj.item = objectId(proId),
                proObj.quantity = 1,
                proObj.size = "m",
                proObj.subtotal = Number(subtotal);
        }

        if (size === "l") {

            proObj.item = objectId(proId),
                proObj.quantity = 1,
                proObj.size = "l",
                proObj.subtotal = Number(subtotal);

        }

        return new Promise(async (resolve, reject) => {

            let response = {};


            let userBuynow = await db.get().collection(collections.BUYNOW_DETAILS_COLLECTION).findOne({ user: objectId(userId) });

            if (userBuynow) {

                //  let userProductExist = await db.get().collection(collections.CART_DETAILS_COLLECTION).aggregate([
                //      {$match:{user:objectId(userId)}},
                //      {$unwind:"$products"},
                //      {$match:{"products.item":objectId(proId),"products.size":size}},
                //   ]).toArray();
                //   console.log(userProductExist);
                // if(userProductExist.length>0){
                //   response.exist = true;
                //   resolve(response);

                // }else{

                //   db.get().collection(collections.CART_DETAILS_COLLECTION)
                //   .updateOne({user:objectId(userId)},{$push:{products:proObj}})
                //   response.added = true;
                //   resolve(response);




                // }


                let cartObj = {
                    user: objectId(userId),
                    products: [proObj]
                }

                db.get().collection(collections.BUYNOW_DETAILS_COLLECTION).updateOne({ user: objectId(userId) }, { $pop: { products: -1 } })

                db.get().collection(collections.BUYNOW_DETAILS_COLLECTION).updateOne({ user: objectId(userId) }, { $push: { products: proObj } }).then((response) => {
                    // response.added = true;
                    resolve();
                });





            }





            else {
                let buynowObj = {
                    user: objectId(userId),
                    products: [proObj]
                }
                db.get().collection(collections.BUYNOW_DETAILS_COLLECTION).insertOne(buynowObj).then((response) => {
                    //  response.added = true;
                    resolve();
                });
            }

        })
    },


    getBuyNowTotalAmount: (userId) => {

        return new Promise(async (resolve, reject) => {

            let total = await db.get().collection(collections.BUYNOW_DETAILS_COLLECTION)
                .aggregate([
                    {
                        $match: { user: objectId(userId) }
                    },
                    {
                        $unwind: "$products"
                    },
                    {
                        $project: {
                            item: "$products.item",
                            quantity: "$products.quantity",
                            size: '$products.size'
                        }
                    },
                    {
                        $lookup: {
                            from: collections.PRODUCTS_DETAILS_COLLECTION,
                            localField: 'item',
                            foreignField: '_id',
                            as: 'productdetails'
                        }
                    },
                    {
                        $project: {
                            item: 1, quantity: 1, size: 1, productdetails: { $arrayElemAt: ['$productdetails', 0] }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: { $multiply: ['$quantity', '$productdetails.price'] } }
                        }
                    }

                ]).toArray()
            if (total[0]?.total) {
                resolve(total[0].total)
            } else {
                resolve();
            }


        })


    },



    getBuyNowProducts: (userId) => {
        return new Promise(async (resolve, reject) => {

            let cartItems = await db.get().collection(collections.BUYNOW_DETAILS_COLLECTION)
                .aggregate([
                    {
                        $match: { user: objectId(userId) }
                    },
                    {
                        $unwind: "$products"
                    },
                    {
                        $project: {
                            item: "$products.item",
                            quantity: "$products.quantity",
                            size: '$products.size',
                            subtotal: "$products.subtotal"
                        }
                    },
                    {
                        $lookup: {
                            from: collections.PRODUCTS_DETAILS_COLLECTION,
                            localField: 'item',
                            foreignField: '_id',
                            as: 'productdetails'
                        }
                    },
                    {
                        $project: {
                            item: 1, quantity: 1, size: 1, subtotal: 1, productdetails: { $arrayElemAt: ['$productdetails', 0] }
                        }
                    }

                ]).toArray()

            resolve(cartItems)


        })
    },

    addToWishList: (proId, userId) => {

        return new Promise(async (resolve, reject) => {

            let response = {};

            let userwishlistexist = await db.get().collection(collections.WISHLIST_DETAILS_COLLECTION).findOne({ user: objectId(userId) })


            if (userwishlistexist) {

                let userProductExist = await db.get().collection(collections.WISHLIST_DETAILS_COLLECTION).findOne({ user: objectId(userId), products: { $elemMatch: { $eq: objectId(proId) } } });

                if (userProductExist) {


                    db.get().collection(collections.WISHLIST_DETAILS_COLLECTION)
                        .updateOne({ user: objectId(userId) }, { $pull: { products: objectId(proId) } })
                    response.exist = true;
                    resolve(response);


                }
                else {
                    db.get().collection(collections.WISHLIST_DETAILS_COLLECTION)
                        .updateOne({ user: objectId(userId) }, { $push: { products: objectId(proId) } })
                    response.added = true;
                    resolve(response);

                }

            }
            else {
                let wishlistObj = {
                    user: objectId(userId),
                    products: [objectId(proId)]
                }
                db.get().collection(collections.WISHLIST_DETAILS_COLLECTION).insertOne(wishlistObj).then((response) => {
                    response.added = true;
                    resolve(response);
                })
            }
        })

    },

    getWishListProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collections.WISHLIST_DETAILS_COLLECTION).aggregate([
                { $match: { user: objectId(userId) } },
                {
                    $unwind: "$products"
                },
                {
                    $project: {
                        userId: "$user",
                        productId: "$products",

                    }
                },
                {
                    $lookup: {
                        from: collections.PRODUCTS_DETAILS_COLLECTION,
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'productdetails'
                    }
                },
                {
                    $project: {
                        _id: 1, userId: 1, productId: 1, productdetails: { $arrayElemAt: ['$productdetails', 0] }
                    }
                }


            ]).toArray();
            resolve(data);
        })
    },

    removeProductFromWishlistPage: (proId, userId) => {
        return new Promise(async (resolve, reject) => {

            db.get().collection(collections.WISHLIST_DETAILS_COLLECTION).updateOne({ user: objectId(userId) }, { $pull: { products: objectId(proId) } });
            resolve();

        })
    },


    startCategoryOffers: (date) => {
        let startDateIso = new Date(date);
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION).find({ startDateIso: { $lte: startDateIso } }).toArray();

            if (data.length > 0) {
                await data.map(async (onedata) => {

                    let productsForoffer = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find({ category: onedata.category, offer: { $exists: false } }).toArray();




                    await productsForoffer.map(async (product) => {
                        let price = product.landingprice;
                        let offer = (price / 100) * onedata.discountpercentage;
                        let offerprice = (price - offer).toFixed(0);
                        offerprice = Number(offerprice);


                        db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({ _id: objectId(product._id) }, { $set: { price: offerprice, offer: true, offerpercentage: onedata.discountpercentage } })


                    })

                })

                resolve();
            } else {
                resolve();
            }
        })
    },

    deleteExpiredCategoryoffers: (date) => {
        let endDateIso = new Date(date);


        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION).find({ endDateIso: { $lte: endDateIso } }).toArray();

            if (data.length > 0) {

                await data.map(async (onedata) => {

                    let allProducts = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find({ category: onedata.category, offerpercentage: onedata.discountpercentage }).toArray();

                    db.get().collection(collections.CATEGORYOFFER_DETAILS_COLLECTION).deleteOne({ category: onedata.category });
                    await allProducts.map(async (product) => {
                        let landingprice = product.landingprice;
                        // let offer = (price/100)*data.discountpercentage;
                        // let offerprice = (price - offer).toFixed(0);
                        // offerprice = Number(offerprice);

                        db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({ _id: objectId(product._id) }, { $unset: { offer: "", offerpercentage: "" } });
                        db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({ _id: objectId(product._id) }, { $set: { price: landingprice } });




                        // db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({_id:objectId(product._id)},{$set:{price:offerprice,offer:true,offerpercentage:data.discountpercentage}})
                        // resolve();



                    });
                })

                resolve();
            } else {
                resolve();
            }


        });



    },

    startProductOffers: (date) => {
        let prostartDateIso = new Date(date);

        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collections.PRODUCTOFFER_DETAILS_COLLECTION).find({ prostartDateIso: { $lte: prostartDateIso } }).toArray();

            if (data.length > 0) {

                await data.map(async (onedata) => {
                    let productdetails = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).findOne({ productname: onedata.productname });

                    let price = productdetails?.landingprice;
                    let offer = (price / 100) * onedata.discount;
                    let offerprice = (price - offer).toFixed(0);
                    offerprice = Number(offerprice);

                    db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).updateOne({ productname: onedata.productname }, { $set: { price: offerprice, offer: true, offerpercentage: onedata.discount } });
                })

                resolve();
            } else {
                resolve();
            }

        })


    },
    startCoupenOffers: (date) => {
        let startIsoDate = new Date(date);
        return new Promise(async (resolve, reject) => {

            let data = await db.get().collection(collections.COUPEN_DETAILS_COLLECTION).find({ coupenIsoStartDate: { $lte: startIsoDate } }).toArray();

            if (data.length > 0) {
                await data.map((onedata) => {
                    db.get().collection(collections.COUPEN_DETAILS_COLLECTION).updateOne({ coupencode: onedata.coupencode }, { $set: { available: true } })
                });
                resolve();
            } else {
                resolve();
            }

        })
    },

    coupendelete: (date) => {
        let endIsoDate = new Date(date);
        return new Promise(async (resolve, reject) => {

            let data = await db.get().collection(collections.COUPEN_DETAILS_COLLECTION).find({ coupenIsoEndDate: { $lte: endIsoDate } }).toArray();
            if (data.length > 0) {

                await data.map((onedata) => {
                    db.get().collection(collections.COUPEN_DETAILS_COLLECTION).deleteOne({ coupencode: onedata.coupencode });
                })
                resolve();
            } else {
                resolve();
            }

        })
    },


    checkCoupen: (coupencode, userId) => {

        return new Promise(async (resolve, reject) => {
            let response = {}


            let coupenexist = await db.get().collection(collections.COUPEN_DETAILS_COLLECTION).findOne({ coupencode: coupencode, available: true });

            if (coupenexist) {

                let data = await db.get().collection(collections.COUPEN_DETAILS_COLLECTION).aggregate([

                    {
                        $match: { coupencode: coupencode }
                    },
                    {
                        $unwind: "$users"
                    },
                    {
                        $match: { users: objectId(userId) }
                    }

                ]).toArray();
                console.log(data);
                if (data.length > 0) {

                    response.alreadyused = true;
                    resolve(response);
                } else {

                    resolve(coupenexist);
                }


            } else {

                response.notexist = true;
                resolve(response);



            }






        })

    },


    getAllAvailableCoupens: () => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collections.COUPEN_DETAILS_COLLECTION).aggregate([
                { $match: { available: true } },
                {
                    $project: {
                        "coupencode": 1, "_id": 0
                    }
                }
            ]).toArray();
            resolve(data)
        })
    },

    orderReport:(startDate,endDate)=>{
     
        return new Promise(async(resolve,reject)=>{
            let data =  await db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
                 {
              $match:{
             date:{
                 $gte:startDate,
                 $lte:endDate
             }
                 }},
                 {
                   $unwind:"$products"
             
                  
                    } ,
                    {
                        $project:{
                            item:"$products.item",
                            quantity:"$products.quantity",
                            subTotal:"$products.subtotal",
                            size:"$products.size",
                            status:"$products.status",
                            date:"$date"
                        }
                    },
                     {
                        $match:{
                             $or:[{status:"delivered"},{status:"placed"}]
                         }
                     },
                    {
                        $lookup:{
                           from:collections.PRODUCTS_DETAILS_COLLECTION,
                            localField:"item",
                            foreignField:"_id",
                            as:"products"
                        }
                    },
                   {
                        $unwind:"$products"
                   },
               
                    {
                     $group: {
                         _id: "$date",
                         totalQty:{$sum:"$quantity"},
                       totalrevenue: { $sum: { $multiply: ['$quantity', '$products.price'] } },
                          totalandingprice:{$sum:{$multiply: ['$quantity', '$products.firstprice']}},
                        

                    }
                   
                 },
                 {
                     $project:{
                        _id:1,
                          totalQty:1,
                          totalrevenue:1,
                          totalandingprice:1,
                          profit:{
                              $subtract:["$totalrevenue","$totalandingprice"]
                          }
                     }
                 },
                 {
                     $sort:{_id:-1}
                 }



                
            ]).toArray();
          
             resolve(data);
        })
    },
       allProductsDetails:()=>{
return new Promise(async(resolve,reject)=>{
    let result = await db.get().collection(collections.ORDER_DETAILS_COLLECTION).aggregate([
 {
     $unwind:"$products"
 },
{
    $group:{
        _id:"$userId",
        totalOrders:{"$sum":1},
        spend:{"$sum":"$products.subtotal"},
        productsbuy:{"$sum":"$products.quantity"}
    }
},
{
    $lookup:{
        from:collections.USERS_DETAILS_COLLECTION,
        localField:"_id",
        foreignField:"_id",
        as:"userdetails"
    }
},
{
    $project:{
        _id:1,totalOrders:1,spend:1,productsbuy:1,userdetails: { $arrayElemAt: ['$userdetails', 0] }
    }
}

     
   
]).toArray();
console.log(result);
  resolve(result);
})
    },


    productSearch:(payload)=>{
        return new Promise(async(resolve,reject)=>{
            let search = await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION)
 .find({productname:{$regex: new RegExp(payload+'.*','i')}}).toArray();
 resolve(search);
        })
    },


    searchedProduct:(id)=>{
        return new Promise(async(resolve,reject)=>{
     
let product =await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find({_id:objectId(id)}).toArray();
resolve(product);

        })
    },


    allSubCategoryProducts:(category,subCategory)=>{
        return new Promise(async(resolve,reject)=>{

let data =await db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find({category:category,subcategory:subCategory}).toArray();
resolve(data);

        })
    },
    filterBrandProducts:(category,brand)=>{
        return new Promise(async(resolve,reject)=>{
            let data = db.get().collection(collections.PRODUCTS_DETAILS_COLLECTION).find({category:category,brand:brand}).toArray();
            resolve(data);
        })
    },

    profileSaveDetails:(userId)=>{
  return new Promise(async(resolve,reject)=>{
      let data =await db.get().collection(collections.USERS_DETAILS_COLLECTION).findOne({_id:objectId(userId)});

      resolve(data);

  })
    }


}