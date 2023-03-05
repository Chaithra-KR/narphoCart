const Wishlist = require("../models/wishlist-model")
const User = require("../models/userModels")
const Product = require("../models/product-model");

//get wishlist
const getWishlist = async(req,res)=>{

    try {
        const userId =req.session.userid
        const userSession = userId;
        if(!userId){
            res.redirect("/login")
        }
        const userDatas = await User.findOne({_id:userId})
        const wishData = await Wishlist.findById(userId).populate('items.product')
        console.log(wishData,'wishlist datas');
        res.render("wishlist-page",{wishData,userSession,userDatas})
    } catch (error) {
        console.log(error.message);
    } 
    
}

// post wishlist
const addToWishlist = async (req, res) => {
    try {
      const productId = req.query.id;
      if (req.session.userid) {
        const productData = await Product.findById({ _id: productId });
        const userId = req.session.userid;
        const userDatas = await User.findById({ _id: userId });
  
        const existingWishItem = userDatas.items.find(
          (item) => item.product.toString() === productData._id.toString()
        );
  
        if (existingWishItem) {
          // Product already exists in wishlist
          res.redirect("/productdetailes"); 
        } else {
          // Product doesn't exist in wishlist
          const wishDatas = await User.updateOne(
            { _id: userId },
            { $push: { "items.product": { product: productData._id } } }
          ).then((data) => {
            res.redirect("/productdetailes");
          });
        }

      } else {
        res.redirect("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };



module.exports ={
    getWishlist,
    addToWishlist
}