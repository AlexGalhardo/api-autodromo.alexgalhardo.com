import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import { HttpStatus } from "@nestjs/common";
import "dotenv/config";
import { User } from "src/config/mongoose";

export default abstract class AbstractValidateJWTTokenRole {
	protected async verifyJwtTokenRole(request: Request, response: Response): Promise<typeof User | Response> {
		try {
			if (
				!request.headers?.authorization ||
				!request.headers.authorization.startsWith("Bearer") ||
				!request.headers.authorization.split(" ")[1]
			) {
				return response
					.status(HttpStatus.BAD_REQUEST)
					.json({ success: false, message: ErrorsMessages.MISSING_HEADER_AUTHORIZATION_BEARER_JWT_TOKEN });
			}

			const jwtToken = request.headers.authorization.split(" ")[1];

			const { role_token } = jwt.verify(jwtToken, process.env.JWT_SECRET) as jwt.JwtPayload;

			if (!role_token) {
				return response
					.status(HttpStatus.BAD_REQUEST)
					.json({ success: false, message: ErrorsMessages.ROLE_TOKEN_NOT_FOUND_IN_JWT });
			}

			return await User.findOne({ role_token });
		} catch (error) {
			return response
				.status(HttpStatus.BAD_REQUEST)
				.json({ success: false, message: ErrorsMessages.JWT_TOKEN_IS_INVALID });
		}
	}
}
