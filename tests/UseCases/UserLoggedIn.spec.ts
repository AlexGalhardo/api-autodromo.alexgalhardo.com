import { Test, TestingModule } from "@nestjs/testing";
import UsersRepository, { UsersRepositoryPort } from "src/Repositories/Users.repository";
import Validator from "src/Utils/Validator";
import UserCreateUseCase, { UserCreateDTO, UserCreateUseCasePort } from "src/UseCases/user/UserCreate.useCase";
import UserDeleteUseCase, { UserDeleteUseCasePort } from "src/UseCases/user/UserDelete.useCase";
import AuthTokenUserUseCase, { UserLoggedInUseCasePort } from "src/UseCases/user/UserLoggedIn.useCase";
import { Database } from "src/Utils/Database";

describe("Test UserLoggedIn Use Case", () => {
    let userCreateUseCase: UserCreateUseCasePort;
    let userLoggedInUseCasePort: UserLoggedInUseCasePort;
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
                        return new UsersRepository(database);
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
        userCreateUseCase = module.get<UserCreateUseCasePort>("UserCreateUseCasePort");
        userLoggedInUseCasePort = module.get<UserLoggedInUseCasePort>("UserLoggedInUseCasePort");
        deleteUserByEmail = module.get<UserDeleteUseCasePort>("UserDeleteUseCasePort");
    });

    const userEmail = Validator.user.generateEmail();
    const userPassword = Validator.user.generatePassword();
    const name = "Testing TokenUser Test";
    let loginToken = null;

    it("should register a user", async () => {
        const UserCreateDTO: UserCreateDTO = {
            name,
            email: userEmail,
            password: userPassword,
        };
        const { success, jwt_token } = await userCreateUseCase.execute(UserCreateDTO);
        loginToken = jwt_token;

        expect(success).toBeTruthy();
        expect(jwt_token).toBeDefined();
    });

    it("should check if user is logged in", async () => {
        const { success, data } = await userLoggedInUseCasePort.execute(loginToken);

        expect(success).toBeTruthy();
        expect(data.name).toBe(name);
        expect(data.email).toBe(userEmail);
        expect(data.jwt_token).toBe(loginToken);
    });

    afterAll(async () => {
        await deleteUserByEmail.execute(userEmail);
    });
});
