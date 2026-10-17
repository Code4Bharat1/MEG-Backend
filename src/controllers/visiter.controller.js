import bcrypt from "bcrypt";
import { visitor } from "../models/visitor.model.js";

export const createvisitor = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "All feilds are required"
            })
        }
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPhone = String(phone).trim();
        const existvisitor = await visitor.findOne({ $or: [{ email: normalizedEmail }, { phone: normalizedPhone }] });

        if (existvisitor) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newvisitor = await visitor.create({
            name: name.trim(),
            email: normalizedEmail,
            phone: normalizedPhone,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                id: newvisitor._id,
                name: newvisitor.name,
                email: newvisitor.email,
                phone: newvisitor.phone,
                is_active: newvisitor.is_active,
                createdAt: newvisitor.createdAt,
            },
        });


    } catch (error) {
        console.error("create visitor error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const visitorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All feilds are required",
            });
        }
       
        const visitor = await visitor.findOne({
            email: email.toLowerCase().trim()
        }).select("+password");
        
        if(!visitor) {
            return res.status(401).json({
                success : false,
                message : "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password , visitor.password);

        if(!isMatch){
            return res.status(401).json({
                success : false,
                message : "Invalid email or password"
            });
        }

        return res.status(200).json({
            success : true,
            message : "Login successfull",
            visitor: {
                id : visitor._id,
                name : visitor.name,
                email : visitor.email
            }
        })


    } catch (error) {
        console.error("visitor login error :" , error);

        return res.status(500).json({
            success : false,
            message : "Internal server error",
        });
    }
}