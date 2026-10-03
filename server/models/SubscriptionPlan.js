const mongoose = require('mongoose')

const PlanSchema = mongoose.Schema({
    name: { type: String, required: true },
    description:{type:String,default:"Essential maintenance for your home."},
    billingCycle: {
        type: String,
        required: true,
        enum: ["monthly", "quarterly", "yearly"],
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    benefits: [{
        service: { type: String, required: true },
        quantity: { type: Number, default: 0, min: 0 },
        isUnlimited: { type: Boolean, default: false }
    }
    ],
    isActive: { type: Boolean, default:true},
}, { timestamps: true })

const SubscriptionPlan = mongoose.model("SubscriptionPlan", PlanSchema)
module.exports = SubscriptionPlan