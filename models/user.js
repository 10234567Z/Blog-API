const mongoose = require("mongoose")

const Schema = mongoose.Schema


const userSchema = new Schema({
    userName: {type: String , required:true , minlength: 1},
    hash: {type: String , required: true},
})

module.exports = mongoose.model("User" , userSchema)