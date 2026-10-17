import { Member } from "../models/member.model.js"
import bcrypt from "bcryptjs"


export const memberLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            });
        }
        const member = await Member.findOne({
            email: email.toLowerCase().trim()
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
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }
        return res.status(200).json({
            success : true,
            message : "Loggin successfull",
            member: {
                id: member._id,
                name: member.name,
                email: member.email
            }
        })
    }
    catch (error){
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const memberResgister = async (req, res) => {
    try {
        const { name, email, phone, password, bni_id, bni_certificate } = req.body;
        if (!email || !password || !phone || !name || !bni_id || !bni_certificate) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPhone = String(phone).trim();
        const existMember = await Member.findOne({ $or: [{ email: normalizedEmail }, { phone: normalizedPhone }] });

        if (existMember) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newMember = await Member.create({
            name: name.trim(),
            email: normalizedEmail,
            phone: normalizedPhone,
            password: hashedPassword,
            bni_id : bni_id.trim(),
            bni_certificate : bni_certificate,
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                id: newMember._id,
                name: newMember.name,
                email: newMember.email,
                phone: newMember.phone,
                bni_id: newMember.bni_id,
                bni_certificate: newMember.bni_certificate,
                is_active: newMember.is_active,
                createdAt: newMember.createdAt,
            },
        });
    } catch (error) {
        console.error("create member error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

