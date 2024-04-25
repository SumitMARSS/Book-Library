
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const round = 10;

// tested - running 

exports.signUp = async (req, res) => {

    try{
        //find data from body
        const { name, email, password, role } = req.body;

        const verifyMail = await User.findOne({email});
        if(verifyMail){
            return res.status(400).json({
                success:false,
                message:`user already exists`
            });
        }

        let hassPassword;
        try{
            hassPassword = await bcrypt.hash(password, round);
        }
        catch(err) {
            console.log(err);
            return res.status(500).json({
                success:false,
                error:err.message,
                message:`Error in encrpting password`,
            })
        }

        const newUser = await User.create({
            name,
            email,
            password:hassPassword,
            role,
        });

        res.json({
            success:true,
            message:`User Data saver in Data Base`,
            user:newUser,
        });

    }
    catch(err){
        console.log("Error in signUp controller");
        res.status(500).json({
            success:false,
            error:err.message,
        });
    }
}

// tested - running

exports.login = async (req, res) => {

    try{
        const {email, password} = req.body;
        //validate the email and password
        if( !email || !password ){
            return res.status(400).json({
                success:false,
                message:`Plaease fill the required data`,
            })
        }
        //check wheather email present in databas eor not
        const user = await User.findOne({email}).populate("books");
        if( !user ){
            return res.status(400).json({
                status:false,
                message:`Please signUp first then only login`,
            })
        }
        //now check for password whether correct or not
        //added id to get whole data of user
        const validation = await bcrypt.compare(password, user.password );
        if( !validation){
            return res.status(401).json({
                status:false,
                message:'Enter correct password',
            });
        }

        // generate jawascript web token(JWT) 

        const payload = {
            email:user.email,
            id:user._id,
            role:user.role,
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h", 
        });

        user.token = token;
        user.password = undefined;

        const options = {
            expires: new Date(Date.now() + 24*60*60*1000 ),
            httpOnly:true,
        }

        // generate cokkies
        res.cookie('token', token, options).status(200).json({
            success:true,
            token,
            user,
            message:'Successfully logged In',
        });

    } catch (err) {
        console.log(err);
        console.log("Error while procedding for login");
        return res.status(500).json({ 
            success:false,
            message:'Error while procedding for login, try again later',
            error:err,
        })
    }
}



// logout
//tested - running

exports.logout = async (req, res) => {
    try {
    
        const id = req.user.id;

        // if we didn't get id
        if(!id){
            return res.status(402).json({
                success:false,
                message:"No one logged in to Logout"
            })
        }

        const updateUser = await User.findByIdAndUpdate(id, {
            token:null,
        },{new:true});

        res.status(200)
        .cookie("token", null, {expires: new Date(Date.now()), httpOnly: true})
        .json({
            success:true,
            message:"Logged Out Successfully",
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
            message:"Error while performing logout operation",
        });
    }
}