import { Document, model, Schema } from "mongoose";

type UserRole = 'admin' | 'user'

export interface UserDocument extends Document {
    name: string;
    email: string;
    age: number;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    activeWorkspace?: Schema.Types.ObjectId;
}

export interface SafeUser {
    _id: string | Object;
    name: string;
    password: string;
    email: string;
    age: number;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    activeWorkspace?: string;
}

const UserSchema = new Schema<UserDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        age: {
            type: Number,
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: 'user',
            required: true,
        },
        activeWorkspace: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, ret: any) => {
                delete ret.password;
                delete ret.__v;
                return ret;
            }
        }
    }
)

export const UserModel = model<UserDocument>("User", UserSchema)
