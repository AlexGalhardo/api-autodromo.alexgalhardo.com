import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import { ClientException } from "src/Utils/Exception";
import * as jwt from "jsonwebtoken";

export interface UserLogoutUseCasePort {
    execute(jwtToken: string): Promise<UserLogoutUseCaseResponse>;
}

interface UserLogoutUseCaseResponse {
    success: boolean;
}

export default class UserLogoutUseCase implements UserLogoutUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(jwtToken: string): Promise<UserLogoutUseCaseResponse> {
        const { userID } = jwt.verify(jwtToken, process.env.JWT_SECRET) as jwt.JwtPayload;

        if (userID && (await this.usersRepository.getById(userID))) {
            await this.usersRepository.logout(userID);
            return { success: true };
        }

        throw new ClientException(ErrorsMessages.MISSING_HEADER_AUTHORIZATION_BEARER_JWT_TOKEN);
    }
}
