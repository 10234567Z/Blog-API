const express = require('express');
const router = express.Router();
const app = express()
const User = require("../models/user")
const passport = require("passport");
const bcrypt = require("bcryptjs")
const LocalStrategy = require("passport-local").Strategy;

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

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ userName: username })
            if (!user) {
                return done(null, false, { message: "Incorrect username" })
            }
            const match = await bcrypt.compare(password, user.hash)
            if (!match) {
                return done(null, false, { message: "Incorrect Password" })
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
)

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    };
});

// User
router.get("/users/:userId", userController.getUser)
router.post("/users" , userController.create)
router.post("/users/login" ,  passport.authenticate('local') , (req , res , next) => {
    res.json("Success")
})
router.put("/users/:userId" , userController.update)
router.delete("/users/:userId" , userController.delete)

// Comments
router.get("/comments/:commentId" , commentController.getComment )
router.post("/comments/:commentId" , commentController.create)
router.put("/comments/:commentId" , commentController.update)
router.delete("/comments/:commentId" , commentController.delete)

module.exports = router