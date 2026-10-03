const mongoose = require('mongoose')
const paymentSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubscriptionPlan',
        required: true
    },
    amount: {
        type: Number,
        min: 0,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["UPI", "card", "netbanking", "wallet"],
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ["pending", "success", "failed", "refunded"],
        default: "pending"
    }
}, { timestamps: true })
const Payment = mongoose.model("Payment", paymentSchema)
module.exports = Payment