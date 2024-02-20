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
router.post("/blogs", passport.authenticate("jwt", { session: false }), blogController.create)
router.put("/blogs/:blogId", passport.authenticate("jwt", { session: false }) , blogController.update)
router.delete("/blogs/:blogId", passport.authenticate("jwt", { session: false }) , blogController.delete)


// User
router.post("/signup", userController.create)
router.post("/login", userController.login)
router.delete("/users/:userId" , passport.authenticate("jwt", { session: false }) , userController.delete)

// Comments
router.post("/blogs/:blogId/comments" , passport.authenticate("jwt", { session: false }) , commentController.create)
router.put("/blogs/:blogId/comments/:commentId", passport.authenticate("jwt", { session: false }) , commentController.update)
router.delete("/blogs/:blogId/comments/:commentId", passport.authenticate("jwt", { session: false }) , commentController.delete)

module.exports = router