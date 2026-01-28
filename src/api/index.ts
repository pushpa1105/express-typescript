import { Router } from "express";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { userRouter } from "@/api/user/userRouter";
import { authRouter } from "@/api/auth/authRouter";

const router = Router();

router.use("/health-check", healthCheckRouter);
router.use("/users", userRouter);
router.use("/", authRouter)

export { router };