const express = require("express")
const ExpenseRoutes = express.Router()

const ExpnseController = require("../Controller/Expense")

ExpenseRoutes.get("/getExpense_data", ExpnseController.getData)
ExpenseRoutes.post("/postExpense", ExpnseController.postExpnseData)

module.exports=ExpenseRoutes