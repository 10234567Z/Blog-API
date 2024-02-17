const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Blog = require("../models/blog")

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
exports.getBlog = [
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
        if(!error.isEmpty()){
            res.json(error.errors[0].msg)
        }
        const blog = new Blog({
            user: req.body.user,
            title: req.body.title,
            text: req.body.text,
            timeStamp: req.body.timeStamp,
            public: req.body.public
        })
        await blog.save()
        res.json(`${req.body.user}'s blog is posted successfully`)
    })
]
exports.create = asyncHandler(async (req, res, next) => {
    res.json("Create : To be implemented")
})
exports.update = asyncHandler(async (req, res, next) => {
    res.json("Update : To be implemented")
})
exports.delete = asyncHandler(async (req, res, next) => {
    res.json("Delete : To be implemented")
})
