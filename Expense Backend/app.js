require('dotenv').config()
const express = require("express")
const bodyparser = require('body-parser')
const cors = require("cors")
const User = require("./Model/User")
const Expense = require('./Model/Expense')
const Order = require("./Model/Order")
const Routes = require("./Routes/AuthRoutes")
const ExpenseRoutes = require('./Routes/ExpenseRoutes')
const PurchaseRoute = require("./Routes/purchase")
const Authsequelize = require("./Util/Database")
const app = express()

app.use(cors())
app.use(bodyparser.json())

app.use(Routes)
app.use(ExpenseRoutes)
app.use("/purchase", PurchaseRoute)


User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

Authsequelize.sync()
    .then(app.listen(4000, 'localhost', () => {
        console.log("click on http://localhost:4000")
    })
    )
    .catch(err => console.log(err, "err occure form app.js"))
