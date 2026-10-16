import { user } from "../models/user.model.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "All feilds are required"
            })
        }
        const existUser = await user.findOne({ email });
        if (existUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await user.create({
            name: name.trim,
            email: email.trim().lowercase(),
            phone: phone.trim(),
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                is_active: newUser.is_active,
                createdAt: newUser.createdAt,
            },
        });


    } catch (error) {
        console.error("create user error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}