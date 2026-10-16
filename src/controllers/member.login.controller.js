import Member from "../models/member.model"
import bcrypt from "bcryptjs"

const userLogin = async (req, res) =>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "all fields are required"
            });
        }
        const member = await Member.findOne({
            email : email.toLowerCase().trim()
        }).select("+password");

        if (!member) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        const isMatch = await bcrypt.compare(
            password,
            member.password
        )
        if (!isMatch){
            return res.status(401).json({
                success : false,
                message : "Invalid email or password"
            })
        }
        return res.status(200).json({
            success : true,
            message : "Loggin successfull",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    }
    catch{
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
