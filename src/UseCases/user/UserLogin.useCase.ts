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

    async execute(userLoginPayload: UserLoginDTO): Promise<UserLoginUseCaseResponse> {
        const { email, password } = userLoginPayload;

        if (!Validator.user.emailIsValid(email)) throw new ClientException(ErrorsMessages.EMAIL_IS_INVALID);

        if (email && password) {
            const { user } = await this.usersRepository.getByEmail(email);

            if (user) {
                if (!(await Bcrypt.compare(password, user.password))) {
                    return { success: false, message: ErrorsMessages.EMAIL_OR_PASSWORD_INVALID };
                }

                const jwt_token = jwt.sign({ userID: user.id }, process.env.JWT_SECRET);
                user.jwt_token = jwt_token;

                return { success: true, jwt_token };
            }

            throw new ClientException(ErrorsMessages.USER_NOT_FOUND);
        }

        throw new ClientException(ErrorsMessages.EMAIL_OR_PASSWORD_INVALID);
    }
}
