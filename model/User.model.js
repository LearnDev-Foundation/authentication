import mongoose from "mongoose";

export const UserSchemma = new mongoose.Schema({
    username : {
        type: String,
        required : [true, "Please provide a Username"],
        unique : [true, "Username already exist"]
    },
    password : {
        type: String,
        required: [true, "Please input a password"],
        unique: false
    },
    email: {
        type: String,
        required: [true, "Please provide a unique email"],
        unique: [true, "Email already in use"]
    },
    firstName: { type: String },
    lastName: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    github: { type: String },
    profile: { type:String }
})

export default mongoose.model('User', UserSchemma);