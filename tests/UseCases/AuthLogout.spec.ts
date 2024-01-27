import { Test, TestingModule } from "@nestjs/testing";
import UsersRepository, { UsersRepositoryPort } from "src/Repositories/Users.repository";
import Validator from "src/Utils/Validator";
import UserLoginUseCase, { UserLoginDTO, UserLoginUseCasePort } from "src/UseCases/user/UserLogin.useCase";
import UserCreateUseCase, { UserCreateDTO, UserCreateUseCasePort } from "src/UseCases/user/UserCreate.useCase";
import UserDeleteUseCase, { UserDeleteUseCasePort } from "src/UseCases/user/User/UserDelete.useCase";
import UserLogoutUseCase, { UserLogoutUseCasePort } from "src/UseCases/user/User/UserLogout.useCase";
import { Database } from "src/Utils/Database";

describe("Test UserLogoutUseCase", () => {
    let UserCreateUseCase: UserCreateUseCasePort;
    let UserLoginUseCase: UserLoginUseCasePort;
    let UserLogoutUseCase: UserLogoutUseCasePort;
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
                    provide: "UserDeleteUseCasePort",
                    inject: ["UsersRepositoryPort"],
                    useFactory: (usersRepository: UsersRepositoryPort) => {
                        return new UserDeleteUseCase(usersRepository);
                    },
                },
            ],
        }).compile();
        UserCreateUseCase = module.get<UserCreateUseCasePort>("UserCreateUseCasePort");
        UserLoginUseCase = module.get<UserLoginUseCasePort>("UserLoginUseCasePort");
        UserLogoutUseCase = module.get<UserLogoutUseCasePort>("UserLogoutUseCasePort");
        deleteUserByEmail = module.get<UserDeleteUseCasePort>("UserDeleteUseCasePort");
    });

    const userEmail = Validator.email.generate();
    const userPassword = Validator.password.generate();
    let loginToken = null;

    it("should register a user", async () => {
        const UserCreateDTO: UserCreateDTO = {
            username: "Testing Logout Test",
            email: userEmail,
            telegramNumber: Validator.phone.generate(),
            password: userPassword,
        };
        const { success, jwt_token } = await UserCreateUseCase.execute(UserCreateDTO);

        expect(success).toBeTruthy();
        expect(jwt_token).toBeDefined();
    });

    it("should login a user", async () => {
        const UserLoginDTO: UserLoginDTO = {
            email: userEmail,
            password: userPassword,
        };
        let { success, jwt_token } = await UserLoginUseCase.execute(UserLoginDTO);
        loginToken = jwt_token;

        expect(success).toBeTruthy();
        expect(jwt_token).toBeDefined();
    });

    it("should logout a user", async () => {
        const { success } = await UserLogoutUseCase.execute(loginToken);

        expect(success).toBeTruthy();
    });

    afterAll(async () => {
        await deleteUserByEmail.execute(userEmail);
    });
});
