import { ServiceResponse } from "@/common/models/serviceResponse";
import { WorkspaceRepository } from "./workspaceRepository";
import { CreateWorkspaceData, GetMyWorkspace } from "./workspaceSchema";
import { WORKSPACE_TYPES, WorkspaceDocument } from "./workspaceModel";
import { StatusCodes } from "http-status-codes";
import { ErrorCatcher } from "@/common/decorators/handleErrorCatcher";
import { SafeUser } from "../user/userModel";
import { DocumentWithMetaData } from "@/common/schema";
import { userService } from "../user/userService";

export class WorkspaceService {
    private workspaceRepository: WorkspaceRepository

    constructor(repository: WorkspaceRepository = new WorkspaceRepository()) {
        this.workspaceRepository = repository
    }

    @ErrorCatcher("WorkspaceService.getWorkspaceById")
    async getWorkspaceById(workspaceId: string): Promise<ServiceResponse<WorkspaceDocument | null>> {
        const workspace = await this.workspaceRepository.findById(workspaceId)

        return ServiceResponse.success('Workspace fetched successfully', workspace)
    }

    @ErrorCatcher("WorkspaceService.createWorkspace")
    async createWorkspace(workspaceData: CreateWorkspaceData & {
        ownerId: string;
        teamId?: string;
    }): Promise<ServiceResponse<WorkspaceDocument | null>> {
        const { name, ownerId, teamId } = workspaceData
        const checkWorkspace = await this.workspaceRepository.findByNameAndScope({
            name,
            ownerId,
            teamId
        })

        if (checkWorkspace) {
            return ServiceResponse.failure(`Workspace with name "${name}" already exists.`, null, StatusCodes.CONFLICT)
        }

        const workspace = await this.workspaceRepository.createWorkspace(workspaceData);

        await userService.setActiveWorkspace(ownerId, workspace?.id!)

        return ServiceResponse.success('Workspace created successfully', workspace)
    }

    @ErrorCatcher("WorkspaceService.createDefaultWorkspace")
    async createDefaultWorkspace(user: Partial<SafeUser>): Promise<ServiceResponse<WorkspaceDocument | null>> {
        const { _id, name } = user

        const workspaceData = {
            name: `${name}'s Workspace`,
            ownerId: _id as string,
            type: WORKSPACE_TYPES.PERSONAL
        }


        const workspace = await this.workspaceRepository.createWorkspace(workspaceData);

        return ServiceResponse.success('Workspace created successfully', workspace)
    }

    @ErrorCatcher("WorkspaceService.getMyWorkspaces")
    async getMyWorkspaces({ pagination, userId }: GetMyWorkspace): Promise<ServiceResponse<DocumentWithMetaData<WorkspaceDocument[]>>> {

        const filters = {
            ownerId: userId
        }

        const workspaces = await this.workspaceRepository.findWithPagination({
            pagination,
            filters
        })

        return ServiceResponse.success('Workspace fetched successfully', workspaces)
    }
}

export const workspaceService = new WorkspaceService()
