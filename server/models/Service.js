const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    name: {type: String,required: true,trim: true},
    category: {type: String,required: true,enum: ["cleaning", "plumbing", "electrical"]},
    description: {type: String,required: true,trim: true},
    image: {type: String,required: true},
    features: [{type: String,trim: true}],
    basePrice: {type: Number,required: true,min: 0},
    duration: {type: Number,required: true,min: 1},
    isActive: {type: Boolean,default: true}
}, { timestamps: true });

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;