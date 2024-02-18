const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors")
const bcrypt = require("bcryptjs")
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;

require('dotenv').config()

const mongoose = require("mongoose");

const indexRouter = require("./routes/index")

const mongoDb = process.env.MONGODB_URI;
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));


const app = express();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.PUB_KEY,
    algorithms: ['RS256']
};


passport.use(new JwtStrategy(options, function (jwt_payload, done) {

    User.findOne({ _id: jwt_payload.sub }, function (err, user) {

        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }

    });

}));

app.use(cors())
app.use(session({ secret: process.env.SESSION_SEC, resave: false, saveUninitialized: true, cookie: { maxAge: 3600000 } }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

app.use("/", indexRouter);


app.listen(3000, () => console.log("app listening on port 3000!"));