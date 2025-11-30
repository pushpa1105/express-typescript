import { logger } from "@/server";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";

function ErrorCatcher(message: string) {
    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                return await original.apply(this, args);
            } catch (ex) {
                const errorMessage = `Error in ${message}: ${(ex as Error).message}`;
                logger.error(errorMessage);
                return ServiceResponse.failure(
                    `An error occurred while processing your request.`,
                    null,
                    StatusCodes.INTERNAL_SERVER_ERROR,
                );
            }
        }
    };
}

export { ErrorCatcher };