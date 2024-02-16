const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.getComment = asyncHandler(async (req , res , next)=> {
    res.json("Get Comment : To be implemented")
})

exports.create = asyncHandler(async (req , res , next)=> {
    res.json("Create Comment : To be implemented")
})

exports.update = asyncHandler(async (req , res , next)=> {
    res.json("Update Comment : To be implemented")
})

exports.delete = asyncHandler(async (req , res , next)=> {
    res.json("Delete Comment : To be implemented")
})