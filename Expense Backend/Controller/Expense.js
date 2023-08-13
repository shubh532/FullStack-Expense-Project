const ExpenseData = require("../Model/Expense")


exports.getData = async (req, res, next) => {
    try {
        const Data = await ExpenseData.findAll()
        res.status(200).json({ ...Data })
        // res.send("Working fi")
    } catch (err) {
        res.status(500).json({ message: "Somthing Went Wrong" })
    }
}

exports.postExpnseData = async (req, res, next) => {
    const { Amount, Description, Category } = req.body
    try {
        console.log(Amount, Description, Category, "Amount, Description, Category")
        const Data = await ExpenseData.create({
            Amount: Amount,
            Description: Description,
            Category: Category
        })
        console.log(Data)
        res.status(201).json({ ...Data, success: true, message: "Successfully Added" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.deleteExpenseData = async (req, res, next) => {
    const id = req.params.id
    console.log(id,"sdsfs")
    try {
        const data = await ExpenseData.findOne({ where: { id: id } })
        data.destroy()
        res.status(200).json({message:"Data Deleted"})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Server Error"})
    }
}