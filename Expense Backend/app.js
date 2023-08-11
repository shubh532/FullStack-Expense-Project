const express = require("express")
const bodyparser = require('body-parser')
const cors = require("cors")

const Routes = require("./Routes/AuthRoutes")
const Authsequelize = require("./Util/Database")
const app = express()

app.use(cors())
app.use(bodyparser.json())

app.use(Routes)


Authsequelize.sync()
    .then(app.listen(4000, 'localhost', () => {
        console.log("click on http://localhost:4000")
    })
)
.catch(err=>console.log(err,"err occure form app.js"))
