import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import { UserRole } from "src/config/mongoose";
import AbstractValidateJWTTokenRole from "./AbstractValidateJWTTokenRole";

@Injectable()
export class ValidateJWTTokenRoleManagerOrAffiliate extends AbstractValidateJWTTokenRole implements NestMiddleware {
    async use(request: Request, response: Response, next: NextFunction) {
        try {
			const userFound = (await this.verifyJwtTokenRole(request, response)) as any;

            if (!userFound || (userFound.role !== UserRole.AFFILIATE && userFound.role !== UserRole.MANAGER)) {
                return response
                    .status(HttpStatus.BAD_REQUEST)
                    .json({ success: false, message: ErrorsMessages.USER_ROLE_MUST_BE_AFFILIATE_OR_MANAGER });
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
