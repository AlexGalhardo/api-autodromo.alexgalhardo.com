import { Test, TestingModule } from "@nestjs/testing";
import UsersRepository, { UsersRepositoryPort } from "src/Repositories/Users.repository";
import UserCreateUseCase, { UserCreateDTO, UserCreateUseCasePort } from "src/UseCases/user/UserCreate.useCase";
import Validator from "src/Utils/Validator";
import UserDeleteUseCase, { UserDeleteUseCasePort } from "src/UseCases/user/User/UserDelete.useCase";
import AuthForgetPasswordUseCase, {
    AuthForgetPasswordDTO,
    AuthForgetPasswordUseCasePort,
} from "src/UseCases/AuthForgetPassword.useCase";
import { Database } from "src/Utils/Database";
import AuthCheckResetPasswordTokenUseCase from "src/UseCases/AuthCheckResetPasswordToken.useCase";

describe("Test AuthCheckResetPasswordTokenUseCase", () => {
    let UserCreateUseCase: UserCreateUseCasePort;
    let authForgetPasswordUseCase: AuthForgetPasswordUseCasePort;
    let authCheckResetPasswordTokenUseCase: AuthCheckResetPasswordTokenUseCase;
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
                    provide: "UserCreateUseCasePort",
                    inject: ["UsersRepositoryPort"],
                    useFactory: (usersRepository: UsersRepositoryPort) => {
                        return new UserCreateUseCase(usersRepository);
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
                    provide: "AuthCheckResetPasswordTokenUseCasePort",
                    inject: ["UsersRepositoryPort"],
                    useFactory: (usersRepository: UsersRepositoryPort) => {
                        return new AuthCheckResetPasswordTokenUseCase(usersRepository);
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
        authForgetPasswordUseCase = module.get<AuthForgetPasswordUseCasePort>("AuthForgetPasswordUseCasePort");
        authCheckResetPasswordTokenUseCase = module.get<AuthCheckResetPasswordTokenUseCase>(
            "AuthCheckResetPasswordTokenUseCasePort",
        );
        deleteUserByEmail = module.get<UserDeleteUseCasePort>("UserDeleteUseCasePort");
    });

    const userEmail = Validator.email.generate();
    let userResetPasswordToken = null;

    it("should register a user", async () => {
        const UserCreateDTO: UserCreateDTO = {
            username: "Testing ForgetPassword Test",
            email: userEmail,
            telegramNumber: Validator.phone.generate(),
            password: Validator.password.generate(),
        };
        const { success, jwt_token } = await UserCreateUseCase.execute(UserCreateDTO);

        expect(success).toBeTruthy();
        expect(jwt_token).toBeDefined();
    });

    it("should send a email with reset_password_token to user reset password", async () => {
        const authForgetPasswordDTO: AuthForgetPasswordDTO = { email: userEmail };
        const { success, reset_password_token } = await authForgetPasswordUseCase.execute(authForgetPasswordDTO);

        userResetPasswordToken = reset_password_token;

        expect(success).toBeTruthy();
        expect(reset_password_token).toBeDefined();
    });

    it("should check if password reset token exists and is valid", async () => {
        const { success } = await authCheckResetPasswordTokenUseCase.execute(userResetPasswordToken);

        expect(success).toBeTruthy();
    });

    afterAll(async () => {
        await deleteUserByEmail.execute(userEmail);
    });
});
