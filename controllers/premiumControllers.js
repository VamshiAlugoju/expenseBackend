
const Order = require("../models/order");
const User = require("../models/user");
const Razorpay = require("razorpay");

require("dotenv").config();



exports.getOrderID = async (req,res)=>{

    const rzp = new Razorpay({
        key_id:process.env.RAZORPAY_KEY_ID,
        key_secret:process.env.RAZORPAY_KEY_SECRET
    })
    const user = req.user;
    const amount  = 2500;

    try{
        rzp.orders.create({amount,currency:"INR"}, async(err,order)=>{
             if(err)
             {  
                console.log("err is " , err)
                throw new Error("this is seror");
             }
             let order_instance = await Order.create({orderId:order.id , status:"pending",userId:user._id});
             res.status(201).json({order,key_id:rzp.key_id});
        })
    }
    catch(err){
         console.log(err)
        res.status(500).json(JSON.stringify(err));
    }
}

exports.updateTransactionStatus = async (req,res)=>{
      
    const {order_id,payment_id} = req.body;
    const user = req.user;
  
    try{
        let order = await Order.find({orderId:order_id});
         
        console.log(order)
        if(!order[0])
          throw new Error("invalid order id");
        
        order[0].paymentId = payment_id;
        await order[0].save();

        user.isPremiumUser = true;
        await user.save()

        res.status(200).json("payment successfull");
    }
    catch(err)
    {   
      console.log(err)
       res.status(401).json(JSON.stringify(err));
    }
}

exports.StatusFail = async (req,res)=>{

    try{
        let {order_id} = req.body;
        let order = await Order.find({orderId:order_id});

        if(!order[0])
          throw new Error("invalid order id");
        
        order[0].status = "failed";
        await order[0].save();
        req.user.ispremiumUser = false;
        req.user.save()
        res.status(201).json("payment was unsuccessfull");
    }
    catch(err){
       
        res.status(401).json(JSON.stringify(err));
    }
}

  exports.LeaderBoard = async (req,res)=>{
      
    let data = await User.find().sort({TotalAmount:-1})
     
    res.json(data);
  }