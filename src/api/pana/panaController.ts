import { AuthRequest } from "@/common/middleware/auth";
import { RequestHandler, Response } from "express";
import { panaService } from "./panaService";
import { buildPagination } from "@/common/utils/pagination";
import { StatusCodes } from "http-status-codes";

export class PanaController {
    public createPana: RequestHandler = async (req: AuthRequest, res: Response) => {
        const { title } = req.body || {}
        const { activeWorkspace } = req.userData || {}
        const { parentId }: { parentId?: string } = req.query || {}

        const panaData = {
            title,
            workspaceId: activeWorkspace!,
            parentId,
        }

        const serviceResponse = await panaService.createPana(panaData)

        res.status(serviceResponse.statusCode).send(serviceResponse)
    }

    public deletePanaById: RequestHandler = async (req: AuthRequest, res: Response) => {
        const serviceResponse = await panaService.deletePanaById(req.params.id)
        res.status(serviceResponse.statusCode).send(serviceResponse)
    }

    public getActiveWorkspacePanas: RequestHandler = async (req: AuthRequest, res: Response) => {
        const { activeWorkspace, _id } = req.userData || {}

        console.log('UIIIIIII', req.userData)
        const pagination = buildPagination(req.query)

        if (!activeWorkspace) return res.status(StatusCodes.NOT_FOUND).send({ message: 'User does not have active workspace' })

        const serviceResponse = await panaService.getActiveWorkspacePanas({
            pagination,
            workspaceId: activeWorkspace
        })

        res.status(serviceResponse.statusCode).send(serviceResponse)
    }
}

export const panaController = new PanaController()
