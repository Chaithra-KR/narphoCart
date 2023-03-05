const express = require("express");
const userRoute = express();
const path = require("path")   
const userController = require("../controller/userController")
const cartController = require("../controller/cart-controller")
const wishlistController = require("../controller/wishlist-controller")
const authentic = require("../middleware/authentic")


const session = require("express-session")
userRoute.use(function (req, res, next) {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    next();
  })


userRoute.use(
    session({
        secret: "keyboard cat",
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 8000000 }
    })
);
userRoute.set("views", path.join(__dirname, "views"));
userRoute.set("views", "./views/user");


userRoute.get("/register", userController.doRegister);
userRoute.post("/register", userController.otpValidation)

userRoute.get("/login", userController.doLogin);
userRoute.post("/login", userController.verifyLogin);

userRoute.get('/',userController.home)
userRoute.get("/logout", authentic.isLogin, userController.userLogout)

userRoute.get("/otp",authentic.isLogin,userController.getotp)
userRoute.post("/otp", userController.verifyOtp)

userRoute.get("/productdetailes",userController.getproductDetailes)

userRoute.get("/wishlist",authentic.isLogin,wishlistController.getWishlist)
userRoute.get("/addwish",authentic.isLogin,wishlistController.addToWishlist)

userRoute.get("/userprofile",authentic.isLogin,userController.getProfile)

userRoute.get("/address",authentic.isLogin,userController.getAddress)
userRoute.get("/createaddress",authentic.isLogin,userController.createAddress)
userRoute.post("/address",authentic.isLogin,userController.putAddress)

userRoute.get("/cart",authentic.isLogin,cartController.getCart)
userRoute.get("/addcart",authentic.isLogin,cartController.addCart)

userRoute.post("/qtyinc/:id",authentic.isLogin,cartController.quantityInc)
userRoute.post("/qtydec/:id",authentic.isLogin,cartController.quantityDec)
userRoute.post("/Itemdelete",authentic.isLogin,cartController.deleteCart)
module.exports = userRoute;