import { Router } from "express";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { userRouter } from "@/api/user/userRouter";

const router = Router();

router.use("/health-check", healthCheckRouter);
router.use("/users", userRouter);

export { router };