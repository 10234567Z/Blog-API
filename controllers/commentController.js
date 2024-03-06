const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Comment = require("../models/comment")
const User = require("../models/user")
const Blog = require("../models/blog")

exports.create = [
    body('text')
        .isLength({ min: 1 })
        .escape()
        .withMessage("Should be atleast a word long."),
    asyncHandler(async (req, res, next) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.json(error)
        }
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
        const uComments = [...user.comments, comment._id]
        const bComments = [...blog.comments, comment._id]
        await Promise.all([
            comment.save(),
            User.findByIdAndUpdate(req.user._id, { comments: uComments }),
            Blog.findByIdAndUpdate(req.params['blogId'], { comments: bComments })
        ]).then(() => res.json({ success: true, comment: comment }))
    })
]

exports.update = [
    body('text')
        .isLength({ min: 1 })
        .escape()
        .withMessage("Should be atleast a word long."),
    asyncHandler(async (req, res, next) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.json(error)
        }
        const comment = await Comment.findOne({ _id: req.params['commentId'] }).populate('user').exec()
        if (req.user.userName !== comment.user.userName) {
            res.json({ success: false, msg: "Unauthorized to edit" })
        }
        else {
            await Comment.findOneAndUpdate({ _id: req.params['commentId'] }, {
                text: req.body.text,
            }, { new: true }).then((comment) => res.json({ success: true, comment: comment }))
        }
    })
]

exports.delete = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findOne({ _id: req.params['commentId'] }).populate('user').exec()
    if (req.user.userName !== comment.user.userName) {
        res.json({ success: false, msg: "Unauthorized to delete" })
    }
    else {
        const user = await User.findById(req.user._id).populate('comments').exec()
        const blog = await Blog.findById(req.params['blogId']).populate('comments').exec()
        const filteredUser = user.comments.filter((ul) => {
            return ul._id.equals(comment._id) !== true
        })
        const filteredBlog = blog.comments.filter((bl) => {
            return bl._id.equals(comment._id) !== true
        })
        await Promise.all([
            Comment.findByIdAndDelete(req.params['commentId']),
            Blog.findByIdAndUpdate(req.params['blogId'] , { comments: filteredBlog}),
            User.findByIdAndUpdate(req.user._id, { comments: filteredUser })
        ]).then(() => res.json({ success: true }))
    }
})