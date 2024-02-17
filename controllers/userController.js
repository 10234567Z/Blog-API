const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs")

const User = require("../models/user")

exports.getUser = asyncHandler(async (req, res, next) => {
    res.json("Get User : To be implemented")
})

exports.create = [
    body("userName")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Username invalid"),
    body("password")
        .trim()
        .isLength({min: 4})
        .escape()
        .withMessage("Password should be minimum 4 characters long"),
    asyncHandler(async (req, res, next) => {
        const error = validationResult(req)
        if(!error.isEmpty()){
            res.json(error)
        }
        bcrypt.hash(req.body.password , 10 , async( err , hashedPassword) => {
            if(err){
                return next(err)
            }
            else{
                const user = new User({
                    userName: req.body.userName,
                    hash: hashedPassword
                })
                await user.save()
                res.json(`${req.body.userName}'s account made successfully`)
            }
        })
    })
]

exports.update = asyncHandler(async (req, res, next) => {
    res.json("Update User : To be implemented")
})

exports.delete = asyncHandler(async (req, res, next) => {
    res.json("Delete User : To be implemented")
})