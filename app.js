const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const Sequelize = require("sequelize")
const sequelize = require("./util/database")
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const https = require("https");

const User = require("./models/user");
const Expenses = require("./models/expense");
const Orders = require("./models/order");
const LeaderBoard = require("./models/leaderBoard");
const ForgotRequests = require("./models/ForgotRequests");
const ReportHistory = require("./models/ReportHistory");

const userauthentication = require("./middleware/Authenticate");

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const premimuRoutes = require("./routes/purchase");
const passwordRoutes = require("./routes/password");
const { Stream } = require("stream");
const PORT = process.env.PORT || 3000;

const accessLogStream = fs.createWriteStream(path.join(__dirname,"access.log"),{flags:"a"})
const privateKey = fs.readFileSync("key.pem");
const certificate = fs.readFileSync("cert.pem");


app.use(bodyparser.json({extended :false}))
app.use(cors());
app.use(express.static(path.join(__dirname,"public")));
app.use(helmet());
app.use(morgan("combined",{stream:accessLogStream}));

User.hasMany(Expenses);
Expenses.belongsTo(User);
User.hasMany(Orders);
Orders.belongsTo(User);
User.hasMany(ForgotRequests);
ForgotRequests.belongsTo(User);
User.hasMany(ReportHistory);
ReportHistory.belongsTo(User);

app.use("/users",userRoutes)
app.use("/Expenses",userauthentication.Authenticate,expenseRoutes)
app.use("/purchase",premimuRoutes);
app.use("/password",passwordRoutes);


sequelize.sync()
.then(result=>{
   
    app.listen(PORT,()=>{
        console.log("hello")
    })
})
.catch(err=>console.log(err));

