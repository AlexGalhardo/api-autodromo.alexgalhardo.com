import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { AppModule } from "../../src/App.module";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { UserController } from "../../src/Controllers/User.controller";
import UsersRepository, { UsersRepositoryPort } from "../../src/Repositories/Users.repository";
import UserLoginUseCase from "../../src/UseCases/user/User/UserLogin.useCase";
import UserCreateUseCase from "../../src/UseCases/user/User/UserCreate.useCase";
import AuthForgetPasswordUseCase from "../../src/UseCases/AuthForgetPassword.useCase";
import AuthResetPasswordUseCase from "../../src/UseCases/AuthResetPassword.useCase";
import UserLogoutUseCase from "src/UseCases/user/User/UserLogout.useCase";
import AuthTokenUserUseCase from "src/UseCases/user/UserCheckJWTToken.useCase";
import AuthLoginGoogleUseCase from "src/UseCases/AuthLoginGoogle.useCase";
import AuthCheckResetPasswordTokenUseCase from "src/UseCases/AuthCheckResetPasswordToken.useCase";
import { Database } from "src/Utils/Database";
import AuthLoginGitHubUseCase from "src/UseCases/AuthLoginGitHub.useCase";
import UserCheckJWTTokenUseCase from "src/UseCases/user/UserCheckJWTToken.useCase";

describe("AppController (e2e)", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            controllers: [UserController],
            imports: [AppModule],
            providers: [
                Database,
                {
                    provide: "UsersRepositoryPort",
                    inject: [Database],
                    useFactory: (database: Database) => {
                        return new UsersRepository(database);
                    },
                },
                {
                    provide: "UserCreateUseCasePort",
                    inject: ["UsersRepositoryPort"],
                    useFactory: (usersRepository: UsersRepositoryPort) => {
                        return new UserCreateUseCase(usersRepository);
                    },
                },
                {
                    provide: "UserLoginUseCasePort",
                    inject: ["UsersRepositoryPort"],
                    useFactory: (usersRepository: UsersRepositoryPort) => {
                        return new UserLoginUseCase(usersRepository);
                    },
                },
                {
                    provide: "AuthLoginGoogleUseCasePort",
                    inject: ["UsersRepositoryPort"],
                    useFactory: (usersRepository: UsersRepositoryPort) => {
                        return new AuthLoginGoogleUseCase(usersRepository);
                    },
                },
                {
                    provide: "AuthLoginGitHubUseCasePort",
                    inject: ["UsersRepositoryPort"],
                    useFactory: (usersRepository: UsersRepositoryPort) => {
                        return new AuthLoginGitHubUseCase(usersRepository);
                    },
                },
                {
                    provide: "UserLogoutUseCasePort",
                    inject: ["UsersRepositoryPort"],
                    useFactory: (usersRepository: UsersRepositoryPort) => {
                        return new UserLogoutUseCase(usersRepository);
                    },
                },
                {
                    provide: "AuthTokenUserUseCasePort",
                    inject: ["UsersRepositoryPort"],
                    useFactory: (usersRepository: UsersRepositoryPort) => {
                        return new AuthTokenUserUseCase(usersRepository);
                    },
                },
                {
                    provide: "AuthForgetPasswordUseCasePort",
                    inject: ["UsersRepositoryPort"],
                    useFactory: (usersRepository: UsersRepositoryPort) => {
                        return new AuthForgetPasswordUseCase(usersRepository);
                    },
                },
                {
                    provide: "AuthResetPasswordUseCasePort",
                    inject: ["UsersRepositoryPort"],
                    useFactory: (usersRepository: UsersRepositoryPort) => {
                        return new AuthResetPasswordUseCase(usersRepository);
                    },
                },
                {
                    provide: "AuthCheckResetPasswordTokenUseCasePort",
                    inject: ["UsersRepositoryPort"],
                    useFactory: (usersRepository: UsersRepositoryPort) => {
                        return new AuthCheckResetPasswordTokenUseCase(usersRepository);
                    },
                },
                {
                    provide: "UserCheckJWTTokenUseCasePort",
                    inject: ["UsersRepositoryPort"],
                    useFactory: (usersRepository: UsersRepositoryPort) => {
                        return new UserCheckJWTTokenUseCase(usersRepository);
                    },
                },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it("GET healthCheck / endpoint should return HttpStatus.OK", () => {
        return request(app.getHttpServer()).get("/").expect(HttpStatus.OK).expect({
            success: true,
            message: "Nerd API is on, lets goo!",
        });
    });
});
