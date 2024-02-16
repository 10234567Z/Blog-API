const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.home = asyncHandler(async(req , res , next) => {
    res.json("Home : To be implemented")
})
exports.getList = asyncHandler(async(req , res , next) => {
    res.json("Get List : To be implemented")
})
exports.getBlog = asyncHandler(async(req , res , next) => {
    res.json("Get Blog : To be implemented")
})
exports.create = asyncHandler(async(req , res , next) => {
    res.json("Create : To be implemented")
})
exports.update = asyncHandler(async(req , res , next) => {
    res.json("Update : To be implemented")
})
exports.delete = asyncHandler(async(req , res , next) => {
    res.json("Delete : To be implemented")
})
 