import { ErrorCatcher } from "@/common/decorators/handleErrorCatcher";
import { PanaRepository } from "./panaRepository";
import { CreatePanaData, PanaData } from "./panaSchema";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { PanaDocument } from "./panaModel";
import { DocumentWithMetaData, Pagination } from "@/common/schema";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

export class PanaService {
    private panaRepository: PanaRepository

    constructor(repository = new PanaRepository()) {
        this.panaRepository = repository
    }

    @ErrorCatcher("PanaService.createPana")
    async createPana(panaData: CreatePanaData): Promise<ServiceResponse<PanaDocument | null>> {

        if (panaData?.parentId) {

            if (!mongoose.Types.ObjectId.isValid(panaData?.parentId)) {
                return ServiceResponse.failure('Invalid ID', null, StatusCodes.UNPROCESSABLE_ENTITY)
            }

            const existingPana = await this.panaRepository.findById(panaData.parentId);

            if (!existingPana) {
                return ServiceResponse.failure('Pana not found', null, StatusCodes.NOT_FOUND)
            }
        }

        const pana = await this.panaRepository.createOne(panaData);

        return ServiceResponse.success('Pana created successfully', pana)
    }

    @ErrorCatcher("PanaService.deletePanaById")
    async deletePanaById(panaId: string): Promise<ServiceResponse<any>> {
        const allDescendantIds = await this.panaRepository.getDescendantIds(panaId)

        await this.panaRepository.deleteManyByIds(allDescendantIds)

        return ServiceResponse.success('Pana deleted successfully', null)
    }

    @ErrorCatcher("PanaService.updatePanaById")
    async updatePanaById(panaId: string, panaData: Partial<PanaDocument>): Promise<ServiceResponse<any>> {

        const updatedPana = await this.panaRepository.updateById(panaId, panaData)

        return ServiceResponse.success('Pana updated successfully', updatedPana)
    }

    @ErrorCatcher("PanaService.getActiveWorkspacePanas")
    async getActiveWorkspacePanas({ pagination, workspaceId, parentId }: { pagination: Pagination, workspaceId: string, parentId?: string }): Promise<ServiceResponse<DocumentWithMetaData<PanaDocument[]> | null>> {
        const filters = {
            workspaceId,
            parentId,
        }

        if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
            return ServiceResponse.failure('Invalid ID', null, StatusCodes.UNPROCESSABLE_ENTITY)
        }

        const panas = await this.panaRepository.findWithPagination({
            pagination,
            filters
        })

        return ServiceResponse.success('Panas for active workspace fetched successfully', panas)
    }
}

export const panaService = new PanaService()
