const express = require("express")
const ExpenseRoutes = express.Router()
const Authentication = require("../Middleware/authorization")

const ExpnseController = require("../Controller/Expense")

ExpenseRoutes.get("/getExpense_data", Authentication, ExpnseController.getData)
ExpenseRoutes.post("/postExpense", ExpnseController.postExpnseData)
ExpenseRoutes.delete("/deleteExpense/:id", ExpnseController.deleteExpenseData)

module.exports = ExpenseRoutes