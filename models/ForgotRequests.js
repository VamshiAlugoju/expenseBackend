
const mongoose = require("mongoose");

const ForgotRequestSchema = new mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    isActive:{
        type:Boolean,
        default:false
    }
})

const ForgotRequest = mongoose.model("ForgotRequest",ForgotRequestSchema);


module.exports = ForgotRequest;