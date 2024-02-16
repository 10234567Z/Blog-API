const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.getUser = asyncHandler(async (req , res , next)=> {
    res.json("Get User : To be implemented")
})

exports.create = asyncHandler(async (req , res , next)=> {
    res.json("Create User : To be implemented")
})

exports.update = asyncHandler(async (req , res , next)=> {
    res.json("Update User : To be implemented")
})

exports.delete = asyncHandler(async (req , res , next)=> {
    res.json("Delete User : To be implemented")
})