
const Sequeilze = require("sequelize");
const sequelize = require("../util/database");

const ForgotRequest = sequelize.define("forgotRequest",{
    id:{
        type:Sequeilze.STRING,
        primaryKey:true,
        NotNull:true
    },
    isActive:Sequeilze.BOOLEAN
})



module.exports = ForgotRequest;