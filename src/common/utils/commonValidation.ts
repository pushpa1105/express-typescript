import { z } from "zod";

export const commonValidations = {
	id: z
		.string(),
	mongoId: z
		.string()
		.regex(/^[a-fA-F0-9]{24}$/, "Invalid MongoDB ObjectId")
};
