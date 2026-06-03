import { DocumentWithMetaData, MetaData, WithPagination } from "@/common/schema";
import { WorkspaceDocument, WorkspaceModel } from "./workspaceModel";
import { CreateWorkspaceData } from "./workspaceSchema";

export class WorkspaceRepository {
    async createWorkspace(workspaceData: CreateWorkspaceData & {
        ownerId: string;
        teamId?: string;
    }): Promise<WorkspaceDocument | null> {
        return await WorkspaceModel.insertOne(workspaceData)
    }

    async findById(id: string): Promise<WorkspaceDocument | null> {
        return await WorkspaceModel.findById(id)
    }

    async findByNameAndScope({
        name,
        ownerId,
        teamId,
    }: {
        name: string,
        ownerId?: string;
        teamId?: string;
    }): Promise<WorkspaceDocument | null> {
        return await WorkspaceModel.findOne({
            name,
            ...(ownerId && { ownerId }),
            ...(teamId && { teamId })
        })
    }

    async findWithPagination({
        pagination,
        filters
    }: WithPagination): Promise<DocumentWithMetaData<WorkspaceDocument[]>> {
        const { skip, limit, sort } = pagination

        const query = { ...filters }

        const [data, total] = await Promise.all([
            WorkspaceModel.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit),
            WorkspaceModel.countDocuments(query)
        ])

        return {
            data,
            meta: {
                total,
                page: pagination?.page || 1,
                limit: limit || 10,
                totalPages: Math.ceil(total / limit)
            }
        }
    }
}