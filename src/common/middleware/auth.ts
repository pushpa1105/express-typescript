import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "@/common/utils/envConfig";

export interface JwtUserData extends JwtPayload {
    email: string;
    userId: number;
    role?: string;
}

export interface AuthRequest extends Request {
    userData?: JwtPayload & {
        email: string;
        userId: number;
        role?: string;
    }
};

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req?.headers?.authorization

        if (!authHeader || !authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authentication Failed" })
        }
        const token = authHeader?.replace("Bearer ", "")
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtUserData;

        req.userData = decoded
        next()
    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(401).json({ message: "Authentication Failed" })
    }
} 
