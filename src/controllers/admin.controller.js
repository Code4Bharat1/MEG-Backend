import { admin } from "../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createAdmin = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Email, password, and role are required",
            });
        }
        const normalizedEmail = email.trim().toLowerCase();

        const existAdmin = await admin.findOne({
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

export const loginAdmin = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Email, Password, and role are required",
            });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedRole = role.trim().toLowerCase();

        const existAdmin = await admin.findOne({
            email: normalizedEmail,
            role: normalizedRole
        })
            .select("+password");


        if (!existAdmin) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            existAdmin.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }

        if (!existAdmin.is_active) {
            return res.status(403).json({
                success: false,
                message: "Admin Account is inactive",
            });
        }

        const token = jwt.sign({
            id: existAdmin._id.toString(),
            AccountType: "admin",
            role: existAdmin.role,
        },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d", }
        );
        return res.status(200).json({
            success: true,
            message: "Admin login successfull",
            token,
            data: {
                id: existAdmin._id,
                email: existAdmin.email,
                role: existAdmin.role,
                is_active: existAdmin.is_active,
            },
        });
    }
    catch (error) {
        console.error("Admin login failed:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};