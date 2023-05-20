const mongoose = require("mongoose");

const ForgetSchema = new mongoose.Schema({
    location:String,
    userId:mongoose.Types.ObjectId
})

const ForgetHistory = mongoose.model("ForgetHistory" , ForgetSchema);

module.exports = ForgetHistory;
  


