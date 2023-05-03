const Sib = require("sib-api-v3-sdk");
const password = require("../models/ForgotRequests");
const client = Sib.ApiClient.instance;
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const User = require("../models/user");
const sequelize = require("../util/database");
require("dotenv").config();
const bcrypt = require("bcryptjs");


let userIdForPassword;
let passwordId;

exports.forgotPassword = async (req, res) => {
    const t = await sequelize.transaction()
  // console.log(req.body.email)
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
     
    if (user) {
        
        let id = uuidv4();
       await password.create({id,isActive:true,userId:user.id},{transactions:t})

      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.SIB_API_KEY;

      const tranEmailApi = new Sib.TransactionalEmailsApi();

      const sender = {
        email: "vamshialugoju024@gmail.com",
      };

      const reciever = [
        {
          email: req.body.email,
        },
      ];

     await tranEmailApi
        .sendTransacEmail({
          sender,
          to: reciever,
          subject: "hello",
          textContent: `http://localhost:3000/password/resetPassword/${id}`,
        })
        await t.commit()
        userIdForPassword = user.id;
        passwordId = id;
        res.send("ok");
    } else {
      throw new Error("user not found with the email id");
    }
  } catch (err) {
    await t.rollback();
    console.log(err)
    res.status(500).json(err)
  }
};



exports.resetPassword = async (req, res) => {
  const Id = req.params.id;
  try {
    const request = await password.findOne({ where: { id: Id } });
    // console.log(request)
    if (request) {
      if (request.isActive) {

       res.sendFile(path.join(__dirname,"../","views","index.html"));

      } else {
        throw new Error("invalid request");
      }
    } else {
      throw new Error("invalid unique Id");
    }
  } catch (err) {
    res.status(500).json(err);
  }
 
};


exports.changePassword =async (req,res)=>{

   const newpassword = req.body.password;
   console.log(newpassword)
   const t = await sequelize.transaction();
   try{
    bcrypt.hash(newpassword,10,async (err,result)=>{
        
      await User.update({password:result},{where:{id:userIdForPassword},transaction:t});
      await password.update({isActive:false},{where:{id:passwordId},transaction:t});
      t.commit();
       res.json("you password updated")
     })
   }
   catch(err){
     t.rollback();
    console.log(err);
    res.status(401).json("something went wrong");

   }
  

}