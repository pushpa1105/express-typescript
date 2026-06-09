import { baseSchema } from "@/common/schema/baseSchema";
import { Document, model, Schema } from "mongoose";

export interface PanaDocument extends Document {
    title: string;
    workspaceId: Schema.Types.ObjectId;
    parentId?: Schema.Types.ObjectId | string;
    created_by: Schema.Types.ObjectId;
    created_at: Date;
}

const PanaSchema = new Schema<PanaDocument>({
    title: {
        type: String,
        default: 'A New Page'
    },
    workspaceId: {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: "Pana",
    },
    ...baseSchema
})

export const PanaModel = model<PanaDocument>("Pana", PanaSchema)
