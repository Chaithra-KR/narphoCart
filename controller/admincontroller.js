const Admin = require("../models/adminModel")
const User = require("../models/userModels")
const Category = require("../models/category-model");
const Product = require("../models/product-model")
const { render } = require("../routes/userRouter");
const { model, models } = require("mongoose");


// admin's login startted
const doLogin = async (req, res) => {
    console.log("admin login page is existed");
    try {
        if (req.session.adminId) {
            res.redirect("/admin/dashboard")
        } else {
            if (req.session.error) {
                let error = req.session.error;
                req.session.error = null;
                res.render("adminlogin", { message: error })
            } else {
                res.render("adminlogin")
            }
        }


    } catch (error) {
        console.log(error.message);
    }
}

//admin's login verification

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const adminData = await Admin.findOne({ email: email })
        console.log(adminData);
        if (adminData) {
            if (password === adminData.password) {
                req.session.adminId = adminData._id;
                res.redirect("/admin/dashboard")
            } else {
                req.session.error = "email or password is incorrect"
                res.redirect("/admin/adminlogin")
            }
        } else {
            req.session.error = "email or password is incorrect"
            res.redirect("/admin/adminlogin")
        }
    } catch (error) {
        console.log(error.message);
    }
}


const getDashboard = async (req, res) => {
    try {
        let adminSession = req.session.adminId
        res.render("dashboard", { adminSession })
    } catch (error) {
        console.log(error.message);
    }
}


const getUsermanagement = async (req, res) => {
    try {
        const userDatas = await User.find()
        res.render("user-management", { userDatas })
    } catch (error) {
        console.log(error.message);
    }
}


// to block user

const clickBlock = async (req, res) => {
    try {
        const id = req.params.id;
        const notAccess = await User.updateOne({ _id: id }, { $set: { access: false } })
        if (notAccess) {
            res.redirect("/admin/usermanagement")
        } else {
            console.log(error.message);
        }
    } catch (error) {
        console.log(error.message);
    }
}

//to unblock user

const clickUnblock = async (req, res) => {
    try {
        const id = req.params.id;
        const access = await User.updateOne({ _id: id }, { $set: { access: true } })
        if (access) {
            res.redirect("/admin/usermanagement")
        } else {
            console.log(error.message);
        }
    } catch (error) {
        console.log(error.message);
    }
}

// get category management
const getCategory = async (req, res) => {
    try {
        const categoryDatas = await Category.find()
        console.log(categoryDatas);
        res.render("category-management", { categoryDatas })
    } catch (error) {
        console.log(error.message);
    }
}



const getAddcategory = async (req, res) => {
    try {
        const categoryname = req.body.categoryname
        const description = req.body.description
        res.render("add-category")
    } catch (error) {
        console.log(error.message);
    }
}

const insertCategory = async (req, res) => {
    try {
        const category = new Category({
            categoryname: req.body.categoryname,
            description: req.body.description,

        })

        const checkCategory = await Category.findOne({ categoryname: req.body.categoryname })
        if (checkCategory) {
            res.render("add-category", { errormessage: "Sorry, this category is already exists !" })
        } else {
            const categoryData = await category.save();

            res.redirect("/admin/category")
            console.log("The new category is added successfully");

        }
    } catch (error) {
        console.log(error.message);
    }
}

//get edit product detailes
const getEditcategory = async (req, res) => {
    try {
        const id = req.query.id
        console.log(id,"here the id @ getEditcategory");
        const categoryDatas =await Category.findOne({_id:id})
        console.log(categoryDatas,"here the category datas");
        res.render("edit-category", {categoryDatas })
    } catch (error) {
        console.log(error.message);
    }
}

//post edit product detailes
const doEditcategory = async (req, res) => {
    try {
       
        const id = req.query.id;
        console.log(id,'here the id @ doEditcategory');
        const categoryname = req.body.categoryname;
        const description = req.body.description;
        const 
        categoryDatas = await Category.findOne({ categoryname: req.body.categoryname })
        if (
            categoryDatas) {
            res.render("edit-category", {categoryDatas, errormessage: "Sorry, this category is already exists !" })
        }else{
        const editDetailes = await Category.updateOne({ _id: id },{ $set: {
            description: description,
            categoryname: categoryname
        }})
        res.redirect("/admin/category")
    }
    } catch (error) {
        console.log(error.message);
    }
}

//to delete product
const deleteCategory = async(req,res)=>{
    try {
        const id = req.query.id
        const dropData = await product.findByIdAndUpdate({_id:id},{$set:{isDelete:true}})
        res.redirect('/admin/category')   
    } catch (error) {
        console.log(error.message);
    }

}

//get product management
const getProduct = async (req, res) => {
    try {
        const productDatas = await Product.find({isDelete:false}).populate("category")
        console.log(productDatas[0], "populated");
        res.render("product-management", { productDatas })
    } catch (error) {
        console.log(error.message);
    }
}

//get add product
const getAddproduct = async (req, res) => {
    try {
        const categoryDatas = await Category.find()
        console.log(categoryDatas);
        res.render("add-product", { categoryDatas })
    } catch (error) {
        console.log(error.message);
    }
}


