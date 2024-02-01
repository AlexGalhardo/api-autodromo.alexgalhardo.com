import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import { ClientException } from "src/Utils/Exception";
import "dotenv/config";

export interface UserLoggedInUseCasePort {
    execute(userId: string);
}

export default class UserLoggedInUseCase implements UserLoggedInUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(userId: string) {
        if (userId && (await this.usersRepository.getById(userId))) {
            const userFound = await this.usersRepository.getById(userId);
            return { success: true, data: userFound };
        }

        throw new ClientException(ErrorsMessages.USER_NOT_FOUND);
    }
}
