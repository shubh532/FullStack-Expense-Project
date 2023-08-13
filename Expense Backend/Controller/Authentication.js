const ExpAuthData = require("../Model/ExpAuth")
const bcrypt = require("bcrypt")
const saltRounds = 10


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
                    const Data = await ExpAuthData.create({
                        Name: Name,
                        email: email,
                        password: hash
                    })
                    res.status(201).json({ message: "User Register Successfully" })
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
        const existUser = await ExpAuthData.findOne({ where: { email } })
        if (!existUser) {
            res.status(404).json({ message: "Email Not Exist", success: false })
        } else {
            const hash = existUser.password
            bcrypt.compare(password, hash, (err, result) => {
                if (err) {
                    throw new Error({ message: "Somthing Went Wrong" })
                }
                if (result) {
                    res.status(200).json({ message: "Successfully Login", success: true })
                } else {
                    res.status(400).json({ message: "Incorrect Password ", success: false })
                }
            })
        }
    } catch (err) {
        res.status(500).json({ message: "Error Occurred while Login", error: err.message })
    }
}


exports.getAuthData = async (req, res, next) => {
    res.send("Work Fine")
}