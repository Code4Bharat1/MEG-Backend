import { admin } from "../models/admin.model.js";
import bcrypt from "bcrypt";

export const createAdmin = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required",
            });
        }
        const normalizedEmail = email.trim().toLowerCase();

        const existAdmin = await admin.findone({
            email: normalizedEmail,
        });
        if (existAdmin) {
            return res.status(409).json({
                success: false,
                message: "Admin already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await admin.create({
            email: normalizedEmail,
            password: hashedPassword,
            role: role.trim().toLowerCase(),
        });
        return res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: {
                id: newAdmin._id,
                email: newAdmin.email,
                is_active: newAdmin.is_active,
                createdAt: newAdmin.createdAt,
            },
        });
    }
    catch (error) {
        console.error("Admin creation failed:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};