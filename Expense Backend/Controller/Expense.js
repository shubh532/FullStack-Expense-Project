const ExpenseData = require("../Model/Expense")
const User = require("../Model/User")
const sequelize = require("../Util/Database")


exports.getData = async (req, res, next) => {
    // console.log("req use>>>>>>>",req.user)
    const id = req.user.id
    try {
        const dataPromise = ExpenseData.findAll({ where: { userId: id } })
        const userPromise = User.findOne({ where: { id: id } })
        const [Data, user] = await Promise.all([dataPromise, userPromise])
        res.status(200).json({ data: { ...Data }, user: { primeUser: user.isprimiumUser } })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Somthing Went Wrong" })
    }
}

exports.postExpnseData = async (req, res, next) => {
    const { Amount, Description, Category, userId } = req.body
    const prevTotal=req.user.totalAmount
    const totalAmount=Number(prevTotal)+Number(Amount)
    try {
        const Data = await ExpenseData.create({
            Amount: Amount,
            Description: Description,
            Category: Category,
            userId: userId
        })
        await User.update(
            {
                totalAmount: totalAmount
            },{
                where:{
                    id:userId
                }
            }
        )
        console.log(Data)
        res.status(201).json({ ...Data, success: true, message: "Successfully Added" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.deleteExpenseData = async (req, res, next) => {
    const id = req.params.id
    console.log(id, "sdsfs")
    try {
        const data = await ExpenseData.findOne({ where: { id: id } })
        data.destroy()
        res.status(200).json({ message: "Data Deleted" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.LeaderBoardData = async (req, res, next) => {
    try {
        const user = await User.findAll({
            order: [["totalAmount", "DESC"]]
        })
        res.status(200).json([...user])
        res.end()
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}