import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
       name:{
        type : String,
        required: true,
        trim : true,
        minlength : 2,
        maxlength : 30,
       },
       email:{
        type : String,
        required : true,
        unique : true,
        lowercase : true,
       },
       phone:{
        type : String,
        required : true,
        trim : true,
       },
       password:{
        type : String,
        required :true,
        select : false,
       },
       bni_id : {
        type : String,
        required : true,
       },
       bni_certificate : {
        type : String,
        required : true,
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

export const member = mongoose.model("member", memberSchema)