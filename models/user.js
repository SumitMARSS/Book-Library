
const mongoose = require("mongoose");

const userSchma = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["Admin" , "Visitor"],
    },
    token:{
        type:String,
    },
    books:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"books",
        }
    ]
})

module.exports = mongoose.model("User", userSchma);