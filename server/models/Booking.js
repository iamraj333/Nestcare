const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema({
    customer: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
    subscriptionId: {type: mongoose.Schema.Types.ObjectId,ref: 'Subscription',required: true},
    service: {type: mongoose.Schema.Types.ObjectId,ref: 'Service',required: true,},
    professional: {type: mongoose.Schema.Types.ObjectId,ref: 'Professional'},
    address: {
        house: String,
        street: String,
        area: String,
        city: String,
        state: String,
        pincode: String
    },
    scheduleDate: {type: Date,required: true},
    timeSlot: {type: String,required: true},
    status: {type: String,enum: ["proposed","confirmed","assigned","accepted","in-progress","completed","cancelled","rescheduled"],default: "proposed"},
    paymentStatus:{type:String,enum:["not-required","pending","paid","refunded"],default:"not-required"},
    notes: {type: String,trim: true},
    rating:{type:Number,min:1,max:5},
    review:{type:String,trim:true}
},{timestamps:true})

const Booking=mongoose.model("Booking",bookingSchema)
module.exports=Booking