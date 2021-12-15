const mongoClient = require('mongodb').MongoClient

const state = {
    db:null
}
module.exports.connect = function(done){
    const url = 'mongodb+srv://ashiqueali:kuttithodi123@sportshub.6wexz.mongodb.net/sportshub?retryWrites=true&w=majority'
    const dbname = 'sportshub'

    mongoClient.connect(url,(err,data)=>{
        if(err){
            return done(err)
        }
        state.db = data.db(dbname)
        done()
    })

  
}

module.exports.get = function(){
    return state.db
}

