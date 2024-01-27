import * as jwt from "jsonwebtoken";
import { prisma } from "prisma/seed";
import { Request, Response } from "express";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import { User } from "@prisma/client";
import { HttpStatus } from "@nestjs/common";

export default abstract class AbstractValidateJWTTokenRole {
    protected async verifyJwtTokenRole(request: Request, response: Response): Promise<User | any> {
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
                .json({ success: false, message: ErrorsMessages.USER_ROLE_TOKEN_INVALID });
		}

        return await prisma.user.findUnique({
            where: {
                role_token,
            },
        });
    }
}
