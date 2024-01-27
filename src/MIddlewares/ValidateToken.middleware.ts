import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import * as jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { prisma } from "prisma/seed";

@Injectable()
export class ValidateToken implements NestMiddleware {
    async use(request: Request, response: Response, next: NextFunction) {
        if (
            !request.headers?.authorization ||
            !request.headers.authorization.startsWith("Bearer") ||
            !request.headers.authorization.split(" ")[1]
        ) {
            return response
                .status(HttpStatus.BAD_REQUEST)
                .json({ success: false, message: ErrorsMessages.MISSING_HEADER_AUTHORIZATION_BEARER_JWT_TOKEN_ });
        }

        const jwtToken = request.headers.authorization.split(" ")[1];

		const { role_token } = jwt.verify(jwtToken, process.env.JWT_SECRET) as jwt.JwtPayload;

		if (!role_token) {
			return response
                .status(HttpStatus.BAD_REQUEST)
                .json({ success: false, message: ErrorsMessages.USER_ROLE_TOKEN_INVALID });
		}

		const userFound = await prisma.user.findUnique({
			where: {
				role_token
			}
		})

		if(userFound && userFound.role !== UserRole.GESTOR) {
			return response
                .status(HttpStatus.BAD_REQUEST)
                .json({ success: false, message: ErrorsMessages.USER_ROLE_IS_NOT_GESTOR });
		}

        next();
    }
}
