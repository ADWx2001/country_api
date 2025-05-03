import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true,
        unique:true
    },

    firstName:{
        type:String,
        required:true,
    },

    lastName:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true,
    },

    mobile:{
        type:String,
        unique:true
    },

    isAdmin:{
        type:Boolean,
        default:false
    },

    profilePicture:{
        type:String,
        default:"https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },


},{timestamps:true})

const User = mongoose.model('User',userSchema);
export default User;