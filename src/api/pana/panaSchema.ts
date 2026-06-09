import { ObjectIdSchema } from "@/common/schema";
import z from "zod";

export type CreatePanaData = z.infer<typeof CreatePanaSchema.shape.body>;

export const CreatePanaSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        parentId: ObjectIdSchema().optional(),
    })
})

export const PanaSchema = z.object({
    id: z.number(),
    title: z.string(),
    workspaceId: z.string()
})