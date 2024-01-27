import { Controller, Post, Res, Body, Inject, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { UserLoginDTO, UserLoginUseCasePort } from "src/UseCases/user/UserLogin.useCase";
import { UserLogoutUseCasePort } from "src/UseCases/user/UserLogout.useCase";
import { UserCreateDTO, UserCreateUseCasePort } from "src/UseCases/user/UserCreate.useCase";
import { UserCheckJWTTokenUseCasePort } from "src/UseCases/user/UserCheckJWTToken.useCase";
import { User } from "@prisma/client";

interface UserControllerResponse {
    success: boolean;
    data?: User;
    message?: string;
}

interface UserControllerPort {
    login(UserLoginDTO: UserLoginDTO, response: Response): Promise<Response<UserControllerResponse>>;
    register(UserCreateDTO: UserCreateDTO, response: Response): Promise<Response<UserControllerResponse>>;
    logout(response: Response): Promise<Response<UserControllerResponse>>;
    tokenUser(response: Response): Promise<Response<UserControllerResponse>>;
}

@Controller("user")
export class UserController implements UserControllerPort {
    constructor(
        @Inject("UserLoginUseCasePort") private readonly UserLoginUseCase: UserLoginUseCasePort,
        @Inject("UserCreateUseCasePort") private readonly UserCreateUseCase: UserCreateUseCasePort,
        @Inject("UserLogoutUseCasePort") private readonly UserLogoutUseCase: UserLogoutUseCasePort,
        @Inject("UserCheckJWTTokenUseCasePort")
        private readonly UserCheckJWTTokenUseCase: UserCheckJWTTokenUseCasePort,
    ) {}

    @Post("/login")
    async login(
        @Body() userLoginPayload: UserLoginDTO,
        @Res() response: Response,
    ): Promise<Response<UserControllerResponse>> {
        try {
            const { success, jwt_token, message } = await this.UserLoginUseCase.execute(userLoginPayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, jwt_token });
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Post("/")
    async register(
        @Body() authRegisterPayload: UserCreateDTO,
        @Res() response: Response,
    ): Promise<Response<UserControllerResponse>> {
        try {
            const { success, data } = await this.UserCreateUseCase.execute(authRegisterPayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Post("/logout")
    async logout(@Res() response: Response): Promise<Response<UserControllerResponse>> {
        try {
            const userJWTToken = response.locals.token;
            const { success } = await this.UserLogoutUseCase.execute(userJWTToken);
            if (success) return response.status(HttpStatus.OK).json({ success: true });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Post("/check-user-jwt-token")
    async tokenUser(@Res() response: Response): Promise<Response<UserControllerResponse>> {
        try {
            const userJWTToken = response.locals.token;
            const { success, data } = await this.UserCheckJWTTokenUseCase.execute(userJWTToken);
            if (success) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}
