import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { CreateUserSchema, GetUserSchema, LoginResponseSchema, LoginUserSchema, UserSchema } from "@/api/user/userSchema";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "./userController";
import { auth } from "@/common/middleware/auth";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
	method: "get",
	path: "/users",
	tags: ["User"],
	responses: createApiResponse(z.array(UserSchema), "Success"),
});

userRouter.get("/", userController.getUsers);

userRegistry.registerPath({
	method: "get",
	path: "/users/{id}",
	tags: ["User"],
	request: { params: GetUserSchema.shape.params },
	responses: createApiResponse(UserSchema, "Success"),
});

userRouter.get("/:id", validateRequest(GetUserSchema), userController.getUser);


userRegistry.registerPath({
	method: "post",
	path: "/users/register",
	tags: ["User"],
	request: { body: { content: { "application/json": { schema: CreateUserSchema.shape.body } } } },
	responses: createApiResponse(UserSchema, "Success"),
})

userRouter.post("/register", validateRequest(CreateUserSchema), userController.createUser)


userRegistry.registerPath({
	method: "post",
	path: "/users/login",
	tags: ["User"],
	request: { body: { content: { "application/json": { schema: LoginUserSchema.shape.body } } } },
	responses: createApiResponse(LoginResponseSchema, "Success")
})

userRouter.post("/login", validateRequest(LoginUserSchema), userController.loginUser)

userRegistry.registerPath({
	method: "get",
	path: "/users/me/profile",
	tags: ["User"],
	security: [{ bearerAuth: [] }],
	responses: createApiResponse(UserSchema, "Success")
})

userRouter.get("/me/profile", auth, userController.getCurrentUser);
