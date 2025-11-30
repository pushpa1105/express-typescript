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
}

export interface SafeUser {
    _id: string | Object;
    password: string;
    email: string;
    age: number;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
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
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: 'user',
            required: true,
        }
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
