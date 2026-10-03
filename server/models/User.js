const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: { type: String, required: true, trim: true, },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    address: {
        house: String,
        street: String,
        area: String,
        city: String,
        state: String,
        pincode: String
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true })

//Creating model
const User = mongoose.model("User", UserSchema)
module.exports = User