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
exports.getBlog = asyncHandler(async (req, res, next) => {
    
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
            res.json(error.errors[0].msg)
        }
        const currentdate = new Date();
        const datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        if(req.user){

        }
        else{
            
        }
        const blog = new Blog({
            user: req.body.user,
            title: req.body.title,
            text: req.user._id,
            timeStamp: datetime,
            public: req.body.public
        })
        await blog.save()
        res.json(`${req.body.user}'s blog is posted successfully`)
    })
]

exports.update = asyncHandler(async (req, res, next) => {
    res.json("Update : To be implemented")
})
exports.delete = asyncHandler(async (req, res, next) => {
    res.json("Delete : To be implemented")
})
