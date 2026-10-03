const mongoose=require('mongoose')

const ProfessionalSchema=mongoose.Schema({
    name:{type:String,required:true,trim:true,},
    email:{type:String,required:true,trim:true},
    phone:{type:String,required:true,trim:true},
    password:{type:String,required:true,trim:true},
    address:{
        house:String,
        street:String,
        area:String,
        city:String,
        state:String,
        pincode:String
    },
    serviceCategory:[{type:String,enum:["cleaning","plumbing","electrical"]}],
    experience:{type:String, required:true, min:0},
    document:{
        idProof:{type:String, required:true},
        addressProof:{type:String, required:true},
        certification:{type:String, required:true}
    },
    verificationStatus:{type:String,enum:["pending","approved","rejected"],default:"pending"},
    availabilityStatus:{type:String,enum:["available","busy","offline"],default:"offline"},
    rating:{type:Number,default:0,min:0,max:5},
    totalJobs:{type:Number,default:0},
    earnings:{type:Number,default:0},
    isActive:{type:Boolean,default:true}
},{timestamps:true})

//Creating model
const Professional=mongoose.model("Professional",ProfessionalSchema)
module.exports=Professional