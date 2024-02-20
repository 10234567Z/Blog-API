const mongoose = require("mongoose")
const Schema = mongoose.Schema

const commentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" , required: true },
    blog: { type: Schema.Types.ObjectId, ref: "Blog"  , required: true},
    text: { type: String, minlength: 1, required: true },
    timeStamp: { type: String , required: true },
})

module.exports = mongoose.model("Comment" , commentSchema)