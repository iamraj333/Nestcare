const mongoose=require('mongoose');

const MongoConnection=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo Connection Successful.")
    }
    catch(e){
        console.error("Mongo Connection Failed: ",e);
    }
}

module.exports=MongoConnection;