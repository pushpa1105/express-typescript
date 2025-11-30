import { SafeUser, UserModel } from "./userModel";
import { CreateUserData } from "./userSchema";

export class UserRepository {
	async findAllAsync(): Promise<SafeUser[]> {
		return await UserModel.find({});
	}

	async findByIdAsync(id: number): Promise<SafeUser | null> {
		return await UserModel.findById(id) || null;
	}


	async findByEmailAsync(email: string): Promise<SafeUser | null> {
		return await UserModel.findOne({ email }) || null;
	}

	async createUser(userData: CreateUserData): Promise<SafeUser | null> {
		return await UserModel.insertOne(userData) || null;
	}
}
