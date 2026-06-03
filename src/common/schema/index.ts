import z from "zod";

export const PaginationSchema = z.object({
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive(),
    sort: z.record(z.any()).optional(),
    skip: z.number().int().min(0),
}).catchall(z.any());

export type Pagination = z.infer<typeof PaginationSchema>;

export const WithPaginationSchema = z.object({
    pagination: PaginationSchema,
    filters: z.object({}).optional()
})

export type WithPagination = z.infer<typeof WithPaginationSchema>

export const MetaDataSchema = z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
})

export type MetaData = z.infer<typeof MetaDataSchema>

export interface DocumentWithMetaData<T> {
    data: T;
    meta: MetaData;
}
