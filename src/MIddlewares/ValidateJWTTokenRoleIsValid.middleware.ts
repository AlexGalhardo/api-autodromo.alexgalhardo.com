import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import { User, UserRole } from "@prisma/client";
import AbstractValidateJWTTokenRole from "./AbstractValidateJWTTokenRole";

@Injectable()
export class ValidateJWTTokenRoleIsValid extends AbstractValidateJWTTokenRole implements NestMiddleware {
    constructor() {
        super();
    }

    async use(request: Request, response: Response, next: NextFunction) {
        const userFound = (await this.verifyJwtTokenRole(request, response)) as User;

        if (
            !(
                userFound.role === UserRole.GESTOR ||
                userFound.role === UserRole.AFILIADO ||
                userFound.role === UserRole.COMUM
            )
        ) {
            return response
                .status(HttpStatus.BAD_REQUEST)
                .json({ success: false, message: ErrorsMessages.USER_ROLE_TOKEN_INVALID });
        }

        response.locals.userId = userFound.id;

        next();
    }
}
