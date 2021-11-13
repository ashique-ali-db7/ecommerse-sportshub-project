var db = require('../config/connection');

var collections = require('../config/collection');

module.exports={

 




    brandAdd:(brandData)=>{
        return new Promise(async(resolve,reject)=>{

let response = {}

         let brandCheck = await db.get().collection(collections.BRAND_DETAILS_COLLECTION).findOne({brandName:brandData.brandName})


         if(brandCheck){
             console.log("mone")
          response.exist = true;  
resolve(response)
}
else{
    
         await   db.get().collection(collections.BRAND_DETAILS_COLLECTION).insertOne(brandData).then((data)=>{
            response.exist = false; 
            response.data = data; 
resolve(response);
            })
        }

        })

    },
    getBrand:()=>{
        return new Promise(async(resolve,reject)=>{
            let allBrand = await db.get().collection(collections.BRAND_DETAILS_COLLECTION).find().toArray();
            resolve(allBrand);
        })
    }
 


}


