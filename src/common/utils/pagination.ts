import { Pagination, PaginationQuery } from "../schema";

export const buildPagination = (query: PaginationQuery): Pagination => {
    const page = Math.max(parseInt(query.page || "1"), 1);
    const limit = Math.max(parseInt(query.limit || "10"), 1);

    const skip = (page - 1) * limit;

    const sort: Record<string, any> | undefined = { createdAt: -1 }

    if (query?.sort) {

        query.sort.split(",").forEach((qs) => {
            const key = qs.trim()
            const isDesc = key.startsWith("-")

            sort[isDesc ? key.substring(1) : key] = isDesc ? -1 : 1
        })

    }
    return { page, limit, skip, sort };
};