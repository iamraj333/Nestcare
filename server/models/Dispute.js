const mongoose = require('mongoose')

const disputeSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    },
    professional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Professional",
        required: true
    },
    subject: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: String,
        enum: ["open", "under-review", "resolved", "rejected"],
        default: "open"
    },
    resolution: {
        type: String,
        trim: true
    },

    resolvedBy: {
        type: String,
        enum: ["admin"]
    },

    resolvedAt: {
        type: Date
    }
}, { timestamps: true })

const Dispute = mongoose.model("Dispute", disputeSchema)
module.exports = Dispute