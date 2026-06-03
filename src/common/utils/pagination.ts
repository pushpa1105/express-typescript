export interface PaginationQuery {
    page?: string;
    limit?: string;
    sort?: string;
    search?: string;
    [key: string]: any;
}

export const buildPagination = (query: PaginationQuery): Pagination => {
    const page = Math.max(parseInt(query.page || "1"), 1);
    const limit = Math.max(parseInt(query.limit || "10"), 1);

    const skip = (page - 1) * limit;

    const sort = query.sort
        ? query.sort.startsWith("-")
            ? { [query.sort.substring(1)]: -1 }
            : { [query.sort]: 1 }
        : { createdAt: -1 };

    return { page, limit, skip, sort };
};