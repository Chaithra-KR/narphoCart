const  mongoose= require("mongoose")
const wishlistSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    items:[{
        product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
                },
           
        date:{
                type:Date,
                default:Date.now
                }
           }]
})

module.exports = mongoose.model("Wishlist",wishlistSchema)