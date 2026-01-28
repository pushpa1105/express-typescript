import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { CreateUserSchema, LoginResponseSchema, LoginUserSchema, UserSchema } from "@/api/user/userSchema";
import { auth } from "@/common/middleware/auth";
import { authController } from "@/api/auth/authController";
import { validateRequest } from "@/common/utils/httpHandlers";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.registerPath({
    method: "get",
    path: "/whoami",
    tags: ["Auth"],
    security: [{ cookieAuth: [] }],
    responses: createApiResponse(UserSchema, "Success")
})

authRouter.get("/whoami", auth, authController.getCurrentUser);

authRegistry.registerPath({
    method: "post",
    path: "/register",
    tags: ["Auth"],
    request: { body: { content: { "application/json": { schema: CreateUserSchema.shape.body } } } },
    responses: createApiResponse(UserSchema, "Success"),
})

authRouter.post("/register", validateRequest(CreateUserSchema), authController.createUser)


authRegistry.registerPath({
    method: "post",
    path: "/login",
    tags: ["Auth"],
    request: { body: { content: { "application/json": { schema: LoginUserSchema.shape.body } } } },
    responses: createApiResponse(LoginResponseSchema, "Success")
})

authRouter.post("/login", validateRequest(LoginUserSchema), authController.login)
