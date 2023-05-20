const Expense =  require("../models/expense");
const User = require("../models/user");
const ForgetHistory = require("../models/ReportHistory");
const Aws = require("aws-sdk");
require('dotenv').config();

function uploadToS3(filename,data)
{  

    try{
        const BUCKET_NAME = process.env.BUCKET_NAME;
        const IAM_USER_KEY = process.env.IAM_USER_KEY;
        const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
       
        let s3bucket = new Aws.S3({
            accessKeyId:IAM_USER_KEY,
            secretAccessKey:IAM_USER_SECRET
        });
          
            let params = {
                Bucket:BUCKET_NAME,
                Key:filename,
                Body:data,
                ACL:'public-read'
            }
          
        return new Promise((resolve,reject)=>{
    
            s3bucket.upload(params,(err,s3response)=>{
                if(err){
                    reject(err);
                }
                else{
                    resolve(s3response.Location)
                }
            })
        })
    }
    catch(err)
    {
       console.log(err);
       return err;
    }
}

exports.downloadReport = async(req,res)=>{

    try{
        
        let expenses = await Expense.find({userId:req.user._id})
        expenses = JSON.stringify(expenses);

        let fileName = `Expense${req.user.id}${new Date()}.txt`;
        let location = await uploadToS3(fileName,expenses);

        await ForgetHistory.create({location,userId:req.user._id})
        res.json({fileURL:location});
    }
    catch(err){
        res.status(500).json({err})
    }  
}

exports.getExpenses = async(req,res,next)=>{

    const Id = req.user._id;
    const page = parseInt(req.query.page)
    let totalItems;
    let limitPerPage;
    if(req.query.limit)
    {
        limitPerPage = parseInt(req.query.limit)
    }
    else
      limitPerPage = 2;
    
    try{
      let user = req.user;
      totalItems = user.Expenses.length;
       totalItems = parseInt(totalItems);
       let data = await Expense.find({userId:user._id})
       .limit(limitPerPage)
       .skip((page-1)*limitPerPage);
      
      res.json({data,Pagination:{
         currentPage:page,
         nextPage:page+1,
         hasnextPage:totalItems-page*limitPerPage >=1,
         haspreviousPage: page>1,
         previousPage:page-1
      }});
    }
    catch(err)
    {
      res.send("no Items found add some");
    }
}   

exports.postExpense = async(req,res,next)=>{
     
    const {amount,description,category} = req.body;

    if(isinvalidString(amount) || isinvalidString(description) || isinvalidString(category))
    {
        return res.status(500).json({message:"please enter fields"});
    }
    let userId = req.user._id;
    try{
        const result = await Expense.create({amount,description,category,userId})
        console.log(result);
        let TAmount = parseInt(req.user.TotalAmount) + parseInt(amount);
        const user = await User.find({_id:userId})
        user[0].TotalAmount = TAmount;
        user[0].Expenses.push(result._id)
        user[0].save();
    
        res.json(result);
    }
    catch(err){
     
        console.log(err)
       res.status(500).send({message:"cannot add items"});
    }
   
}

exports.deleteExpense = async(req,res,next)=>{
    
    // const t = await sequelize.transaction()
    const Id = req.params.Id
    let user = req.user;
    let userId = user._id;
    try{
        let data = await Expense.find({_id:Id});
        deleteAmount =  parseInt(user.TotalAmount) - parseInt(data[0].amount);
        
        user.TotalAmount = deleteAmount;
        await user.save();
        await Expense.deleteOne({_id:Id});
        res.send("deleted");
    }
    catch(err){
        // await t.rollback();
        console.log(err)
        res.status(500).send("cannot delete item");
    }
 
}


function isinvalidString(string)
{
    if(!string  || string.length === 0)
    {
        return true;
    }
    return false;
}