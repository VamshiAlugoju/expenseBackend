const S = require("sequelize");
const sequelize = require("../util/database");

const LeaderBoard = sequelize.define("leaderboard",{
    id:{
        type:S.INTEGER,
        primaryKey:true,
        NotNull:true,
        autoIncrement:true
    },
    TotalAmount:
    {
       type: S.INTEGER
    },
    Name:S.STRING
})

module.exports = LeaderBoard;