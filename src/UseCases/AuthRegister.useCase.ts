import "dotenv/config";
import { randomUUID } from "crypto";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { Bcrypt } from "src/Utils/Bcrypt";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import { ClientException } from "src/Utils/Exception";
import Validator from "src/Utils/Validator";
import * as jwt from "jsonwebtoken";

interface AuthRegisterUseCaseResponse {
    success: boolean;
    jwt_token?: string;
}

export interface UserCreateDTO {
    username: string;
    email: string;
    password: string;
}

export interface AuthRegisterUseCasePort {
    execute(UserCreateDTO: UserCreateDTO): Promise<AuthRegisterUseCaseResponse>;
}

export default class AuthRegisterUseCase implements AuthRegisterUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(UserCreateDTO: UserCreateDTO): Promise<AuthRegisterUseCaseResponse> {
        const { username, email, password } = UserCreateDTO;

        if (email && !Validator.email.isValid(email)) throw new ClientException(ErrorsMessages.EMAIL_IS_INVALID);

        if (password && !Validator.password.isSecure(password))
            throw new ClientException(ErrorsMessages.PASSWORD_INSECURE);

        const hashedPassword = await Bcrypt.hash(password);

        if (!(await this.usersRepository.findByEmail(email))) {
            const userId = randomUUID();

            const jwt_token = jwt.sign({ userID: userId }, process.env.JWT_SECRET);

            await this.usersRepository.create({
                id: userId,
                username,
                email,
                password: hashedPassword,
                jwt_token,
                reset_password_token: null,
                reset_password_token_expires_at: null,
            });

            return { success: true, jwt_token };
        }

        throw new ClientException(ErrorsMessages.EMAIL_ALREADY_REGISTRED);
    }
}
