import { Types } from "mongoose";
import { SafeUser, UserModel } from "./userModel";
import { CreateUserData } from "./userSchema";

export class UserRepository {
	async findAllAsync(): Promise<SafeUser[]> {
		return await UserModel.find({});
	}

	async findByIdAsync(id: string): Promise<SafeUser | null> {
		return await UserModel.findById(id) || null;
	}


	async findByEmailAsync(email: string): Promise<SafeUser | null> {
		return await UserModel.findOne({ email }) || null;
	}

	async createUser(userData: CreateUserData): Promise<SafeUser | null> {
		return await UserModel.insertOne(userData) || null;
	}

	async updateUser(id: number, updatedUserData: Partial<SafeUser>): Promise<SafeUser> {
		return await UserModel.findByIdAndUpdate(id, updatedUserData, { new: true }) as SafeUser;
	}
}
