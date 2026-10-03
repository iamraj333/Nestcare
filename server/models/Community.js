const mongoose = require("mongoose");
const communitySchema = new mongoose.Schema({
    email: {type: String,required: true,unique: true,trim: true},
    subscribedAt: {type: Date,default: Date.now},
    isActive: {type: Boolean,default: true}
}, { timestamps: true });
const Community = mongoose.model("Community", communitySchema);
module.exports = Community;