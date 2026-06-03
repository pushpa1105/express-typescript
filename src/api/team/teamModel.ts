import { Document, model, Schema } from "mongoose";

export interface TeamDocument extends Document {
    name: string;
    ownerId: Schema.Types.ObjectId,
    createdAt: Date;
    updatedAt: Date;
}

const TeamSchema = new Schema<TeamDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    {
        timestamps: true,
    }
)

export const TeamModel = model<TeamDocument>("Team", TeamSchema)
