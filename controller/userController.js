const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Product = require("../models/product-model")

const securePassword = async (password) => {
    console.log("to convert password into bcrypt");
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.log(error.message);
    }
}


//node mailer
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,

    auth: {
        user: "narphocart@gmail.com",
        pass: "eyarkhwribmlsoml",
    },
});
var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);


//registration page started
const doRegister = async (req, res) => {
    console.log("register page existed");
    try {
        if (req.session.userid) {
            res.redirect("/")
        } else
            res.render("registration")
    } catch (error) {
        console.log(error.message);
    }
}


//otp page started

const getotp = async (req, res) => {
    try {
        if(req.session.otp){
        res.redirect("/otp")
        console.log("otp page existed");}
    } catch (error) {
        console.log(error.message);
    }

}


//otp validation started
const otpValidation = async (req, res) => {
    console.log(" to insert users data")
    try {
            req.session.name = req.body.name,
            req.session.email = req.body.email,
            req.session.mobile = req.body.mobile,
            req.session.password = req.body.password

        const checkUser = await User.findOne({ email: req.session.email })
        console.log(checkUser);
        if (!checkUser) {
            console.log("Email is valid. There where no another accounts");

            var mailFormat = {
                from: "narphocart@gmail.com",
                
                to: req.body.email,
                subject: "OTP for registration",
                html: "<h6> OTP for account verification is" + otp + "</h6>",
            }

            transporter.sendMail(mailFormat, (error, data) => {
                if (error) {
                    return console.log(error);
                } else {
                    res.render("otp");
                }
            })


        } else {
            res.render("registration", { errorMessage: "We are sorry,this email login is already exist. Try another email address to register." })
        }

path
    } catch (error) {
        console.log(error.message);
    }

}


//otp verification
const verifyOtp = async (req, res) => {
    try {
        if (req.body.otp == otp) {
            const securedPassword = await securePassword(req.session.password,10)
           
            const user = new User({
                name: req.session.name,
                email: req.session.email,
                mobile: req.session.mobile,
                password: securedPassword
            })  

            const userData = await user.save();
             console.log("user Data is successfully saved");
            if (userData) {
                console.log("Your regstration has been successfull");
                res.render("login", { successmessage: "Your regstration has been successfull" })
            } else {
                console.log("your registration has been failed");
                res.render("registration")
            }

        }else{
            res.render("otp",{message:"Incorrect password"})
            console.log(error.message);
        }
    } catch (error) {
        console.log(error.message);
    }
}


// home page 
const home = async(req, res) => {
    try {
        
        const productDatas = await Product.find({liststatus:true}).populate("category")
        console.log(productDatas);
        let userSession = req.session.userid;
        
            
        res.render('home', { userSession,productDatas })
       
    } catch (error) {
        console.log(error.message)
    }
}

//to render the product detailes page
const getproductDetailes = async(req,res)=>{
    try {
        const id = req.query.id;
        console.log(id,"id at product detailes");
            const productDatas = await Product.findById({_id:id}).populate("category")
            console.log(productDatas);
            let userSession = req.session.userid;
            res.render("product-detailes",{userSession,productDatas})
        
    } catch (error) {
        console.log(error.message);
    }
}


//login page started
const doLogin = async (req, res) => {
    console.log("user login page existed");
    try {
        if (req.session.userid) {
            res.redirect('/')
        } else {
            if (req.session.error) {
                let error = req.session.error
                req.session.error = null
                res.render("login", { message: error })
            } else {
                res.render('login')
            }
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

//login verification started
const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });
        console.log(userData);
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password)
            if (passwordMatch) {
                if (userData.access) {


                    console.log('user data: ', userData)
                    console.log("home page exist");
                    req.session.userid = userData._id;
                    res.redirect("/");
                } else {
                    req.session.error = 'This website has prevented you from browsing this url. For more information visit the help center.'
                    console.log("Your access is denied");
                    res.redirect("/login")
                }


            } else {
                req.session.error = 'email or password is incorrect'
                console.log("email or password is incorrect");
                res.redirect("/login")
            }
        } else {
            req.session.error = 'email or password is incorrect'
            console.log("email or password is incorrect");
            res.redirect("/login")
        }

    } catch (error) {
        console.log(error.message);
    }
}

//get User Profile
const getProfile = async(req,res)=>{
    try {
        const id = req.session.userid
        const userDatas = await User.findOne({_id:id})
        let userSession = id
        res.render("user-profile",{userDatas,userSession})
        console.log(userDatas,"this is user datas @profile");
    } catch (error) {
        console.log(error.message);
    }
}

//get address page
const getAddress = async(req,res)=>{
    try {
       const id = req.session.userid;
       let userSession = id
       const userDatas = await User.findOne({_id:id})
       res.render("address-page",{userDatas,userSession})
    } catch (error) {
        console.log(error.message);
    }
}

//create new address
const createAddress =async(req,res)=>{
    try {
        const id = req.session.userid;
        const userSession = id
        const userDatas = await User.findOne({_id:id})
        res.render("add-address",{userSession,userDatas})
    } catch (error) {
        console.log(error.message);
    }
}

//post addres page
const putAddress = async(req,res)=>{
    try {
      const id = req.session.userid
      const userData = User.findOne({_id:id})
      const addressDatas = {
         name:req.body.deliveryname,
         phone:req.body.phone,
         houseName : req.body.houseName,
         city : req.body.city,
         state : req.body.state,
         pin : req.body.pin,
         distrit : req.body.distrit
      }
     
      await User.updateOne({_id:id},{$push:{address:addressDatas}})
      res.redirect("/address")

    } catch (error) {
        console.log(error.message);
    }
}



//for user logout

const userLogout = async (req, res) => {
    try {
 
        req.session.userid="";
        res.redirect("/")
        console.log("session destroyed & home page exited");
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    home,
    doRegister,
    otpValidation,
    doLogin,
    verifyLogin,
    getotp,
    userLogout,
    verifyOtp,
    getproductDetailes,
    getProfile,
    getAddress,
    putAddress,
    createAddress
}
