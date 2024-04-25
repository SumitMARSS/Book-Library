
const mongoose = require("mongoose");
require("dotenv").config();


const dbConnect = () => {
    mongoose.connect(process.env.BASE_URL)
    .then(() => { console.log("DB connected successfully") })
    .catch((err) => {
        console.log("error in db connection");
        console.log(err.message);
        process.exit(1);
    } )
}

module.exports = dbConnect;