import { Controller, Get, Post, Res, Body, Inject, HttpStatus, Delete, Param } from "@nestjs/common";
import { Response } from "express";
import { UserLoginDTO, UserLoginUseCasePort } from "src/UseCases/user/UserLogin.useCase";
import { UserLogoutUseCasePort } from "src/UseCases/user/UserLogout.useCase";
import { UserCreateDTO, UserCreateUseCasePort } from "src/UseCases/user/UserCreate.useCase";
import { UserLoggedInUseCasePort } from "src/UseCases/user/UserLoggedIn.useCase";
import { User } from "@prisma/client";
import { UserGetAllUseCasePort } from "src/UseCases/user/UserGetAll.useCase";
import { UserDeleteUseCasePort } from "src/UseCases/user/UserDelete.useCase";

interface UserControllerResponse {
    success: boolean;
    data?: User;
    message?: string;
}

interface UserControllerPort {
    all(response: Response): Promise<Response<UserControllerResponse>>;
    login(UserLoginDTO: UserLoginDTO, response: Response): Promise<Response<UserControllerResponse>>;
    register(UserCreateDTO: UserCreateDTO, response: Response): Promise<Response<UserControllerResponse>>;
    logout(response: Response): Promise<Response<UserControllerResponse>>;
    checkLoggedIn(response: Response): Promise<Response<UserControllerResponse>>;
	delete(userIdToBeDeleted: string, response: Response): Promise<Response<UserControllerResponse>>;
}

@Controller("user")
export default class UserController implements UserControllerPort {
    constructor(
        @Inject("UserGetAllUseCasePort") private readonly userGetAllUseCase: UserGetAllUseCasePort,
        @Inject("UserLoginUseCasePort") private readonly userLoginUseCase: UserLoginUseCasePort,
        @Inject("UserCreateUseCasePort") private readonly userCreateUseCase: UserCreateUseCasePort,
        @Inject("UserLogoutUseCasePort") private readonly userLogoutUseCase: UserLogoutUseCasePort,
        @Inject("UserCheckJWTTokenUseCasePort")
        private readonly userLoggedInUseCase: UserLoggedInUseCasePort,
		@Inject("UserDeleteUseCasePort")
        private readonly userDeleteUseCase: UserDeleteUseCasePort,
    ) {}

    @Get("/all")
    async all(@Res() response: Response): Promise<Response<UserControllerResponse>> {
        try {
            const { success, data } = await this.userGetAllUseCase.execute(response.locals.userId);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Post("/login")
    async login(
        @Body() userLoginPayload: UserLoginDTO,
        @Res() response: Response,
    ): Promise<Response<UserControllerResponse>> {
        try {
            const { success, jwt_token, message } = await this.userLoginUseCase.execute(userLoginPayload);
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
            const { success, data } = await this.userCreateUseCase.execute(authRegisterPayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Post("/logout")
    async logout(@Res() response: Response): Promise<Response<UserControllerResponse>> {
        try {
            const { success } = await this.userLogoutUseCase.execute(response.locals.userId);
            if (success) return response.status(HttpStatus.OK).json({ success: true });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Post("/check-logged-in")
    async checkLoggedIn(@Res() response: Response): Promise<Response<UserControllerResponse>> {
        try {
            const { success, data } = await this.userLoggedInUseCase.execute(response.locals.userId);
            if (success) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

	@Delete("/:user_id")
    async delete(@Param('user_id') userIdToBeDeleted: string, @Res() response: Response): Promise<Response<UserControllerResponse>> {
        try {
            const { success, message, data } = await this.userDeleteUseCase.execute(userIdToBeDeleted);
            if (success) return response.status(HttpStatus.OK).json({ success: true, message, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}
