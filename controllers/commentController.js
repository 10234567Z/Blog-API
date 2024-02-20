const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Comment = require("../models/comment")
const User = require("../models/user")
const Blog = require("../models/blog")

exports.create = [
    body('text')
        .isLength({min: 1})
        .escape()
        .withMessage("Should be atleast a word long."),
    asyncHandler(async(req , res , next) => {
        const currentdate = new Date();
        const datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        const comment = new Comment({
            user: req.user._id,
            blog: req.params['blogId'],
            text: req.body.text,
            timeStamp: datetime
        })
        const user = await User.findById(req.user._id)
        const blog = await Blog.findById(req.params['blogId'])
        const uComments = [...user.comments , comment._id]
        const bComments = [...blog.comments , comment._id]
        await Promise.all([
            comment.save(),
            User.findByIdAndUpdate(req.user._id , {comments: uComments}),
            Blog.findByIdAndUpdate(req.params['blogId'] , {comments: bComments})
        ]).then(() => res.json({success: true , comment: comment}))
    })
]

exports.update = asyncHandler(async (req , res , next)=> {
    res.json("Update Comment : To be implemented")
})

exports.delete = asyncHandler(async (req , res , next)=> {
    res.json("Delete Comment : To be implemented")
})