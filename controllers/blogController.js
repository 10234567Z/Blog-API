const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Blog = require("../models/blog")

exports.home = asyncHandler(async(req , res , next) => {
    const firstFive = await Blog.find({}).limit(5)
    if(!firstFive.length){
        res.json("No blogs present")
    }
    res.json(firstFive)
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
 