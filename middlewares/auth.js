

const jwt = require("jsonwebtoken");
require("dotenv").config();

//testing done 

exports.auth = (req, res, next) => {
    try {
        //3 way to fetch tokens 

        console.log("Token", req.body.token );
        console.log("Cookies", req.cookies.token );
        console.log( "Authorization", req.header("Authorization"))
        
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");

        if( !token ){
            return res.status(401).json({
                success:false,
                message: `token is missing`,
            })
        }
        //token varify as now we have confirm tokens

        try {
            //verifing the tokens and sending payload -> in payload we also added id
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            //why?? 
            req.user = decode;  //send the decode version of req to verify their roles

        } catch (err) {
            return res.status(401).json({
                success:false,
                message:`Token doesn't matched, Invalid`,
            })
        }

        next();

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error:err.message,
            message:`Some issue with authentication area - tokens`
        })
    }
};

//testing done 

exports.isVisitor = ( req,res,next ) => {

    try {
        if( req.user.role !== "Visitor"){
            return res.status(402).json({
                success:false,
                message:`Only protected for valid Visitor`,
            })
        }
        next();
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:`Some issue with user authorization, User role doesn't match`
        })
    }
};

//testing done 

exports.isAdmin = ( req,res,next ) => {
    try {
        if( req.user.role !== "Admin" ){
            return res.status(402).json({
                success:false,
                message:`Only protected for valid admin`
            });
        }
        next();
    } catch (err) {
        return res.status(402).json({
            success:false,
            message:`Some issue with admin authorization, role doesn't match`
        })
    }
}