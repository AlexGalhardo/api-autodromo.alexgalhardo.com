import { Race } from "@prisma/client";
import { racesRepositoryPort } from "src/Repositories/Races.repository";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface RaceGetHistoricoUseCaseResponse {
    success: boolean;
    data?: Race[];
}

export interface RaceGetHistoricoUseCasePort {
    execute(userId: string): Promise<RaceGetHistoricoUseCaseResponse>;
}

export default class RaceCreateUseCase implements RaceGetHistoricoUseCasePort {
    constructor(
        private readonly racesRepository: racesRepositoryPort,
        private readonly usersRepository: UsersRepositoryPort,
    ) {}

    async execute(userId: string): Promise<RaceGetHistoricoUseCaseResponse> {
        try {
            const userExists = await this.usersRepository.findById(userId);

            if (!userExists) throw new Error(ErrorsMessages.USER_NOT_FOUND);

            const racesHistory = await this.racesRepository.getHistory(userId);

            return { success: true, data: racesHistory };
        } catch (error) {
            throw new Error(error);
        }
    }
}
