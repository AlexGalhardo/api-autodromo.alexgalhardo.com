import "dotenv/config";
import { randomUUID } from "crypto";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { Bcrypt } from "src/Utils/Bcrypt";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import Validator from "src/Utils/Validator";
import * as jwt from "jsonwebtoken";
import { User, UserRole } from "@prisma/client";

interface UserCreateUseCaseResponse {
    success: boolean;
    data?: User;
}

export interface UserCreateDTO {
    username: string;
    email: string;
    password: string;
	role: UserRole
}

export interface UserCreateUseCasePort {
    execute(userCreatePayload: UserCreateDTO): Promise<UserCreateUseCaseResponse>;
}

export default class UserCreateUseCase implements UserCreateUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(userCreatePayload: UserCreateDTO): Promise<UserCreateUseCaseResponse> {
		try {
			const { username, email, password, role } = userCreatePayload;

			if (email && !Validator.email.isValid(email)) throw new Error(ErrorsMessages.EMAIL_IS_INVALID);

			if (password && !Validator.password.isSecure(password)) throw new Error(ErrorsMessages.PASSWORD_INSECURE);

			if (role && !Validator.role.isValid(role)) throw new Error(ErrorsMessages.INVALID_USER_ROLE);

			const emailAlreadyRegistered = await this.usersRepository.findByEmail(email)

			if (!emailAlreadyRegistered) {
				const role_token = randomUUID()

				const jwt_token = jwt.sign({ role_token  }, process.env.JWT_SECRET)

				const userCreated = await this.usersRepository.create({
					username,
					role,
					role_token,
					email,
					password: await Bcrypt.hash(password),
					jwt_token
				});

				return { success: true, data: userCreated };
			}

			throw new Error(ErrorsMessages.EMAIL_ALREADY_REGISTERED);
		} catch (error) {
			throw new Error(error)
		}
    }
}
