import { DeleteResult, Types } from "mongoose";
import { PanaDocument, PanaModel } from "./panaModel";
import { DocumentWithMetaData, WithPagination } from "@/common/schema";
import { BaseRepository } from "@/common/repository/baseRepository";
import { AsyncLocalStorageCurrentUser } from "@/common/context/requestContext";

export class PanaRepository extends BaseRepository<PanaDocument> {

    constructor(model = PanaModel, currentUser = new AsyncLocalStorageCurrentUser()) {
        super(model, currentUser)
    }

    async getDescendantIds(id: string): Promise<[string]> {
        const result = await this.model.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(id),
                },
            },
            {
                $graphLookup: {
                    from: "panas",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "parentId",
                    as: "descendants",
                },
            },
            {
                $project: {
                    allIds: {
                        $concatArrays: [
                            ["$_id"],
                            {
                                $map: {
                                    input: "$descendants",
                                    as: "d",
                                    in: "$$d._id",
                                },
                            },
                        ],
                    },
                },
            },
        ]);

        return result?.[0]?.allIds ?? [];
    }

    async findWithPagination({
        pagination,
        filters
    }: WithPagination): Promise<DocumentWithMetaData<PanaDocument[]>> {
        const { skip, limit, sort } = pagination

        const query = { ...filters }

        const [data, total] = await Promise.all([
            this.model.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit),
            this.model.countDocuments(query)
        ])


        return {
            data,
            meta: {
                total,
                page: pagination?.page ?? 1,
                limit: limit ?? 10,
                totalPages: Math.ceil(total / limit)
            }
        }
    }
}
