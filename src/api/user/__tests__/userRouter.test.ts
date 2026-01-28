import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { User } from "@/api/user/userSchema";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { app } from "@/server";
import { UserModel } from "../userModel";
import { inject } from "vitest";
import mongoose from "mongoose";

const MONGO_URI = inject('MONGO_URI');

beforeAll(async () => {
	await mongoose.connect(MONGO_URI);
});

afterAll(async () => {
	await mongoose.disconnect();
});

beforeEach(async () => {
	// Clean DB between tests
	await mongoose?.connection?.db?.dropDatabase();
});

const mockUsers: Partial<User>[] = [
	{
		name: "Alice",
		email: "alice@example.com",
		role: "user",
		password: "password123",
		age: 42,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		name: "Bob",
		role: "user",
		password: "password123",
		email: "bob@example.com",
		age: 21,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

describe("User API Endpoints", () => {
	describe("GET /users", () => {
		it("should return a list of users", async () => {
			// Arrange
			await UserModel.create(mockUsers);

			// Act
			const response = await request(app).get("/users");
			const responseBody: ServiceResponse<User[]> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain("Users found");
			expect(responseBody.data.length).toEqual(mockUsers.length);
			responseBody.data.forEach((user, index) => compareUsers(mockUsers[index] as User, user));
		});
	});

	// describe("POST /users/register", () => {
	// 	it("should return with proper message if required data are missing", async () => {
	// 		//Action
	// 		const response = await request(app).post('/users/register').send({})
	// 		const responseBody: ServiceResponse<User[]> = response.body;

	// 		expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
	// 		expect(responseBody.success).toBeFalsy();
	// 		expect(responseBody.message).toContain("Invalid input");
	// 		expect(responseBody.data).toBeNull();
	// 	})

	// 	it("should return with proper message if email is invalid", async () => {
	// 		//Arrange
	// 		const createUserData = {
	// 			name: "Test One",
	// 			email: 'me',
	// 			password: 'Test@123',
	// 			age: 12
	// 		}

	// 		//Action
	// 		const response = await request(app).post('/users/register').send(createUserData)
	// 		const responseBody: ServiceResponse<User[]> = response.body;

	// 		console.log('TTTTT', responseBody)

	// 		expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
	// 		expect(responseBody.success).toBeFalsy();
	// 		expect(responseBody.message).toContain("Invalid email");
	// 		expect(responseBody.data).toBeNull();
	// 	})

	// 	it("should return with proper message if password is invalid", async () => {
	// 		//Arrange
	// 		const createUserData = {
	// 			name: "Test One",
	// 			email: 'me@me.com',
	// 			password: 'Te',
	// 			age: 12
	// 		}

	// 		//Action
	// 		const response = await request(app).post('/users/register').send(createUserData)
	// 		const responseBody: ServiceResponse<User[]> = response.body;

	// 		expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
	// 		expect(responseBody.success).toBeFalsy();
	// 		expect(responseBody.message).toContain("Password should be at least of 6 characters.");
	// 		expect(responseBody.data).toBeNull();
	// 	})

	// 	it("should return with proper errror if user already exists ", async () => {
	// 		//Arrange
	// 		const testUser = {
	// 			name: "Alice",
	// 			email: "alice@example.com",
	// 			role: "user",
	// 			password: "password123",
	// 			age: 42,
	// 			createdAt: new Date(),
	// 			updatedAt: new Date(),
	// 		};
	// 		const testDbUser = await UserModel.create(testUser)

	// 		//Action
	// 		const response = await request(app).post('/users/register').send(testUser)
	// 		const responseBody: ServiceResponse<User[]> = response.body;

	// 		expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
	// 		expect(responseBody.success).toBeFalsy();
	// 		expect(responseBody.message).toContain("User already exists");
	// 		expect(responseBody.data).toBeNull();
	// 	})

	// 	it("should create user", async () => {
	// 		//Arrange
	// 		const testUser = {
	// 			name: "Alice",
	// 			email: "alice@example.com",
	// 			role: "user",
	// 			password: "password123",
	// 			age: 42,
	// 			createdAt: new Date(),
	// 			updatedAt: new Date(),
	// 		};

	// 		//Action
	// 		const response = await request(app).post('/users/register').send(testUser)
	// 		const responseBody: ServiceResponse<User> = response.body;

	// 		expect(response.statusCode).toEqual(StatusCodes.OK);
	// 		expect(responseBody.success).toBeTruthy();
	// 		expect(responseBody.message).toContain("User created");
	// 		compareUsers(testUser as User, responseBody.data);
	// 	})
	// })

	// describe("POST /users/login", () => {
	// 	it("should return with proper message if required data are missing", async () => {
	// 		//Action
	// 		const response = await request(app).post('/users/login').send({})
	// 		const responseBody: ServiceResponse<User[]> = response.body;

	// 		expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
	// 		expect(responseBody.success).toBeFalsy();
	// 		expect(responseBody.message).toContain("Invalid input");
	// 		expect(responseBody.data).toBeNull();
	// 	})

	// 	it("should return with proper message if email is invalid", async () => {
	// 		//Arrange
	// 		const createUserData = {
	// 			email: 'me',
	// 			password: 'Test@123',
	// 		}

	// 		//Action
	// 		const response = await request(app).post('/users/login').send(createUserData)
	// 		const responseBody: ServiceResponse<User[]> = response.body;

	// 		expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
	// 		expect(responseBody.success).toBeFalsy();
	// 		expect(responseBody.message).toContain("Invalid email");
	// 		expect(responseBody.data).toBeNull();
	// 	})

	// 	it("should return with proper message if password is invalid", async () => {
	// 		//Arrange
	// 		const createUserData = {
	// 			email: 'me@me.com',
	// 			password: 'Te',
	// 		}

	// 		//Action
	// 		const response = await request(app).post('/users/login').send(createUserData)
	// 		const responseBody: ServiceResponse<User[]> = response.body;

	// 		expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
	// 		expect(responseBody.success).toBeFalsy();
	// 		expect(responseBody.message).toContain("Password should be at least of 6 characters.");
	// 		expect(responseBody.data).toBeNull();
	// 	})

	// 	it("should return a not found error for non-existent user", async () => {
	// 		// Arrange
	// 		const loginUserData = {
	// 			email: 'me@me.com',
	// 			password: 'Test@123',
	// 		}

	// 		// Act
	// 		const response = await request(app).post(`/users/login`).send(loginUserData);
	// 		const responseBody: ServiceResponse = response.body;

	// 		// Assert
	// 		expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
	// 		expect(responseBody.success).toBeFalsy();
	// 		expect(responseBody.message).toContain("User not found");
	// 		expect(responseBody.data).toBeNull();
	// 	});

	// 	it("should return a invalid credentials error for incorrect credentials", async () => {
	// 		// Arrange
	// 		const loginUserData = {
	// 			email: 'me@me.com',
	// 			password: 'Test@123',
	// 		}

	// 		// Act
	// 		const response = await request(app).post(`/users/login`).send(loginUserData);
	// 		const responseBody: ServiceResponse = response.body;

	// 		// Assert
	// 		expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
	// 		expect(responseBody.success).toBeFalsy();
	// 		expect(responseBody.message).toContain("User not found");
	// 		expect(responseBody.data).toBeNull();
	// 	});

	// 	it("should return a user with token", async () => {
	// 		// Arrange
	// 		const testUser = {
	// 			name: "Alice",
	// 			email: "alice@example.com",
	// 			role: "user",
	// 			password: "password123",
	// 			age: 42,
	// 			createdAt: new Date(),
	// 			updatedAt: new Date(),
	// 		};
	// 		const testDbUser = await request(app).post(`/users/register`).send(testUser);

	// 		// Act
	// 		const response = await request(app).post(`/users/login`).send({
	// 			email: testUser?.email,
	// 			password: testUser?.password,
	// 		});
	// 		const responseBody: ServiceResponse<any> = response.body;

	// 		// Assert
	// 		expect(response.statusCode).toEqual(StatusCodes.OK);
	// 		expect(responseBody.success).toBeTruthy();
	// 		expect(responseBody.message).toContain("Success");
	// 		expect(responseBody.data?.token).not.toBeNull();

	// 		compareUsers(testUser as User, responseBody.data?.user);
	// 	});
	// })

	describe("GET /users/:id", () => {
		it("should return a user for a valid ID", async () => {
			// Arrange
			const testUser = {
				name: "Alice",
				email: "alice@example.com",
				role: "user",
				password: "password123",
				age: 42,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			const testDbUser = await UserModel.create(testUser)
			// Act
			const response = await request(app).get(`/users/${testDbUser?._id}`);
			const responseBody: ServiceResponse<User> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain("User found");
			if (!testUser) throw new Error("Invalid test data: expectedUser is undefined");
			compareUsers(testUser as User, responseBody.data);
		});

		it("should return a not found error for non-existent ID", async () => {
			// Arrange
			const testId = new mongoose.Types.ObjectId().toString();

			// Act
			const response = await request(app).get(`/users/${testId}`);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain("User not found");
			expect(responseBody.data).toBeNull();
		});

		it("should return a bad request for invalid ID format", async () => {
			// Act
			const invalidInput = "abc";
			const response = await request(app).get(`/users/${invalidInput}`);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain("Invalid input");
			expect(responseBody.data).toBeNull();
		});
	});
});

function compareUsers(mockUser: User, responseUser: User) {
	if (!mockUser || !responseUser) {
		throw new Error("Invalid test data: mockUser or responseUser is undefined");
	}

	expect(responseUser.id).toEqual(mockUser.id);
	expect(responseUser.name).toEqual(mockUser.name);
	expect(responseUser.email).toEqual(mockUser.email);
	expect(responseUser.age).toEqual(mockUser.age);
	expect(new Date(responseUser.createdAt)).toEqual(mockUser.createdAt);
	expect(new Date(responseUser.updatedAt)).toEqual(mockUser.updatedAt);
}
