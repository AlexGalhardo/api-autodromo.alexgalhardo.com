import "dotenv/config";
import { randomUUID } from "crypto";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { Bcrypt } from "src/Utils/Bcrypt";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import Validator from "src/Utils/Validator";
import * as jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";

interface AuthRegisterUseCaseResponse {
    success: boolean;
    jwt_token?: string;
}

export interface UserCreateDTO {
    username: string;
    email: string;
    password: string;
	role: UserRole
}

export interface AuthRegisterUseCasePort {
    execute(jwtToken: string, userCreatePayload: UserCreateDTO): Promise<AuthRegisterUseCaseResponse>;
}

export default class AuthRegisterUseCase implements AuthRegisterUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(jwtToken: string, userCreatePayload: UserCreateDTO): Promise<AuthRegisterUseCaseResponse> {
		try {
			const { role_token } = jwt.verify(jwtToken, process.env.JWT_SECRET) as jwt.JwtPayload;

			if (!role_token) throw new Error(ErrorsMessages.USER_ROLE_TOKEN_INVALID);

			const userFound = await this.usersRepository.getByRoleToken(role_token)

			if(userFound && userFound.role !== UserRole.GESTOR) throw new Error(ErrorsMessages.USER_ROLE_IS_NOT_GESTOR);

			const { username, email, password, role } = userCreatePayload;

			if (email && !Validator.email.isValid(email)) throw new Error(ErrorsMessages.EMAIL_IS_INVALID);

			if (password && !Validator.password.isSecure(password))
				throw new Error(ErrorsMessages.PASSWORD_INSECURE);

			if (role && !Validator.role.isValid(role))
				throw new Error(ErrorsMessages.INVALID_USER_ROLE);

			if (!(await this.usersRepository.findByEmail(email))) {
				const role_token = randomUUID()

				const jwt_token = jwt.sign({ role_token  }, process.env.JWT_SECRET)

				await this.usersRepository.create({
					username,
					role,
					role_token,
					email,
					password: await Bcrypt.hash(password),
					jwt_token,
					reset_password_token: null,
					reset_password_token_expires_at: null,
				});

				return { success: true, jwt_token };
			}

			throw new Error(ErrorsMessages.EMAIL_ALREADY_REGISTERED);
		} catch (error) {
			throw new Error(error)
		}
    }
}
