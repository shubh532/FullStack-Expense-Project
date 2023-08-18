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
    const t = await sequelize.transaction()
    const { Amount, Description, Category, userId } = req.body
    const prevTotal = req.user.totalAmount
    const totalAmount = Number(prevTotal) + Number(Amount)
    try {
        const Data = await ExpenseData.create({
            Amount: Amount,
            Description: Description,
            Category: Category,
            userId: userId
        }, { transaction: t })

        await User.update(
            {
                totalAmount: totalAmount
            }, {
            where: { id: userId },
            transaction: t
        }
        )
        // console.log(Data)
        await t.commit()
        res.status(201).json({ ...Data, success: true, message: "Successfully Added" })
    } catch (err) {
        await t.rollback()
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.deleteExpenseData = async (req, res, next) => {
    const id = req.params.id
    // console.log(id,">>>>>>>>id")
    const prevTotal = req.user.totalAmount
    const t = await sequelize.transaction()
    try {
        const data = await ExpenseData.findOne({ where: { id: id }, transaction: t })
        // console.log("dta>>>>>",data)
        const Amount= data.dataValues.Amount
        const userId= data.dataValues.userId
        const totalAmount = Number(prevTotal) - Number(Amount)
        await User.update(
            { totalAmount: totalAmount },
            { where: { id: userId }, transaction: t }
        )
        t.commit()
        data.destroy()
        res.status(200).json({ message: "Data Deleted" })
    } catch (err) {
        t.rollback()
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