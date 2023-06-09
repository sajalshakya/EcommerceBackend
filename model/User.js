const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email:  {
        type: String,
        required: true,
        unique:true
    },
    role: {
        type: String,
        enum: ["seller","buyer"],
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength:8,
        select:false
    }
});

module.exports = mongoose.model("User", UserSchema)