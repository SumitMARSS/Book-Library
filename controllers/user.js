
const User = require("../models/user");

//get user profile - tested - running

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("books");
        if (!user) {
            return res.status(404).json({
            success: false,
            message: "User Not found",
            });
        }
  
        res.status(200).json({
            success: true,
            message:"User profile fetched successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



//get all users - tested - running

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).populate("books").exec();
    
        res.status(200).json({
            success: true,
            users,
            message:"All users fetched successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message:"Error while fetching all users",
        });
    }
};


