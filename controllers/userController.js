const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs")
const express = require("express")
const utils = require("../config/utils")
const User = require("../models/user")

const app = express()

exports.getUser = asyncHandler(async (req, res, next) => {

})

exports.create = [
    body('userName').custom(async (value) => {
        let eUser = await User.findOne({ userName: value })
        if (eUser) {
            throw new Error('Username already exists')
        }
    }),
    body("userName")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Username invalid"),
    body("password")
        .trim()
        .isLength({ min: 4 })
        .escape()
        .withMessage("Password should be minimum 4 characters long"),
    asyncHandler(async (req, res, next) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            res.json(error)
        }
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) {
                return next(err)
            }
            else {
                const user = new User({
                    userName: req.body.userName,
                    hash: hashedPassword
                })
                await user.save()
                    .then((nuser) => {
                        const jwt = utils.issueJWT(nuser)
                        res.json({ success: true, user: nuser, token: jwt.token, expiresIn: jwt.expires })
                    })
            }
        })
    })
]

exports.login = asyncHandler(async (req, res, next) => {
    User.findOne({ userName: req.body.userName })
        .then(async (user) => {

            if (!user) {
                return res.status(401).json({ success: false, msg: "could not find user" });
            }
            const isValid = await bcrypt.compare(req.body.password, user.hash)
            if (isValid) {

                const tokenObject = utils.issueJWT(user);
                res.status(200).json({ success: true, user: user, token: tokenObject.token, expiresIn: tokenObject.expires });

            } else {

                res.status(401).json({ success: false, msg: "you entered the wrong password" });

            }
        })
        .catch((err) => {
            next(err);
        });

})

exports.update = asyncHandler(async (req, res, next) => {
    res.json("Update User : To be implemented")
})

exports.delete = asyncHandler(async (req, res, next) => {
    res.json("Delete User : To be implemented")
})