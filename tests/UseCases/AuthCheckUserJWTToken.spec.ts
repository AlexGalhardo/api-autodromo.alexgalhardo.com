import { Test, TestingModule } from "@nestjs/testing";
import UsersRepository, { UsersRepositoryPort } from "src/Repositories/Users.repository";
import Validator from "src/Utils/Validator";
import UserCreateUseCase, { UserCreateDTO, UserCreateUseCasePort } from "src/UseCases/user/UserCreate.useCase";
import UserDeleteUseCase, { UserDeleteUseCasePort } from "src/UseCases/user/UserDelete.useCase";
import AuthTokenUserUseCase, { UserCheckJWTTokenUseCasePort } from "src/UseCases/user/UserCheckJWTToken.useCase";
import { Database } from "src/Utils/Database";

describe("Test AuthCheckUserJWTToken", () => {
    let UserCreateUseCase: UserCreateUseCasePort;
    let authCheckUserJWTToken: UserCheckJWTTokenUseCasePort;
    let deleteUserByEmail: UserDeleteUseCasePort;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                Database,
                {
                    provide: "UsersRepositoryPort",
                    inject: [Database],
                    useFactory: (database: Database) => {
                        return new UsersRepository(undefined, database);
                    },
                },
                {
                    provide: "UserDeleteUseCasePort",
                    inject: ["UsersRepositoryPort"],
                    useFactory: (usersRepository: UsersRepositoryPort) => {
                        return new UserDeleteUseCase(usersRepository);
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
                    provide: "AuthTokenUserUseCasePort",
                    inject: ["UsersRepositoryPort"],
                    useFactory: (usersRepository: UsersRepositoryPort) => {
                        return new AuthTokenUserUseCase(usersRepository);
                    },
                },
            ],
        }).compile();
        UserCreateUseCase = module.get<UserCreateUseCasePort>("UserCreateUseCasePort");
        authCheckUserJWTToken = module.get<UserCheckJWTTokenUseCasePort>("AuthTokenUserUseCasePort");
        deleteUserByEmail = module.get<UserDeleteUseCasePort>("UserDeleteUseCasePort");
    });

    const userEmail = Validator.email.generate();
    const userPassword = Validator.password.generate();
    const username = "Testing TokenUser Test";
    let loginToken = null;

    it("should register a user", async () => {
        const UserCreateDTO: UserCreateDTO = {
            username,
            email: userEmail,
            telegramNumber: Validator.phone.generate(),
            password: userPassword,
        };
        const { success, jwt_token } = await UserCreateUseCase.execute(UserCreateDTO);
        loginToken = jwt_token;

        expect(success).toBeTruthy();
        expect(jwt_token).toBeDefined();
    });

    it("should check token and return user", async () => {
        const { success, data } = await authCheckUserJWTToken.execute(loginToken);

        expect(success).toBeTruthy();
        expect(data.username).toBe(username);
        expect(data.email).toBe(userEmail);
        expect(data.jwt_token).toBe(loginToken);
    });

    afterAll(async () => {
        await deleteUserByEmail.execute(userEmail);
    });
});
