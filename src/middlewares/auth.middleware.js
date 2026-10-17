import jwt from "jsonwebtoken";

import { visitor } from "../models/visitor.model.js";
import { admin } from "../models/admin.model.js";
import { member } from "../models/member.model.js";


export const verify = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied .Please log in.",
            });

        }
        const token = authHeader.split(" ")[1];

        const decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const model = {
            visitor, member, admin,
        };
        const AccountType = decode.AccountType;
        const Accountmodel = model[AccountType];

        if (!Accountmodel || !decode.id) {
            return res.status(401).json({
                success: false,
                message: "Invaqlid Authentication token",
            });
        }


        const account = await Accountmodel.findById(decode.id)
            .select("-password -refresh_token");

        if (!account) {
            return res.status(401).json({
                success: false,
                message: "Account Not Found."
            });
        }

        if (!account.is_active) {
            return res.status(403).json({
                success: false,
                message: "Account is Inactive"
            })
        }
        req.user = account;
        req.AccountType = AccountType;

        next();
    }
    catch (error) {
        if (
            error.name === 'TokenExpiredError' ||
            error.name === 'JsonWebTokenError'
        ) {
            return res.status(401).json({
                success: false,
                message: "Token Expired or Invalid",
            })
        }
        console.log("Authentication Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during authentication",
            error: error.message,
        })


    }
};