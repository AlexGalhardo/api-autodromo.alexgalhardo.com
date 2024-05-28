import { Road, UserRole } from "src/config/mongoose";
import { RoadsRepositoryPort } from "src/Repositories/Roads.repository";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface RoadGetAllUseCaseResponse {
    success: boolean;
    data?: typeof Road[];
}

export interface RoadGetAllUseCasePort {
    execute(userId: string): Promise<RoadGetAllUseCaseResponse>;
}

export default class RoadGetAllUseCase implements RoadGetAllUseCasePort {
    constructor(
        private readonly usersRepository: UsersRepositoryPort,
        private readonly roadsRepository: RoadsRepositoryPort,
    ) {}

    async execute(userId: string): Promise<RoadGetAllUseCaseResponse> {
        try {
            const userExists = await this.usersRepository.getById(userId);

            if (!userExists) throw new Error(ErrorsMessages.USER_NOT_FOUND);

            if (userExists.role !== UserRole.MANAGER) throw new Error(ErrorsMessages.USER_ROLE_MUST_BE_MANAGER);

            const allRoadsFound = await this.roadsRepository.getAll();

            return { success: true, data: allRoadsFound };
        } catch (error) {
            throw new Error(error);
        }
    }
}
