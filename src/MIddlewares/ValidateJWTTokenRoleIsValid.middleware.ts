import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import { UserRole } from "src/config/mongoose";
import AbstractValidateJWTTokenRole from "./AbstractValidateJWTTokenRole";

@Injectable()
export class ValidateJWTTokenRoleIsValid extends AbstractValidateJWTTokenRole implements NestMiddleware {
    constructor() {
        super();
    }

    async use(request: Request, response: Response, next: NextFunction) {
        try {
            const userFound = (await this.verifyJwtTokenRole(request, response)) as any;

            if (
                !(
                    userFound.role === UserRole.MANAGER ||
                    userFound.role === UserRole.AFFILIATE ||
                    userFound.role === UserRole.COMMON
                )
            ) {
                return response
                    .status(HttpStatus.BAD_REQUEST)
                    .json({ success: false, message: ErrorsMessages.USER_ROLE_TOKEN_INVALID });
            }

            response.locals.userId = userFound.id;

            next();
        } catch (error) {
            return response
                .status(HttpStatus.BAD_REQUEST)
                .json({ success: false, message: ErrorsMessages.JWT_TOKEN_IS_INVALID });
        }
    }
}
