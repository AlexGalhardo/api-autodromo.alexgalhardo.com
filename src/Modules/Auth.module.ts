import { Module } from "@nestjs/common";
import { UserController } from "src/Controllers/User.controller";
import UsersRepository, { UsersRepositoryPort } from "src/Repositories/Users.repository";
import AuthLoginUseCase from "src/UseCases/AuthLogin.useCase";
import AuthLogoutUseCase from "src/UseCases/AuthLogout.useCase";
import AuthRegisterUseCase from "src/UseCases/AuthRegister.useCase";
import { Database } from "src/Utils/Database";
import AuthCheckUserJWTTokenUseCase from "src/UseCases/AuthCheckUserJWTToken.useCase";

@Module({
    controllers: [UserController],
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
            provide: "AuthLoginUseCasePort",
            inject: ["UsersRepositoryPort"],
            useFactory: (usersRepository: UsersRepositoryPort) => {
                return new AuthLoginUseCase(usersRepository);
            },
        },
        {
            provide: "AuthRegisterUseCasePort",
            inject: ["UsersRepositoryPort"],
            useFactory: (usersRepository: UsersRepositoryPort) => {
                return new AuthRegisterUseCase(usersRepository);
            },
        },
        {
            provide: "AuthLogoutUseCasePort",
            inject: ["UsersRepositoryPort"],
            useFactory: (usersRepository: UsersRepositoryPort) => {
                return new AuthLogoutUseCase(usersRepository);
            },
        },
        {
            provide: "AuthCheckUserJWTTokenUseCasePort",
            inject: ["UsersRepositoryPort"],
            useFactory: (usersRepository: UsersRepositoryPort) => {
                return new AuthCheckUserJWTTokenUseCase(usersRepository);
            },
        }
    ],
})
export class UserModule {}
