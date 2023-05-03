const S = require("sequelize");
const sequelize = require("../util/database");

const ForgotHistory = sequelize.define("ForgotHistory",{
    id:{
        type:S.INTEGER,
        primaryKey:true,
        NotNull:true,
        autoIncrement:true
    },
    location:{
        type:S.STRING
    }
})

module.exports = ForgotHistory;


