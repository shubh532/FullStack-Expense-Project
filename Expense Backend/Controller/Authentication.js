const ExpAuthData = require("../Model/ExpAuth")
const { Op } = require("sequelize")

exports.postAuthData = async (req, res, next) => {
    const Name = req.body.name
    const email = req.body.email
    const password = req.body.password
    try {
        const existMail = await ExpAuthData.findOne({ where: { email } })
        if (existMail) {
            res.status(409).json({ message: "Email Already Exist" })
            res.end()
        } else {
            const Data = await ExpAuthData.create({
                Name: Name,
                email: email,
                password: password
            })
            res.status(201).json({ message: "User Register Successfully", TokenId: Data.id })
            res.end()
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
        if (!existUser){
            res.status(401).json({message:"Email Not Exist"})
        }else{
            const checkpassword =await ExpAuthData.findOne({where:{password}})
            if(!checkpassword){
                res.status(401).json({message:"Password Mismatch"})
            } else{
                res.status(200).json({message:"Successful Login"})
            }
        }
    } catch (err) {
        res.status(500).json({ message: "Error Occurred while Login", error: err.message })
    }
}


exports.getAuthData = async (req, res, next) => {
    res.send("Work Fine")
}