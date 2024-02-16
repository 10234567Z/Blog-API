const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.home = asyncHandler(async(req , res , next) => {
    res.json("To be implemented")
})