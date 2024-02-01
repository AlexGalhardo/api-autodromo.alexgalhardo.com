import { NextFunction, Request, Response } from "express";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import { HttpStatus, NestMiddleware } from "@nestjs/common";
import "dotenv/config";

export default class ValidateEvent implements NestMiddleware {
    async use(request: Request, response: Response, next: NextFunction): Promise<void | Response> {
        try {
            if (
                !request.headers?.authorization ||
                !request.headers.authorization.startsWith("Bearer") ||
                !request.headers.authorization.split(" ")[1]
            ) {
                return response
                    .status(HttpStatus.BAD_REQUEST)
                    .json({ success: false, message: ErrorsMessages.MISSING_HEADER_AUTHORIZATION_BEARER_EVENT_TOKEN });
            }

            const tokenEvent = request.headers.authorization.split(" ")[1];

            if(tokenEvent !== "EVENT")
				return response
					.status(HttpStatus.BAD_REQUEST)
					.json({ success: false, message: ErrorsMessages.EVENT_TOKEN_IS_INVALID });

			next()
        } catch (error) {
            return response
                .status(HttpStatus.BAD_REQUEST)
                .json({ success: false, message: ErrorsMessages.EVENT_TOKEN_IS_INVALID });
        }
    }
}
