const express = require('express');
const router = express.Router();
const app = express()
const passport = require("passport");


//Controllers
const blogController = require("../controllers/blogController")
const userController = require("../controllers/userController")
const commentController = require("../controllers/commentController")

// Index and Blog routes
router.get("/", blogController.home)
router.get("/blogs", blogController.getList)
router.get("/blogs/:blogId", blogController.getBlog)
router.post("/blogs", blogController.create)
router.put("/blogs/:blogId", blogController.update)
router.delete("/blogs/:blogId", blogController.delete)


// User
router.get("/users/:userId", userController.getUser)
router.post("/signup", userController.create)
router.post("/login", userController.login)
router.put("/users/:userId", userController.update)
router.delete("/users/:userId", userController.delete)

// Comments
router.get("/comments/:commentId", commentController.getComment)
router.post("/comments/:commentId", commentController.create)
router.put("/comments/:commentId", commentController.update)
router.delete("/comments/:commentId", commentController.delete)

module.exports = router