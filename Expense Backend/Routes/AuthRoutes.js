const express=require("express")

const AuthRoutes=express.Router()

const AuthController = require("../Controller/Authentication")

AuthRoutes.post("/expense-authencation", AuthController.postAuthData)
AuthRoutes.post("/expense-login", AuthController.postLoginData)
AuthRoutes.get("/", AuthController.getAuthData)

module.exports=AuthRoutes