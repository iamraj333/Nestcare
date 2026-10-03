const mongoose=require('mongoose')

const AdminSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

//Creating model
const Admin=mongoose.model("Admin",AdminSchema)
module.exports=Admin