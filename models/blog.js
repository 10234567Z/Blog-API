const mongoose = require("mongoose")
const Schema = mongoose.Schema

const blogSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, minlength: 1, required: true },
    text: { type: String, minlength: 100, required: true },
    timeStamp: { type: String, required: true },
    public: { type: Boolean, required: true },
    comments: [{ type: Schema.ObjectId, ref: "Comment" }],
})

module.exports = mongoose.model("Blog", blogSchema)