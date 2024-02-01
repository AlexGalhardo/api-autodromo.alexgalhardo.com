import { Race } from "@prisma/client";
import { RacesRepositoryPort } from "src/Repositories/Races.repository";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface RaceGetHistoryUseCaseResponse {
    success: boolean;
    data?: Race[];
}

export interface RaceGetHistoryUseCasePort {
    execute(userId: string): Promise<RaceGetHistoryUseCaseResponse>;
}

export default class RaceGetHistoryUseCase implements RaceGetHistoryUseCasePort {
    constructor(
        private readonly racesRepository: RacesRepositoryPort,
        private readonly usersRepository: UsersRepositoryPort,
    ) {}

    async execute(userId: string): Promise<RaceGetHistoryUseCaseResponse> {
        try {
            const userExists = await this.usersRepository.getById(userId);

            if (!userExists) throw new Error(ErrorsMessages.USER_NOT_FOUND);

            const racesHistory = await this.racesRepository.getHistory(userId);

            return { success: true, data: racesHistory };
        } catch (error) {
            throw new Error(error);
        }
    }
}
