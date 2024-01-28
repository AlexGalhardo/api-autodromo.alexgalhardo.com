import { Corrida } from "@prisma/client";
import { CorridasRepositoryPort } from "src/Repositories/Corridas.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import Validator from "src/Utils/Validator";

interface CorridaUpdateEndsAtUseCaseResponse {
    success: boolean;
    data?: Corrida;
}

export interface CorridaUpdateEndsAtDTO {
    id: string;
    ends_at: string | Date;
}

export interface CorridaUpdateEndsAtUseCasePort {
    execute(corridaUpdateEndsAtPayload: CorridaUpdateEndsAtDTO): Promise<CorridaUpdateEndsAtUseCaseResponse>;
}

export default class CorridaUpdateEndsAtUseCase implements CorridaUpdateEndsAtUseCasePort {
    constructor(private readonly corridasRepository: CorridasRepositoryPort) {}

    async execute(corridaUpdateEndsAtPayload: CorridaUpdateEndsAtDTO): Promise<CorridaUpdateEndsAtUseCaseResponse> {
        try {
            let { id, ends_at } = corridaUpdateEndsAtPayload;

            ends_at = Validator.dateTime.stringToDefaultDate(String(ends_at));

            const corrida = await this.corridasRepository.getById(id);

            if (!corrida) throw new Error(ErrorsMessages.CORRIDA_NOT_FOUND);

            if (ends_at.getTime() <= corrida.starts_at.getTime())
                throw new Error(ErrorsMessages.ENDS_AT_MUST_BE_GREATER_THAN_REGISTERED_STARTS_AT);

            const corridaUpdatedEndsAt = await this.corridasRepository.updateEndsAt(id, ends_at);

            return { success: true, data: corridaUpdatedEndsAt };
        } catch (error) {
            throw new Error(error);
        }
    }
}
