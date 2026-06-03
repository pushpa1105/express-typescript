import type { Request, RequestHandler, Response } from "express";
import { userService } from "@/api/user/userService";
import { AuthRequest } from "@/common/middleware/auth";

class UserController {

	public getUsers: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await userService.findAll();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getUser: RequestHandler = async (req: Request, res: Response) => {
		const id = req.params.id
		const serviceResponse = await userService.findById(id);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public setActiveWorkspace: RequestHandler = async (req: AuthRequest, res: Response) => {
		const payload = req.body;
		const userData = req.userData;

		const serviceResponse = await userService.setActiveWorkspace(userData?._id!, payload?.workspaceId!)

		res.status(serviceResponse.statusCode).send(serviceResponse)
	}
}

export const userController = new UserController();
