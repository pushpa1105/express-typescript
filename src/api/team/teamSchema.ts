import z from "zod";

export type Team = z.infer<typeof TeamSchema>;
export type CreateTeamData = z.infer<typeof CreateTeamSchema.shape.body>;

export const CreateTeamSchema = z.object({
    body: z.object({
        name: z.string(),
    })
})

export const TeamSchema = z.object({
    id: z.number(),
    name: z.string(),
    ownerId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
})