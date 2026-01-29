import { AuthRequest, JwtUserData } from "@/common/middleware/auth";
import type { RequestHandler, Response, Request } from "express";
import { authService } from "@/api/auth/authService";
import { CreateUserData } from "../user/userSchema";
import { SafeUser } from "../user/userModel";
import { attachAuthCookies, createJti, generateAuthToken, generateRefreshToken } from "@/common/utils/token";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "@/common/utils/envConfig";
import { ErrorCatcher } from "@/common/decorators/handleErrorCatcher";

class AuthController {
    public getCurrentUser: RequestHandler = async (req: AuthRequest, res: Response) => {
        const { _id: userId } = req?.userData!;

        const serviceResponse = await authService.getAuthenticatedUser(userId)
        res.status(serviceResponse.statusCode).send(serviceResponse)
    }

    public createUser: RequestHandler = async (req: Request, res: Response) => {
        const userData = req.body;
        const serviceResponse = await authService.createUser(userData);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }


    public login: RequestHandler = async (req: Request, res: Response) => {
        const loginData = req?.body;
        const serviceResponse = await authService.login(loginData)

        if (!serviceResponse?.data) {
            return res.status(serviceResponse.statusCode).send(serviceResponse)
        }

        const user = serviceResponse.data?.user as SafeUser;
        attachAuthCookies(res, user)

        res.status(serviceResponse.statusCode).send(serviceResponse)
    }

    public refresh: RequestHandler = async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            return res.status(StatusCodes.UNAUTHORIZED).send('Not Authorized.')
        }

        try {
            const payload = jwt.verify(refreshToken, env.REFRESH_SECRET) as JwtUserData
            attachAuthCookies(res, payload as Partial<SafeUser>)
            return res.status(StatusCodes.OK).send('Cookie Refreshed.')
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Internal Server Error.')
        }
    }
}

export const authController = new AuthController()