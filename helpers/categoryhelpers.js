var db = require('../config/connection');

var collections = require('../config/collection');

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
    }


}