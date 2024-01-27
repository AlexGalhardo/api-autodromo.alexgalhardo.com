import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import { ClientException } from "src/Utils/Exception";
import * as jwt from "jsonwebtoken";

export interface UserCheckJWTTokenUseCasePort {
    execute(token: string);
}

export default class UserCheckJWTTokenUseCase implements UserCheckJWTTokenUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(token: string) {
        const { userID } = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

        if (userID && (await this.usersRepository.findById(userID))) {
            const { user } = await this.usersRepository.getById(userID);
            return { success: true, data: user };
        }

        throw new ClientException(ErrorsMessages.USER_NOT_FOUND);
    }
}
