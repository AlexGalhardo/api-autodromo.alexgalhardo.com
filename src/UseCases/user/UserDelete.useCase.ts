import { User } from "@prisma/client";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";

interface UserDeleteUseCaseResponse {
    success: boolean;
	message: 'User Deleted!',
	data: User;
}

export interface UserDeleteUseCasePort {
    execute(email: string): Promise<UserDeleteUseCaseResponse>;
}

export default class UserDeleteUseCase implements UserDeleteUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(userId: string): Promise<UserDeleteUseCaseResponse> {
        try {
            const userDeleted = await this.usersRepository.deleteById(userId);
            return { success: true, message: 'User Deleted!', data: userDeleted };
        }
		catch(error){
			throw new Error(error.message)
		}
    }
}
