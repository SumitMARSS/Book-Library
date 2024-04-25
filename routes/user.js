const express = require("express");
const router = express.Router();


const{
    getUserProfile, 
    getAllUsers
} = require("../controllers/user");


const {
    login,
    signUp,
    logout,
} = require("../controllers/Auth");

const { auth, isAdmin } = require("../middlewares/auth");


// ********************************************************************************************************
//                                      Authenticate
// ********************************************************************************************************


router.route("/signUp").post(signUp);

router.route("/login").post(login);


// ********************************************************************************************************
//                                      Admin Intraction
// ********************************************************************************************************


router.route("/user/:id").get(auth, isAdmin, getUserProfile);

router.route("/users").get(auth, isAdmin, getAllUsers);


// ********************************************************************************************************
//                                      Admin Intraction
// ********************************************************************************************************


router.route("/logout").get( auth, logout);

module.exports = router;