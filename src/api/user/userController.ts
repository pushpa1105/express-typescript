import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/userService";
import { AuthRequest } from "@/common/middleware/auth";

class UserController {
	public getUsers: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await userService.findAll();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getUser: RequestHandler = async (req: Request, res: Response) => {
		const id = Number.parseInt(req.params.id as string, 10);
		const serviceResponse = await userService.findById(id);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public createUser: RequestHandler = async (req: Request, res: Response) => {
		const userData = req.body;
		const serviceResponse = await userService.createUser(userData);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	}

	public loginUser: RequestHandler = async (req: Request, res: Response) => {
		const loginData = req?.body;
		const serviceResponse = await userService.loginUser(loginData)
		res.status(serviceResponse.statusCode).send(serviceResponse)
	}

	public getCurrentUser: RequestHandler = async (req: AuthRequest, res: Response) => {
		const { userId } = req?.userData!;

		const serviceResponse = await userService.getCurrentUser(userId)
		res.status(serviceResponse.statusCode).send(serviceResponse)
	}
}

export const userController = new UserController();
