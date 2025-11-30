import { StatusCodes } from "http-status-codes";

import { UserRepository } from "@/api/user/userRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { SafeUser } from "./userModel";
import { CreateUserData, LoginUserData } from "./userSchema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "@/common/utils/envConfig";
import { ErrorCatcher } from "@/common/decorators/handleErrorCatcher";

interface LoginUserResponse {
	token: string;
	user: SafeUser
}

export class UserService {
	private userRepository: UserRepository;

	constructor(repository: UserRepository = new UserRepository()) {
		this.userRepository = repository;
	}

	// Creates a new user in the database
	@ErrorCatcher("Service.createUser")
	async createUser(userData: CreateUserData): Promise<ServiceResponse<SafeUser | null>> {
		const verifyUserEmail = await this.userRepository.findByEmailAsync(userData.email)

		if (verifyUserEmail) {
			return ServiceResponse.failure(`User already exists for ${userData.email}`, null, StatusCodes.CONFLICT)
		}

		const hashedPassword = await bcrypt.hash(userData.password, 10)

		userData.password = hashedPassword
		const user = await this.userRepository.createUser(userData)

		return ServiceResponse.success<SafeUser | null>("User created successfully", user)
	}

	@ErrorCatcher("Service.loginUser")
	async loginUser(loginData: LoginUserData): Promise<ServiceResponse<LoginUserResponse | null>> {
		console.log("Login Data:", loginData);
		const user = await this.userRepository.findByEmailAsync(loginData.email)

		if (!user) {
			return ServiceResponse.failure(
				"User not found.",
				null,
				StatusCodes.NOT_FOUND
			)
		}

		const passwordMatches = await bcrypt.compare(loginData.password, user.password);

		if (!passwordMatches) {
			return ServiceResponse.failure(
				"Invalid credentials",
				null,
				StatusCodes.UNAUTHORIZED
			)
		}

		const token = jwt.sign(
			{
				email: user.email,
				userId: user._id,
				role: user.role
			},
			env.JWT_SECRET,
			{
				expiresIn: '1s'
			}
		)

		return ServiceResponse.success(
			'Success',
			{
				token,
				user,
			},
		)
	}

	// Retrieves all users from the database
	@ErrorCatcher("Service.findAll")
	async findAll(): Promise<ServiceResponse<SafeUser[] | null>> {
		const users = await this.userRepository.findAllAsync();
		if (!users || users.length === 0) {
			return ServiceResponse.failure("No Users found", null, StatusCodes.NOT_FOUND);
		}
		return ServiceResponse.success<SafeUser[]>("Users found", users);
	}

	// Retrieves a single user by their ID
	@ErrorCatcher("Service.findById")
	async findById(id: number): Promise<ServiceResponse<SafeUser | null>> {
		const user = await this.userRepository.findByIdAsync(id);
		if (!user) {
			return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
		}
		return ServiceResponse.success<SafeUser>("User found", user);
	}

	//Retrieves logged in user details
	async getCurrentUser(userId: number): Promise<ServiceResponse<SafeUser | null>> {
		const user = await this.userRepository.findByIdAsync(userId);
		if (!user) {
			return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND)
		}

		return ServiceResponse.success<SafeUser>("User found", user)
	}
}

export const userService = new UserService();
