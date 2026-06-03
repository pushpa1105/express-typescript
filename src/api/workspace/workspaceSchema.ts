import { PaginationSchema } from "@/common/schema";
import z from "zod";

export type Workspace = z.infer<typeof WorkspaceSchema>;
export type CreateWorkspaceData = z.infer<typeof CreateWorkspaceSchema.shape.body>;
export type GetMyWorkspace = z.infer<typeof GetMyWorkspaceSchema>;

export const CreateWorkspaceSchema = z.object({
    body: z.object({
        name: z.string(),
        type: z.string(),
        teamId: z.string().optional(),
    })
})

export const WorkspaceSchema = z.object({
    id: z.number(),
    name: z.string(),
    ownerId: z.string(),
    type: z.string(),
    teamId: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const GetMyWorkspaceSchema = z.object({
    pagination: PaginationSchema,
    userId: z.string()
})