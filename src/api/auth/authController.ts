import { AuthRequest } from "@/common/middleware/auth";
import type { RequestHandler, Response, Request } from "express";
import { authService } from "@/api/auth/authService";
import { CreateUserData } from "../user/userSchema";
import { SafeUser } from "../user/userModel";
import { createJti, generateAuthToken } from "@/common/utils/token";

class AuthController {
    public getCurrentUser: RequestHandler = async (req: AuthRequest, res: Response) => {
        const { userId } = req?.userData!;

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


        const jti = createJti();
        const authToken = generateAuthToken(user, jti);

        res.cookie("authToken", authToken, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24 * 7 * 1000,  // in milliseconds
            sameSite: "none",
        });

        res.status(serviceResponse.statusCode).send(serviceResponse)
    }
}

export const authController = new AuthController()