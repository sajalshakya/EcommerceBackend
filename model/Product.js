const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProductSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        min:0,
        default:0
    },
    description:{
        type: String,
        maxLength: 255
    },
    in_stock:{
        type: Number,
        min:0,
        default:0
    },
    images:{
        type:[String]
    },
    categories:[String],
    brands:[String],
    created_by:{
        type: ObjectId,
        ref: "User",
        required:true,
    }
});

module.exports = mongoose.model("Product", ProductSchema)