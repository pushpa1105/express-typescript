import express, { type Request, type Response, type Router } from "express";
import swaggerUi from "swagger-ui-express";

import { generateOpenAPIDocument } from "@/api-docs/openAPIDocumentGenerator";

export const openAPIRouter: Router = express.Router();
const openAPIDocument = generateOpenAPIDocument();

openAPIRouter.get("/swagger.json", (_req: Request, res: Response) => {
	res.setHeader("Content-Type", "application/json");
	res.send(openAPIDocument);
});

openAPIRouter.use("/", swaggerUi.serve, swaggerUi.setup(openAPIDocument, {
	swaggerOptions: {
		requestInterceptor: (req: Request & { credentials: string }) => {
			req.credentials = "include"; // makes Swagger send cookies
			return req;
		}
	}
}));
