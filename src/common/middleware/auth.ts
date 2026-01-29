import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "@/common/utils/envConfig";

export interface JwtUserData extends JwtPayload {
    user: {
        _id: string,
        role?: string
    }
}

export interface AuthRequest extends Request {
    userData?: JwtPayload & {
        _id: string,
        role?: string
    }
};

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authToken = req?.cookies['authToken']

        if (!authToken) {
            return res.status(401).json({ message: "Authentication Failed" })
        }
        const decoded = jwt.verify(authToken, env.AUTH_SECRET) as JwtUserData;

        req.userData = decoded?.user
        next()
    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(401).json({ message: "Authentication Failed" })
    }
} 
