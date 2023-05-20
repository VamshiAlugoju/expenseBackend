const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const https = require("https");
const mongoose = require("mongoose");
 

const userauthentication = require("./middleware/Authenticate");

const url = "mongodb://user:user1234@ac-yula4xr-shard-00-00.fdkxf3f.mongodb.net:27017,ac-yula4xr-shard-00-01.fdkxf3f.mongodb.net:27017,ac-yula4xr-shard-00-02.fdkxf3f.mongodb.net:27017/Expense?ssl=true&replicaSet=atlas-lu3bl3-shard-0&authSource=admin&retryWrites=true&w=majority"
// const url = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.1"
const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const premimuRoutes = require("./routes/purchase");
const passwordRoutes = require("./routes/password");
const { Stream } = require("stream");
const PORT = process.env.PORT || 3000;

// const accessLogStream = fs.createWriteStream(path.join(__dirname,"access.log"),{flags:"a"})
// const privateKey = fs.readFileSync("key.pem");
// const certificate = fs.readFileSync("cert.pem");


app.use(bodyparser.json({extended :false}))
app.use(cors());
app.use(express.static(path.join(__dirname,"public")));
app.use(helmet());
// app.use(morgan("combined",{stream:accessLogStream}));

 
 
// User.hasMany(ForgotRequests);
// ForgotRequests.belongsTo(User);


app.use("/users",userRoutes)
app.use("/Expenses",userauthentication.Authenticate,expenseRoutes)
app.use("/purchase",premimuRoutes);
// app.use("/password",passwordRoutes);

mongoose.connect(url)
.then(res=>{
    app.listen(PORT,()=>{
        console.log("connected ")
    })
})
.catch(err=>{
    console.log(err)
})


