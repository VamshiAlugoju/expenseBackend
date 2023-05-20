const mongoose= require("mongoose");

const UserSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    isPremiumUser:{
        type:Boolean,
        default:false
    },
    TotalAmount:{
        type:Number,
        default:0
    },
    Expenses:[]
})

const User = mongoose.model("User",UserSchema);


module.exports = User;