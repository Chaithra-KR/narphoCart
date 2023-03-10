const mongoose =  require("mongoose");
const user=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
    },
    mobile:{
        type:Number,
        required:true
    },

    password:{
        type:String,
        required:true
    },
    address:[
        {
            name:{
                type:String
            },
            phone:{
                type:Number
            },
        houseName:{
            type:String
        },
        city:{
            type:String
        },
        state:{
            type:String
        },
        pin:{
            type:Number
        },
        distrit:{
            type:String
        }
        }
    ],
    cart:{
            items: [{
                products:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Product"
                },
                quantity:{
                    type:Number,
                    default:0
                },
                price:{
                    type:Number,
                    default:0
                },
                date:{
                    type:Date,
                    default:Date.now
                },
                // cartstatus:{
                //     type:Boolean,
                //     default:true
                // }
                }],
                // totalprice:{
                //     type:Number
                // }
        },
    access:{
        type:Boolean,
        default:true
    },
    liststatus:{
        type:Boolean,
        default:true
    }

    
})
module.exports = mongoose.model("User",user)