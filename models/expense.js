const sequelize  = require("../util/database");
const S = require("sequelize");

const Expense = sequelize.define("expense",{

    id:{
        type:S.INTEGER,
        primaryKey:true,
        NotNull:true,
        autoIncrement:true
    },
    amount:{
        type:S.INTEGER,
        NotNull:true
    },
    description:{
        type:S.STRING
    },
    category:{
        type:S.STRING
    }
})

module.exports = Expense;