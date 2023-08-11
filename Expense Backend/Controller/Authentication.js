const ExpAuthData = require("../Model/ExpAuth")

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

exports.getAuthData = async (req, res, next) => {
    res.send("Work Fine")
}