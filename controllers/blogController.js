const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Blog = require("../models/blog")
const User = require("../models/user")
const utils = require("../config/utils")

exports.home = asyncHandler(async (req, res, next) => {
    const firstFive = await Blog.find({}).limit(5)
    if (!firstFive.length) {
        res.json("No blogs present yet...But you can make it!")
    }
    res.json(firstFive)
})

exports.getList = asyncHandler(async (req, res, next) => {
    const allBlogs = await Blog.find({})
    if (!allBlogs.length) {
        res.json("No blogs present")
    }
    res.json(allBlogs)
})

exports.getBlog = asyncHandler(async (req, res, next) => {
    const blog = await Blog.findById(req.params['blogId']).populate('comments').populate('user').exec()
    if (!blog) {
        res.json({ success: false, msg: "No blog found with that id" })
    }
    res.json({ success: true, blog: blog })
})

exports.create = [
    body("title")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Not long enough title"),
    body("text")
        .trim()
        .isLength({ min: 100 })
        .escape()
        .withMessage("The text content should be more than 100 words"),
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
        const blog = new Blog({
            user: req.user._id,
            title: req.body.title,
            text: req.body.text,
            timeStamp: datetime,
            public: req.body.public
        })
        const aUser = await User.findById(blog.user)
        const user = {
            blogs: [...aUser.blogs, blog._id]
        }
        await Promise.all([
            User.findByIdAndUpdate(blog.user, user, { new: true }).then((user) => res.json({ success: true, msg: "Updated user's blog list" })),
            blog.save()
        ])
    })
]

exports.update = [
    body("title")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Not long enough title"),
    body("text")
        .trim()
        .isLength({ min: 100 })
        .escape()
        .withMessage("The text content should be more than 100 words"),
    asyncHandler(async (req, res, next) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.json(error)
        }
        const blog = await Blog.findOne({ _id: req.params['blogId'] }).populate('user').exec()
        if (req.user.userName !== blog.user.userName) {
            res.json({ success: false, msg: "Unauthorized to edit" })
        }
        else {
            await Blog.findOneAndUpdate({ _id: req.params['blogId'] }, {
                title: req.body.title,
                text: req.body.text,
                public: req.body.public
            }, { new: true }).then((blog) => res.json({ success: true, blog: blog }))
        }
    })
]

exports.delete = asyncHandler(async (req, res, next) => {
    const blog = await Blog.findOne({ _id: req.params['blogId'] }).populate('user').exec()
    if (req.user.userName !== blog.user.userName) {
        res.json({ success: false, msg: "Unauthorized to delete" })
    }
    else {
        const user = await User.findById(req.user._id).populate('blogs').exec()
        const filtered = user.blogs.filter((bl) => {
            return bl._id.equals(blog._id) !== true
        })
        await Promise.all([
            Blog.findByIdAndDelete(req.params['blogId']),
            User.findByIdAndUpdate(req.user._id , { blogs: filtered })
        ]).then(() => res.json({success: true}))
    }
})
