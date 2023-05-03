const jwt = require("jsonwebtoken");
const User = require("../models/user");


const Authenticate = (req,res,next)=>{
  
//   console.log( "header are ????" , req.header("Authorization"))

    try{
         const token = req.header("Authorization");
         const user = jwt.verify(token,"secretkey")
         User.findByPk(user.userId)
         .then(user=>{
             req.user = user;
            //  console.log(user);
             next();
         })
         .catch(err=>{
            
            throw new Error("user not found");
         })
    }
    catch(err){
         console.log(err);
         res.status(401).json({success:false});
    }
}

module.exports ={ Authenticate};