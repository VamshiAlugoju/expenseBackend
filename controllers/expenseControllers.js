const Expense =  require("../models/expense");
const LeaderBoard = require("../models/leaderBoard");
const sequelize = require("../util/database");
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

        let expenses = await Expense.findAll({where:{userID:req.user.id}})
        expenses = JSON.stringify(expenses);
        console.log(expenses);
        let fileName = `Expense${req.user.id}${new Date()}.txt`;
        let location = await uploadToS3(fileName,expenses);
        await req.user.createForgotHistory({location});
        res.json({fileURL:location});
    }
    catch(err){
        res.status(500).json({err})
    }  
}

exports.getExpenses = async(req,res,next)=>{

    const Id = req.user.id;
    const page = parseInt(req.query.page)
    let totalItems;
    let limitPerPage ;
    if(req.query.limit)
    {
        limitPerPage = parseInt(req.query.limit)
    }
    else
      limitPerPage = 2;
    
    try{
      totalItems = await Expense.count({
        where:{
            userId:Id
        }
       })
       totalItems = parseInt(totalItems);
      let data = await Expense.findAll({where:{userid:Id},
        offset:(page-1)*limitPerPage,
        limit:limitPerPage
    });
      
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
     
    const t = await sequelize.transaction();
    const {amount,description,category} = req.body;

    if(isinvalidString(amount) || isinvalidString(description) || isinvalidString(category))
    {
        return res.status(500).json({message:"please enter fields"});
    }
    let userId = req.user.id;
    try{
      let result = await   Expense.create({amount,description,category,userId},{transaction:t});
      let TAmount = parseInt(req.user.TotalAmount)+parseInt(amount);
      await req.user.update({TotalAmount:TAmount},{transaction:t}) 
       await t.commit();
        res.json(result);
    }
    catch(err){
       await t.rollback();
        console.log(err)
       res.status(500).send({message:"cannot add items"});
    }
   
}

exports.deleteExpense = async(req,res,next)=>{
    
    const t = await sequelize.transaction()
    const Id = req.params.Id
    let userId = req.user.id;
    try{
        let data = await Expense.findOne({where:{id:Id}})

        deleteAmount =  parseInt(req.user.TotalAmount) - parseInt(data.amount);
        await req.user.update({TotalAmount:deleteAmount},{transaction:t});
        
        await Expense.destroy({where:{id:Id},transaction:t})
       await t.commit();
        res.send("deleted");
    }
    catch(err){
        await t.rollback();
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