const mongoose = require("mongoose")
const Schema = mongoose.Schema

const commentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    blog: { type: Schema.Types.ObjectId, ref: "Blog" },
    text: { type: String, minlength: 1, required: true },
    timeStamp: { type: Date , required: true },
})

module.exports = mongoose.model("Comment" , commentSchema)