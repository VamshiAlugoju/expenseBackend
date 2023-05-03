const express = require("express");
const router = express.Router();
const expenseControllers = require("../controllers/expenseControllers");
const userauthentication = require("../middleware/Authenticate");

router.get("/", expenseControllers.getExpenses);

router.post("/",expenseControllers.postExpense);

router.delete("/:Id",expenseControllers.deleteExpense);

router.get("/downloadReport",expenseControllers.downloadReport)



module.exports = router;