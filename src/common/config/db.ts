import mongoose from "mongoose";
import pino from "pino";
import { env } from "@/common/utils/envConfig";

const logger = pino({ name: "mongodb" })

export const connectDB = async () => {
    try {
        await mongoose.connect(env.DB_URI)

        logger.info("MongoDB connected successfully.")

        mongoose.connection.on("disconnected", () => {
            logger.warn("MongoDB disconected")
        })

        mongoose.connection.on("error", (err: Error) => {
            logger.error(`MongoDB Error: ${err}`)
        })
    } catch (error: any) {
        logger.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}