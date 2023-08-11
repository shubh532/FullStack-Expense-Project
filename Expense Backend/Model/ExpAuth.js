const Sequelize =require("sequelize")

const sequelize = require("../Util/Database")

const ExpAuthData=sequelize.define("expenseAuth",{
    id:{
        type:Sequelize.UUID,
        allowNull:false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey:true
    },
    Name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports=ExpAuthData
