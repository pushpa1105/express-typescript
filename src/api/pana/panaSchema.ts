import { ObjectIdSchema } from "@/common/schema";
import z from "zod";

export type CreatePanaData = z.infer<typeof CreatePanaSchema.shape.body>;
export type PanaData = z.infer<typeof PanaSchema>;

export const CreatePanaSchema = z.object({
    body: z.object({
        title: z.string().optional(),
    }).optional()
})

export const UpdateTitleSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Required"),
    })
})

export const PanaSchema = z.object({
    id: z.number(),
    title: z.string(),
    workspaceId: z.string()
})
