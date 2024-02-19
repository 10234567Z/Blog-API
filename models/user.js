const mongoose = require("mongoose")

const Schema = mongoose.Schema


const userSchema = new Schema({
    userName: { type: String, required: true, minlength: 1 },
    hash: { type: String, required: true },
    blogs: [{ type: Schema.ObjectId, ref: "Blog" }],
    comments: [{ type: Schema.ObjectId, ref: "Comment" }],
})

module.exports = mongoose.model("User", userSchema)