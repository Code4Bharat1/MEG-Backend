import { visitor, visitor } from "../models/visitor.model.js";
import bcrypt from "bcrypt";

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
            })
        }
        const visitor = await visitor.findOne({
            email: email.toLowerCase().trim()
        }).select("+password");

    } catch (error) {

    }
}