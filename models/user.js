const sequelize = require("../util/database.js");
const Sequeilze = require("sequelize");
const User = sequelize.define("user",{
    id:{
        type:Sequeilze.INTEGER,
        autoIncrement:true,
        NotNull:true,
        primaryKey:true
    },
    name:{
        type:Sequeilze.STRING,
    }
    ,
    email:{
        type:Sequeilze.STRING,
        unique:true
    },
    password:{
        type:Sequeilze.STRING
    },
    ispremiumUser:Sequeilze.BOOLEAN,
    TotalAmount:{
       type: Sequeilze.INTEGER,
       defaultValue:0
    }
})

module.exports = User;