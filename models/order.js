const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    paymentId:String,
    orderId:String,
    status:String,
    userId:mongoose.Types.ObjectId
})

const Order = mongoose.model("order",OrderSchema);

module.exports = Order;