import { User, UserRole } from "@prisma/client";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface UserGetAllUseCaseResponse {
    success: boolean;
    data?: User[];
}

export interface UserGetAllUseCasePort {
    execute(userId: string): Promise<UserGetAllUseCaseResponse>;
}

export default class UserGetAllUseCase implements UserGetAllUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(userId: string): Promise<UserGetAllUseCaseResponse> {
        try {
            const userExists = await this.usersRepository.getById(userId);

            if (!userExists) throw new Error(ErrorsMessages.USER_NOT_FOUND);

            if (userExists.role !== UserRole.MANAGER)
                throw new Error(ErrorsMessages.USER_ROLE_MUST_BE_MANAGER);

            const allUsersFound = await this.usersRepository.getAll();

            return { success: true, data: allUsersFound };
        } catch (error) {
            throw new Error(error);
        }
    }
}
