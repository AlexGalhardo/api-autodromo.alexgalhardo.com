import { Kart, UserRole } from "@prisma/client";
import { KartsRepositoryPort } from "src/Repositories/Karts.repository";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface KartGetAllUseCaseResponse {
    success: boolean;
    data?: Kart[];
}

export interface KartGetAllUseCasePort {
    execute(userId: string): Promise<KartGetAllUseCaseResponse>;
}

export default class KartGetAllUseCase implements KartGetAllUseCasePort {
    constructor(
        private readonly usersRepository: UsersRepositoryPort,
        private readonly kartsRepository: KartsRepositoryPort,
    ) {}

    async execute(userId: string): Promise<KartGetAllUseCaseResponse> {
        try {
            const userExists = await this.usersRepository.getById(userId);

            if (!userExists) throw new Error(ErrorsMessages.USER_NOT_FOUND);

            if (userExists.role !== UserRole.MANAGER) throw new Error(ErrorsMessages.USER_ROLE_MUST_BE_MANAGER);

            const allKartsFound = await this.kartsRepository.getAll();

            return { success: true, data: allKartsFound };
        } catch (error) {
            throw new Error(error);
        }
    }
}
