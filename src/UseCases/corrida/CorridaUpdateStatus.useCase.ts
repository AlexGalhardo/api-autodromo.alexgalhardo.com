import { Corrida, CorridaStatus } from "@prisma/client";
import { CorridasRepositoryPort } from "src/Repositories/Corridas.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface CorridaUpdateStatusUseCaseResponse {
    success: boolean;
    data?: Corrida;
}

export interface CorridaUpdateEndsAtDTO {
    id: string;
    status: CorridaStatus;
}

export interface CorridaUpdateStatusUseCasePort {
    execute(updateCorridaEndsAtPayload: CorridaUpdateEndsAtDTO): Promise<CorridaUpdateStatusUseCaseResponse>;
}

export default class CorridaUpdateStatusUseCase implements CorridaUpdateStatusUseCasePort {
    constructor(private readonly corridasRepository: CorridasRepositoryPort) {}

    async execute(updateCorridaEndsAtPayload: CorridaUpdateEndsAtDTO): Promise<CorridaUpdateStatusUseCaseResponse> {
        try {
            let { id, status } = updateCorridaEndsAtPayload;

            const corrida = await this.corridasRepository.getById(id);

            if (!corrida) throw new Error(ErrorsMessages.CORRIDA_NOT_FOUND);

            if (corrida.status !== CorridaStatus.CREATED) throw new Error(ErrorsMessages.CAN_NOT_UPDATE_CORRIDA_STATUS);

            const corridaUpdatedStatus = await this.corridasRepository.updateStatus(id, status);

            return { success: true, data: corridaUpdatedStatus };
        } catch (error) {
            throw new Error(error);
        }
    }
}
