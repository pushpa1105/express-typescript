import type { Request, RequestHandler, Response } from "express";
import { teamService } from "./teamService";

interface TeamRequest extends Request {
    userData?: {
        _id: string
    }
}

class TeamController {
    public createTeam: RequestHandler = async (req: TeamRequest, res: Response) => {
        const teamData = {
            ...req.body,
            ownerId: req?.userData?._id
        }
        const serviceResponse = await teamService.createTeam(teamData)

        res.status(serviceResponse.statusCode).send(serviceResponse)
    }
}

export const teamController = new TeamController();
