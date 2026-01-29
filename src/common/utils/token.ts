import jwt from 'jsonwebtoken';
import { env } from '@/common/utils/envConfig';
import { SafeUser } from '@/api/user/userModel';
import crypto from 'crypto';
import type { Response } from "express";

export const hashToken = (token: string): string => crypto.createHash('sha256').update(token).digest('hex')
export const createJti = (): string => crypto.randomBytes(16).toString('hex')

export const generateAuthToken = (user: Partial<SafeUser>, jti: string): string => {
    const { _id, role } = user
    const payload = {
        user: {
            _id,
            role
        },
        jti
    }

    return jwt.sign(payload, env.AUTH_SECRET, { expiresIn: env.AUTH_EXPIRY as any });
}

export const generateRefreshToken = (user: Partial<SafeUser>, jti: string): string => {
    const { _id, role } = user
    const payload = {
        user: {
            _id,
            role
        },
        jti
    }

    return jwt.sign(payload, env.REFRESH_SECRET, { expiresIn: env.REFRESH_EXPIRY as any });
}

export const attachAuthCookies = (res: Response, payload: Partial<SafeUser>) => {
    const jti = createJti();
    const authToken = generateAuthToken(payload, jti);
    const refreshToken = generateRefreshToken(payload, jti);

    res.cookie("authToken", authToken, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 1000,  // in milliseconds
        sameSite: "none",
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 7 * 1000,  // in milliseconds
        sameSite: "none",
    });
}