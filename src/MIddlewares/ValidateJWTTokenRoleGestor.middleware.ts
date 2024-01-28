import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import { User, UserRole } from "@prisma/client";
import AbstractValidateJWTTokenRole from "./AbstractValidateJWTTokenRole";

@Injectable()
export class ValidateJWTTokenRoleGestor extends AbstractValidateJWTTokenRole implements NestMiddleware {
    constructor() {
        super();
    }

    async use(request: Request, response: Response, next: NextFunction) {
        const userFound = (await this.verifyJwtTokenRole(request, response)) as User;

        if (userFound && userFound.role !== UserRole.MANAGER) {
            return response
                .status(HttpStatus.BAD_REQUEST)
                .json({ success: false, message: ErrorsMessages.USER_ROLE_IS_NOT_GESTOR });
        }

        next();
    }
}
