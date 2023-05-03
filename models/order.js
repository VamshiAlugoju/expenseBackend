const S = require("sequelize");
const sequelize = require("../util/database");

const Order = sequelize.define("order",{
    id:{
        type:S.INTEGER,
        primaryKey:true,
        NotNull:true,
        autoIncrement:true
    },
    paymentId:S.STRING,
    orderId:S.STRING,
    status:S.STRING
})

module.exports = Order;