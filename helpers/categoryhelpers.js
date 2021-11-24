var db = require('../config/connection');

var collections = require('../config/collection');
const { response } = require('express');

module.exports = {

    addCategory:(data)=>{

        return new Promise(async(resolve,reject)=>{
  let response = {}

  let categoryCheck = await db.get().collection(collections.CATEGORY_DETAILS_COLLECTION).findOne({category:data.category});

  if(categoryCheck){
      response.exist = true;
      resolve(response);
  }else{
    await db.get().collection(collections.CATEGORY_DETAILS_COLLECTION).insertOne(data);
      response.exist = false;
      resolve(response);
  }
         

        });

    },



    getCategory:()=>{

        return new Promise(async(resolve,reject)=>{
       let allCategory =  await db.get().collection(collections.CATEGORY_DETAILS_COLLECTION).find().toArray();
       resolve(allCategory);
        });
    },


    addSubcategory:(data)=>{
        return new Promise(async(resolve,reject)=>{
let response = {};
          let subcategoryexist = await db.get().collection(collections.CATEGORY_DETAILS_COLLECTION)
            .findOne(
                {'$and':
            [{category:data.categorySubcategory},{subcategory:data.subcategory}]
            }
            );

            if(subcategoryexist){
                response.exist = true;
                resolve(response);
            }else{
                await db.get().collection(collections.CATEGORY_DETAILS_COLLECTION)
                .updateOne({category:data.categorySubcategory},{$push:{subcategory:data.subcategory}});
                response.exist = false;
                resolve(response);
            }

        });
    },
    deleteCategory:(data)=>{
        return new Promise(async(resolve,reject)=>{

await db.get().collection(collections.CATEGORY_DETAILS_COLLECTION)
.deleteOne({category:data.category}).then((result)=>{
    resolve();
})

        })
    },

    deletesubCategory:(data)=>{

        return new Promise(async(resolve,reject)=>{
        
            await db.get().collection(collections.CATEGORY_DETAILS_COLLECTION)
            .updateOne({category:data.category},{$pull:{subcategory:data.subcategory}}).then((data)=>{
                resolve();
            })
        })
    },
    getSubcategoriesForForm:(data)=>{
        return new Promise(async(resolve,reject)=>{
           let result = await db.get().collection(collections.CATEGORY_DETAILS_COLLECTION)
             .findOne({category:data.category});
             resolve(result);
  
        })
    },
    addBannerone:(data)=>{
        return new Promise(async(resolve,reject)=>{
            let response = {};
            let bannerOne =await db.get().collection(collections.BANNER_DETAILS_COLLECTION).findOne({banner:"one"});
            if(bannerOne){
                db.get().collection(collections.BANNER_DETAILS_COLLECTION).updateOne({banner:"one"},{$set:{bannerOneHeading:data.banner1heading,bannerOneDescription:data.banner1description}})
               
                response.id = bannerOne._id;
                response.exist = true;
                resolve(response);
            }else{
                db.get().collection(collections.BANNER_DETAILS_COLLECTION).insertOne({banner:"one",bannerOneHeading:data.banner1heading,bannerOneDescription:data.banner1description}).then((response)=>{
                   
                    response.id = response.insertedId;
                    response.exist = false;
                    resolve(response);
                })
            }
           
        })
    },


    addBannertwo:(data)=>{
        return new Promise(async(resolve,reject)=>{
            let response = {};
            let bannerTwo =await db.get().collection(collections.BANNER_DETAILS_COLLECTION).findOne({banner:"two"});
            if(bannerTwo){
                db.get().collection(collections.BANNER_DETAILS_COLLECTION).updateOne({banner:"two"},{$set:{bannerTwoHeading:data.banner2heading,bannerTwoDescription:data.banner2description}})
               
                response.id = bannerTwo._id;
                response.exist = true;
                resolve(response);
            }else{
                db.get().collection(collections.BANNER_DETAILS_COLLECTION).insertOne({banner:"two",bannerTwoHeading:data.banner2heading,bannerTwoDescription:data.banner2description}).then((response)=>{
                   
                    response.id = response.insertedId;
                    response.exist = false;
                    resolve(response);
                })
            }
           
        })
    },


    getBannerOne:()=>{
        return new Promise(async(resolve,reject)=>{

            let bannerOne = await db.get().collection(collections.BANNER_DETAILS_COLLECTION).findOne({banner:"one"});
            resolve(bannerOne);
        })
    }
   

}