const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs")
const express = require("express")
const utils = require("../config/utils")
const User = require("../models/user")

const app = express()

exports.getUser = asyncHandler(async (req, res, next) =>{
    const user = await User.findById(req.user._id).populate(['blogs , comments']).exec()
    if(!user){
        res.json({success: false , msg: "Unauthorized to view this user"})
    }
    else
    {
        res.json({success: true , user: user})
    }
})

exports.create = [
    body('userName').custom(async (value) => {
        let eUser = await User.findOne({ userName: value }).populate(['blogs', 'comments']).exec()
        if (eUser) {
            throw new Error('Username already exists')
        }
        return
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
            return res.json(error)
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
    await User.findOne({ userName: req.body.userName }).populate(['blogs', 'comments']).exec()
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

exports.delete = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params['userId'])
    if(req.user.userName !== user.userName){
        res.status(401).json({success: false , msg: "Unauthorized to delete this user"})
    }
    else{
        await User.findByIdAndDelete(req.params['userId']).then(() => res.json({success: true , msg: "Successfully deleted " + user.userName}))
    }
})