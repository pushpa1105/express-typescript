import { Document, model, Schema } from "mongoose";

export const WORKSPACE_TYPES = {
    PERSONAL: "personal",
    TEAM: "team",
} as const;

export type WorkspaceType =
    (typeof WORKSPACE_TYPES)[keyof typeof WORKSPACE_TYPES];

export interface WorkspaceDocument extends Document {
    name: string;
    type: WorkspaceType;
    ownerId: Schema.Types.ObjectId;
    teamId?: string;
}

const WorkspaceSchema = new Schema<WorkspaceDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(WORKSPACE_TYPES),
            required: true,
            default: WORKSPACE_TYPES.PERSONAL,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        teamId: {
            type: Schema.Types.ObjectId,
            ref: "Team",
        },
    },
    {
        timestamps: true,
    }
)

WorkspaceSchema.index(
    { name: 1, ownerId: 1 },
    {
        unique: true,
        partialFilterExpression: { type: WORKSPACE_TYPES.PERSONAL }
    }
);

WorkspaceSchema.index(
    { name: 1, teamId: 1 },
    {
        unique: true,
        partialFilterExpression: { type: WORKSPACE_TYPES.TEAM }
    }
)

export const WorkspaceModel = model<WorkspaceDocument>("Workspace", WorkspaceSchema)
