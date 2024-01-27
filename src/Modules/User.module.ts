import { Module } from "@nestjs/common";
import { UserController } from "src/Controllers/User.controller";
import UsersRepository, { UsersRepositoryPort } from "src/Repositories/Users.repository";
import UserLoginUseCase from "src/UseCases/user/UserLogin.useCase";
import UserLogoutUseCase from "src/UseCases/user/UserLogout.useCase";
import UserCreateUseCase from "src/UseCases/user/UserCreate.useCase";
import { Database } from "src/Utils/Database";
import UserCheckJWTTokenUseCase from "src/UseCases/user/UserCheckJWTToken.useCase";

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
            provide: "UserLoginUseCasePort",
            inject: ["UsersRepositoryPort"],
            useFactory: (usersRepository: UsersRepositoryPort) => {
                return new UserLoginUseCase(usersRepository);
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
            provide: "UserLogoutUseCasePort",
            inject: ["UsersRepositoryPort"],
            useFactory: (usersRepository: UsersRepositoryPort) => {
                return new UserLogoutUseCase(usersRepository);
            },
        },
        {
            provide: "UserCheckJWTTokenUseCasePort",
            inject: ["UsersRepositoryPort"],
            useFactory: (usersRepository: UsersRepositoryPort) => {
                return new UserCheckJWTTokenUseCase(usersRepository);
            },
        }
    ],
})
export class UserModule {}
