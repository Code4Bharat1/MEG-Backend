import { visiter } from "../models/visiter.model.js";
import bcrypt from "bcrypt";

export const createVisiter = async (req, res) => {
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
        const existVisiter = await visiter.findOne({ $or: [{ email: normalizedEmail }, { phone: normalizedPhone }] });

        if (existVisiter) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newVisiter = await visiter.create({
            name: name.trim(),
            email: normalizedEmail,
            phone: normalizedPhone,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                id: newVisiter._id,
                name: newVisiter.name,
                email: newVisiter.email,
                phone: newVisiter.phone,
                is_active: newVisiter.is_active,
                createdAt: newVisiter.createdAt,
            },
        });


    } catch (error) {
        console.error("create visiter error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}