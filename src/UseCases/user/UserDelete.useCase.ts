import { User } from "src/config/mongoose";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";

interface UserDeleteUseCaseResponse {
    success: boolean;
    message: "User Deleted!";
    data: typeof User;
}

export interface UserDeleteUseCasePort {
    execute(email: string): Promise<UserDeleteUseCaseResponse>;
}

export default class UserDeleteUseCase implements UserDeleteUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(userId: string): Promise<UserDeleteUseCaseResponse> {
        try {
            const userDeleted = await this.usersRepository.delete(userId);
            return { success: true, message: "User Deleted!", data: userDeleted };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
