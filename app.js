const mongoose=require("mongoose");
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/userManagement");

const session=require("express-session")
const path = require("path")
const express=require("express");
const app = express();

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

const bodyParser=require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use(function (req, res, next) {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    next();
  })

app.use(
    session({
        secret: "keyboard cat",
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 8000000 }
    })
);

//for user route
const userRoute=require("./routes/userRouter");
app.use("/",userRoute);

//for admin route
const adminRoute=require("./routes/adminrouter");
app.use("/admin",adminRoute);

app.listen(7000,()=>{
    console.log("server is running");
});