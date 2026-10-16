import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
       email:{
        type : String,
        required : true,
        unique : true,
        lowercase : true,
       },
       password:{
        type : String,
        required :true,
        select : false,
       },
       refresh_token : {
        type : String,
        default : null,
        select : false,
       },
       is_active: {
        type : Boolean,
        default : true,
       }
},{timestamps: true})

export const admin = mongoose.model("admin", adminSchema);