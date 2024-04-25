
const express = require("express") ;
const app = express();
const dbConnect = require("./config/dataBase");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/user");
const bookRoute = require("./routes/book");

require("dotenv").config(); 

const PORT = process.env.PORT || 4000;

//using middlewares
app.use(express.json());    //if we want data from body-parsing
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


//mounting 

app.use("/api/v1", userRoute);
app.use("/api/v1", bookRoute);


//db connection
try {
    dbConnect();
    console.log("Database connected successfully!");
} catch (err) {
    console.error("Error connecting to the database:", err);
}
//server start
app.listen(PORT, () => {
    console.log(`App is running successfully at ${PORT}`);
});

//Default route
app.get("/", (req , res) => {
    res.send("This is my home page");
})