
const mongoose = require("mongoose");

const bookSchma = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    author:{
        type:String,
        required:true,
        trim:true,
    },
    publication:{
        type:Number,
        required:true,
    },
    time:{
        type:Date,
        default:Date.now,
    }
})

module.exports = mongoose.model("books", bookSchma);