// actual product management
const insertProduct = async (req, res) => {
    try {
        const name = req.body.name;
        const productDetail = await Product.findOne( {name:{$regex:'.*'+name+'.*',$options:'i'}} )
        if (productDetail) {

            if(productDetail.isDelete ){
            
                await Product.findOneAndUpdate({name:name},{$set:{isDelete:false}})
                res.redirect('/admin/productmanagement')
            }else{
                res.redirect('/admin/productmanagement')
            }  
        }else{
           
        let files = []
        const imageUpload = await (function () {
            for (let i = 0; i < req.files.length; i++) {
                files[i] = req.files[i].filename
            }
            return files;
        })()

        const product = new Product({
            product: req.body.product,
            category: req.body.categoryName,
            image: imageUpload,
            description: req.body.description,
            stock: req.body.stock,
            status: req.body.status,
            price: req.body.price
        })

        const checkProduct = await Product.findOne({ product: req.body.product })
        if (checkProduct) {
            res.redirect("/admin/productmanagement")
            console.log("Sorry this product is already exists");
        } else {
            const productData = await product.save();
            res.redirect("/admin/productmanagement")
            console.log("The new product is uploaded successfully");
        }}
    } catch (error) {
        console.log(error.message);
    }
}

// actual product management
// const insertProduct = async (req, res) => {
//     try {
//         const product = new Product({
//             product: req.body.product,
//             category: req.body.categoryName,
//             image: req.file.filename,
//             description: req.body.description,
//             stock: req.body.stock,
//             status: req.body.status,
//             price: req.body.price
//         })

//         const checkProduct = await Product.findOne({ product: req.body.product })
//         if (checkProduct) {
//             res.redirect("/admin/productmanagement")
//             console.log("Sorry this product is already exists");
//         } else {
//             const productData = await product.save();
//             res.redirect("/admin/productmanagement")
//             console.log("The new product is uploaded successfully");
//         }
//     } catch (error) {
//         console.log(error.message);
//     }
// }

//get edit product detailes
const getEditproduct = async (req, res) => {
    try {
        const id = req.query.id
        console.log(id,"first id");
        const productDatas = await Product.findOne({ _id: id }).populate("category")
        const categoryDatas =await Category.find()
        console.log(productDatas);
        console.log(categoryDatas,"yyyyyy");
        res.render("edit-product", { productDatas,categoryDatas })
    } catch (error) {
        console.log(error.message);
    }
}

//post edit product detailes
const doEditProduct = async (req, res) => {
    try {
       
        let files = []
        const imageUpload = await (function () {
            for (let i = 0; i < req.files.length; i++) {
                files[i] = req.files[i].filename
            }
            return files;
        })()

        const id = req.query.id;
        console.log(id,'idddddddddd');
        const product = req.body.product;
        const description = req.body.description;
        const image = imageUpload;
        const categoryname = req.body.categoryName;
        const price = req.body.price;
        const status = req.body.status;
        const stock = req.body.stock;
        const editDetailes = await Product.updateOne({ _id: id },{ $set: {
            product: product,
            description: description,
            image: image,
            categoryname: categoryname,
            price: price,
            status: status,
            stock: stock
        }
        })
        res.redirect("/admin/productmanagement")
    } catch (error) {
        console.log(error.message);
    }
}


const clicklist = async (req, res) => {
    try {
        const id = req.params.id;
        const notlisting = await Product.updateOne({ _id: id }, { $set: { liststatus: false } })
        if (notlisting) {
            res.redirect("/admin/productmanagement")
        } else {
            console.log(error.message);
        }
    } catch (error) {
        console.log(error.message);
    }
}

//to unblock user

const clickUnlist = async (req, res) => {
    try {
        const id = req.params.id;
        const listing = await Product.updateOne({ _id: id }, { $set: { liststatus: true } })
        if (listing) {
            res.redirect("/admin/productmanagement")
        } else {
            console.log(error.message);
        }
    } catch (error) {
        console.log(error.message);
    }
}

//to delete product
const deleteProduct = async(req,res)=>{
    try {
        const id = req.params.id;
        console.log("id   ----------------params id:",id);
        const dropData = await Product.findByIdAndUpdate({_id:id},{$set:{isDelete:true}});
        dropData.save().then(() => {
            res.json("success");
          });  
    } catch (error) {
        console.log(error.message);
    }

}

//to logout dashboard
const adminLogout = async (req, res) => {
    try {
        req.session.destroy()
        res.redirect("/admin/adminlogin")
        console.log("session destroyed & dashboard page exited");
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {

    doLogin,
    verifyLogin,
    getDashboard,
    getUsermanagement,
    clickBlock,
    clickUnblock,
    adminLogout,
    getCategory,
    getAddcategory,
    insertCategory,
    getProduct,
    getAddproduct,
    insertProduct,
    getEditproduct,
    doEditProduct,
    doEditcategory,
    getEditcategory,
    clicklist,
    clickUnlist,
    deleteProduct,
    deleteCategory

}