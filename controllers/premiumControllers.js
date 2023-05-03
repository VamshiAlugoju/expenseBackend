
const Order = require("../models/order");
const User = require("../models/user");
const Razorpay = require("razorpay");
const LBoard = require("../models/leaderBoard");
require("dotenv").config();



exports.getOrderID = async (req,res)=>{

    const rzp = new Razorpay({
        key_id:process.env.RAZORPAY_KEY_ID,
        key_secret:process.env.RAZORPAY_KEY_SECRET
    })
     
    const amount  = 2500;

    try{
        rzp.orders.create({amount,currency:"INR"},(err,order)=>{
             if(err)
             {  
                console.log("err is " , err)
                throw new Error("this is seror");
             }
             console.log(err ,"and" , order)  
             req.user.createOrder({orderId:order.id,status:"pending"})
             .then(()=>{
               return res.status(201).json({order,key_id:rzp.key_id});
             })
             .catch(err=>{
                throw new Error(err)
             })
            // res.send("ok")
        })
    }
    catch(err){
         console.log(err)
        res.status(500).json(JSON.stringify(err));
    }
}

exports.updateTransactionStatus = async (req,res)=>{
      
    const {order_id,payment_id} = req.body;
    try{
        let order = await Order.findOne({where:{orderId:order_id}});
        if(!order)
          throw new Error("invalid order id");
        
        await order.update({paymentId:payment_id,status:"success"});

        await req.user.update({ispremiumUser:true});

        res.status(200).json("payment successfull");
    }
    catch(err)
    {
       res.status(401).json(JSON.stringify(err));
    }
}


exports.StatusFail = async (req,res)=>{

    try{
        let {order_id} = req.body;
        let order = await Order.findOne({where:{orderId:order_id}});
        if(!order)
          throw new Error("invalid order id");
        
        await order.update({status:"failed"});
        await req.user.update({ispremiumUser:false});
        res.status(201).json("payment was unsuccessfull");
    }
    catch(err){
       
        res.status(401).json(JSON.stringify(err));
    }
}

  exports.LeaderBoard = async (req,res)=>{
      
    let data =  await User.findAll({
      attributes:['name','TotalAmount'],
      order: [
        ['TotalAmount', 'DESC']
      ]
    })
     
    
    res.json(data);
  }