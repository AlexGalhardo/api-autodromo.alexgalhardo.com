import { Schedule, UserRole } from "src/config/mongoose";
import { SchedulesRepositoryPort } from "src/Repositories/Schedules.repository";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface ScheduleGetAllUseCaseResponse {
    success: boolean;
    data?: typeof Schedule[];
}

export interface ScheduleGetAllUseCasePort {
    execute(userId: string): Promise<ScheduleGetAllUseCaseResponse>;
}

export default class ScheduleGetAllUseCase implements ScheduleGetAllUseCasePort {
    constructor(
        private readonly schedulesRepository: SchedulesRepositoryPort,
        private readonly usersRepository: UsersRepositoryPort,
    ) {}

    async execute(userId: string): Promise<ScheduleGetAllUseCaseResponse> {
        try {
            const userExists = await this.usersRepository.getById(userId);

            if (!userExists) throw new Error(ErrorsMessages.USER_NOT_FOUND);

            if (userExists.role !== UserRole.AFFILIATE && userExists.role !== UserRole.MANAGER)
                throw new Error(ErrorsMessages.USER_ROLE_MUST_BE_AFFILIATE_OR_MANAGER);

            const allSchedulesFound = await this.schedulesRepository.getAll();

            return { success: true, data: allSchedulesFound };
        } catch (error) {
            throw new Error(error);
        }
    }
}
