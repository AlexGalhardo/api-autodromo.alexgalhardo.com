import { Corrida } from "@prisma/client";
import { CorridasRepositoryPort } from "src/Repositories/Corridas.repository";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface CorridaGetHistoricoUseCaseResponse {
    success: boolean;
    data?: Corrida[];
}

export interface CorridaGetHistoricoUseCasePort {
    execute(userId: string): Promise<CorridaGetHistoricoUseCaseResponse>;
}

export default class AgendamentoCreateUseCase implements CorridaGetHistoricoUseCasePort {
    constructor(
        private readonly corridasRepository: CorridasRepositoryPort,
        private readonly usersRepository: UsersRepositoryPort,
    ) {}

    async execute(userId: string): Promise<CorridaGetHistoricoUseCaseResponse> {
        try {
            const userExists = await this.usersRepository.findById(userId);

            if (!userExists) throw new Error(ErrorsMessages.USER_NOT_FOUND);

            const historicoCorridas = await this.corridasRepository.getHistorico(userId);

            return { success: true, data: historicoCorridas };
        } catch (error) {
            throw new Error(error);
        }
    }
}
