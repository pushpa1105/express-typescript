import jwt from 'jsonwebtoken';
import { env } from '@/common/utils/envConfig';
import { SafeUser } from '@/api/user/userModel';
import crypto from 'crypto';

export const hashToken = (token: string): string => crypto.createHash('sha256').update(token).digest('hex')
export const createJti = (): string => crypto.randomBytes(16).toString('hex')

export const generateAuthToken = (user: SafeUser, jti: string): string => {
    const payload = {
        userId: user?._id,
        jti
    }

    return jwt.sign(payload, env.AUTH_SECRET, { expiresIn: env.AUTH_EXPIRY as any });

}
