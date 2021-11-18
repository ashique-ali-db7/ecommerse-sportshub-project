var db = require('../config/connection');

var collections = require('../config/collection');

var bcryptjs = require('bcryptjs');
const { response } = require('express');

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
console.log(user)
if(user){
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
                response.exist = true;
                resolve(response);
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
    }


}