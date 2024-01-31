import { Race, UserRole } from "@prisma/client";
import { RacesRepositoryPort } from "src/Repositories/Races.repository";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface RaceGetAllUseCaseResponse {
    success: boolean;
    data?: Race[];
}

export interface RaceGetAllUseCasePort {
    execute(userId: string): Promise<RaceGetAllUseCaseResponse>;
}

export default class RaceGetAllUseCase implements RaceGetAllUseCasePort {
    constructor(
        private readonly racesRepository: RacesRepositoryPort,
        private readonly usersRepository: UsersRepositoryPort,
    ) {}

    async execute(userId: string): Promise<RaceGetAllUseCaseResponse> {
        try {
            const userExists = await this.usersRepository.getById(userId);

            if (!userExists) throw new Error(ErrorsMessages.USER_NOT_FOUND);

            if (userExists.role !== UserRole.MANAGER)
                throw new Error(ErrorsMessages.USER_ROLE_MUST_BE_MANAGER);

            const allRacesFound = await this.racesRepository.getAll();

            return { success: true, data: allRacesFound };
        } catch (error) {
            throw new Error(error);
        }
    }
}
