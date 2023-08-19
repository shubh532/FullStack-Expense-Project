const ExpAuthData = require("../Model/User")
const bcrypt = require("bcrypt")
const saltRounds = 10
const jwt = require("jsonwebtoken")
const API_KEY = process.env.BREVO_API_KEY
let SibApiV3Sdk = require('sib-api-v3-sdk');


function generateAccessToken(id, name) {
    return jwt.sign({ userId: id, name: name }, "QWERTYUIOPASDFGHJKLMNBVCXZ!#@$%^&*147852369")
}

exports.postAuthData = async (req, res, next) => {
    const Name = req.body.name
    const email = req.body.email
    const password = req.body.password
    try {
        const existMail = await ExpAuthData.findOne({ where: { email } })
        if (existMail) {
            res.status(409).json({ message: "Email Already Exist" })
        } else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    throw new Error("Somthing Wnet wrong")
                } else {
                    const User = await ExpAuthData.create({
                        Name: Name,
                        email: email,
                        password: hash
                    })
                    res.status(201).json({ message: "User Register Successfully", user: User })
                }
            })
        }
    } catch (err) {
        res.status(500).json({ message: "Error Occurred", error: err.message })
    }
}

exports.postLoginData = async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    // console.log(email, password,"sdfhbsjdfsjd")
    try {
        const User = await ExpAuthData.findOne({ where: { email } })
        if (!User) {
            res.status(404).json({ message: "Email Not Exist", success: false })
        } else {
            const hash = User.password
            bcrypt.compare(password, hash, (err, result) => {
                if (err) {
                    throw new Error({ message: "Somthing Went Wrong" })
                }
                if (result) {
                    res.status(200).json({ message: "Successfully Login", success: true, user: User, tokenId: generateAccessToken(User.id, User.Name) })
                } else {
                    res.status(400).json({ message: "Incorrect Password ", success: false })
                }
            })
        }
    } catch (err) {
        console.log(err, "from login route")
        res.status(500).json({ message: "Error Occurred while Login", error: err.message })
    }
}


exports.getAuthData = async (req, res, next) => {
    res.send("Work Fine")
}


exports.postForgotpassWord = async (req, res, next) => {
    console.log(req.body.email)
    const email = req.body.email
    let Client = SibApiV3Sdk.ApiClient.instance;
    let apiKey = Client.authentications['api-key'];
    apiKey.apiKey = API_KEY
    console.log(API_KEY,"API KEY<<<<<<<<<<")
    // res.status(200).json({ message: "Work Fine,.........." })

    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const Sender = {
        email: "shubhammahulkar2000@gmail.com",
        name: "Shubham Mahulkar"
    }
    const receivers = [{
        email: email
    }]
    try {
        const result = await apiInstance.sendTransacEmail({
            Sender,
            to: receivers,
            subject: "Tetsing Mail",
            textContent: "This is testing mail",
            htmlContent: "<a href='www.google.com'>Reset Passwaord</a>"
        })
        console.log({ result: result, message:"Successfull" })
        res.end()
    } catch (err) {
        console.log(err, "<<<<<<<<<<ERRRR")
    }
}