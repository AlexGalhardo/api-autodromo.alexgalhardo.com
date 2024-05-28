import "dotenv/config";
import { randomUUID } from "node:crypto";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { Bcrypt } from "src/Utils/Bcrypt";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import Validator from "src/Utils/Validator";
import * as jwt from "jsonwebtoken";
import { User, UserRole } from "src/config/mongoose";

interface UserCreateUseCaseResponse {
    success: boolean;
    data?: typeof User;
}

export interface UserCreateDTO {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface UserCreateUseCasePort {
    execute(userCreatePayload: UserCreateDTO): Promise<UserCreateUseCaseResponse>;
}

export default class UserCreateUseCase implements UserCreateUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(userCreatePayload: UserCreateDTO): Promise<UserCreateUseCaseResponse> {
        try {
            const { name, email, password, role } = userCreatePayload;

            if (!name || !email || !password || !role) throw new Error(ErrorsMessages.MISSING_REQUEST_BODY_DATA);

            if (email && !Validator.user.emailIsValid(email)) throw new Error(ErrorsMessages.EMAIL_IS_INVALID);

            if (password && !Validator.user.passowordIsSecure(password))
                throw new Error(ErrorsMessages.PASSWORD_INSECURE);

            if (role && !Validator.user.roleIsValid(role)) throw new Error(ErrorsMessages.INVALID_USER_ROLE);

            const emailAlreadyRegistered = await this.usersRepository.getByEmail(email);

            if (!emailAlreadyRegistered) {
                const role_token = randomUUID();

                const jwt_token = jwt.sign({ role_token }, process.env.JWT_SECRET);

                const userCreated = await this.usersRepository.create({
                    name,
                    role,
                    role_token,
                    email,
                    password: await Bcrypt.hash(password),
                    jwt_token,
                });

                return { success: true, data: userCreated };
            }

            throw new Error(ErrorsMessages.EMAIL_ALREADY_REGISTERED);
        } catch (error) {
            throw new Error(error);
        }
    }
}
