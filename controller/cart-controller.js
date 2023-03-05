const User = require("../models/userModels")
const Product = require("../models/product-model");
const { findById } = require("../models/adminModel");

// const getCart = async(req,res)=>{
//     try {
//         const userId =req.session.userid
//         const userSession = userId;
//         if(!userId){
//             res.redirect("/login")
//         }
//         const productId = req.query.id

//         const accessUserdata = await User.findById(userId).populate('cart.items.products').exec((error,data)=>{
//             if(error){
//                 console.log(error.message);
//             }else{
//                 if(data){
//                     console.log(accessUserdata,'uSSsssssssssssssssser');
//                     res.render("cart-management",{accessUserdata,userSession})
//                 }else{
//                     res.render("empty-cart",userSession)
//                 }
//             }
//         })
       
//     } catch (error) {
//         console.log(error.message);
//     }   
// }           

const getCart = async(req,res)=>{
    try {
        const userId =req.session.userid
        const userSession = userId;
        if(!userId){
            res.redirect("/login")
        }
        const accessUserdata = await User.findById(userId).populate('cart.items.products')
        console.log(accessUserdata,'uSSsssssssssssssssser');
        console.log(accessUserdata.cart.items,  "helloo this is cart");
        res.render("cart-management",{accessUserdata,userSession})
    } catch (error) {
        console.log(error.message);
    }   
}   

const addCart = async (req, res) => {
    try {
      const productId = req.query.id;
      if (req.session.userid) {
        const productData = await Product.findById({ _id: productId });
        const userId = req.session.userid;
        const userDatas = await User.findById({ _id: userId });
  
        const existingCartItem = userDatas.cart.items.find(
          (item) => item.products.toString() === productData._id.toString()
        );
  
        if (existingCartItem) {
          // Product already exists in cart
          res.redirect("/productdetailes");//dont forget to create go to cart 
        } else {
          // Product doesn't exist in cart
          const cartDatas = await User.updateOne(
            { _id: userId },
            { $push: { "cart.items": { products: productData._id, quantity: 1 } } }
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
  


// const addCart = async(req,res)=>{
//     try {
        
//       const productId = req.query.id
//       if(req.session.userid){
//         const productData = await Product.findById({_id:productId})
//         const userId = req.session.userid;
//         const userDatas = await User.findById({_id:userId});
//         const cartDatas = await await User.updateOne({_id:userId},{$push:{"cart.items":{products:productData._id,quantity:1}}}).then((data)=>{
//             res.redirect("/productdetailes")
//         })
//       }else{
//         res.redirect("/login")
//       }
//     } catch (error) {
//         console.log(error.message);
//     }

// }
const quantityInc = async(req,res)=>{
    try {
        const userId = req.session.userid
        const qtyId = req.params.id
        const itemId = await User.findOne({_id:userId,"cart.items._id":qtyId})
        await User.updateOne({_id:userId,"cart.items._id":qtyId},{$inc:{"cart.items.$.quantity":1}})
        .then((data)=>{res.redirect('/cart')})
        console.log(itemId,"this is itemid");
    } catch (error) {
        console.log(error.message);
    }
}

const quantityDec = async(req,res)=>{
    try {
        const userId = req.session.userid
        const qtyId = req.params.id
        const itemId = await User.findOne({_id:userId,"cart.items._id":qtyId})
        await User.updateOne({_id:userId,"cart.items._id":qtyId},{$inc:{"cart.items.$.quantity":-1}})
        .then((data)=>{res.redirect('/cart')})
        console.log(itemId,"this is itemid");
    } catch (error) {
        console.log(error.message);
    }
}



const deleteCart = async(req,res)=>{
    try {
      const userId = req.session.userid
      const id = req.query.id
      const productData = await Product.findById({_id:id})
      const userDatas = await User.findById({_id:userId});
      const dropcartDatas = await User.updateOne(
        { _id: userId },
        { $pull: { "cart.items": { _id: productData._id, quantity: 1 } } }
      ).then((data) => {
        res.redirect("/productdetailes");
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  

module.exports={
    getCart,
    addCart,
    quantityInc,
    quantityDec,
    deleteCart
}