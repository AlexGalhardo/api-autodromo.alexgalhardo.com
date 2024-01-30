import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { Bcrypt } from "src/Utils/Bcrypt";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import { ClientException } from "src/Utils/Exception";
import Validator from "src/Utils/Validator";
import * as jwt from "jsonwebtoken";

export interface UserLoginUseCasePort {
    execute(UserLoginDTO: UserLoginDTO): Promise<UserLoginUseCaseResponse>;
}

export interface UserLoginDTO {
    email: string;
    password: string;
}

interface UserLoginUseCaseResponse {
    success: boolean;
    jwt_token?: string;
    message?: string;
}

export default class UserLoginUseCase implements UserLoginUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute({ email, password }: UserLoginDTO): Promise<UserLoginUseCaseResponse> {
        if (!Validator.user.emailIsValid(email)) throw new ClientException(ErrorsMessages.EMAIL_IS_INVALID);

        if (email && password) {
            const userFound = await this.usersRepository.getByEmail(email);

            if (userFound) {
                if (!(await Bcrypt.compare(password, userFound.password))) {
                    return { success: false, message: ErrorsMessages.EMAIL_OR_PASSWORD_INVALID };
                }

                const jwt_token = jwt.sign({ role_token: userFound.role_token }, process.env.JWT_SECRET, { expiresIn: '1h'});

				await this.usersRepository.updateJwtToken(userFound.id, jwt_token)

                return { success: true, jwt_token };
            }

            throw new ClientException(ErrorsMessages.USER_NOT_FOUND);
        }

        throw new ClientException(ErrorsMessages.EMAIL_OR_PASSWORD_INVALID);
    }
}
