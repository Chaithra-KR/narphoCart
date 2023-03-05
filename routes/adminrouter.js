const express=require("express")
const adminRoute=express()
const adminController=require("../controller/admincontroller")
const adminAuth=require("../middleware/adminauth")
const upload = require("../middleware/multer")
const { isLogin } = require("../middleware/authentic")

adminRoute.set("views","./views/admin");


adminRoute.get("/adminlogin",adminController.doLogin)
adminRoute.post("/adminlogin",adminController.verifyLogin)

adminRoute.get("/dashboard" ,adminController.getDashboard)
adminRoute.get("/usermanagement",adminAuth.isLogin,adminController.getUsermanagement)

adminRoute.post("/block/:id" ,adminAuth.isLogin,adminController.clickBlock)
adminRoute.post("/unblock/:id" ,adminAuth.isLogin,adminController.clickUnblock)

adminRoute.get("/category" ,adminAuth.isLogin,adminController.getCategory)
adminRoute.get("/addcategory",adminAuth.isLogin,adminController.getAddcategory)
adminRoute.post("/category",adminController.insertCategory)

adminRoute.get("/productmanagement",adminAuth.isLogin,adminController.getProduct)
adminRoute.get("/addproduct",adminAuth.isLogin,adminController.getAddproduct)
adminRoute.post("/productmanagement",upload.array("image",6),adminController.insertProduct)
adminRoute.post("/dropProduct/:id",adminController.deleteProduct)

adminRoute.get("/editproduct",adminAuth.isLogin,adminController.getEditproduct)
adminRoute.post("/editproduct",upload.array("image",6),adminController.doEditProduct)

adminRoute.get("/editcategory",adminAuth.isLogin,adminController.getEditcategory)
adminRoute.post("/editcategory",adminController.doEditcategory)
adminRoute.post("/dropCategory",adminController.deleteCategory)

adminRoute.post("/list/:id",adminAuth.isLogin,adminController.clicklist)
adminRoute.post("/unlist/:id",adminAuth.isLogin,adminController.clickUnlist)


adminRoute.get("/adminlogout",adminController.adminLogout)




module.exports=adminRoute