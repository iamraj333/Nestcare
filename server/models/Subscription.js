const mongoose = require('mongoose')

const subscriptionSchema = mongoose.Schema({
   customer:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
   },
   plan:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'SubscriptionPlan',
    required:true
   },
   startDate:{
    type:Date,
    required:true
   },
   endDate:{
    type:Date,
    required:true
   },
   autoRenew:{
    type:Boolean,
    default:false
   },
   status:{
    type:String,
    enum:["pending","active","expired","cancelled"],
    default:"pending"
   },
   payment:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Payment',
   }
}, { timestamps: true })

const Subscription = mongoose.model("Subscription", subscriptionSchema)
module.exports = Subscription