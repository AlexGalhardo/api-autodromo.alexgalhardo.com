import { Corrida } from "@prisma/client";
import Validator from "src/Utils/Validator";
import { CorridasRepositoryPort } from "src/Repositories/Corridas.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface CorridaCreateUseCaseResponse {
    success: boolean;
    data?: Corrida;
}

export interface CorridaCreateDTO {
    kart_id: string;
    pista_id: string;
    starts_at: string | Date;
}

export interface CorridaCreateUseCasePort {
    execute(userId: string, corridaCreatePayload: CorridaCreateDTO): Promise<CorridaCreateUseCaseResponse>;
}

export default class CorridaCreateUseCase implements CorridaCreateUseCasePort {
    constructor(private readonly corridasRepository: CorridasRepositoryPort) {}

    async execute(userId: string, corridaCreatePayload: CorridaCreateDTO): Promise<CorridaCreateUseCaseResponse> {
        try {
            let { kart_id, pista_id, starts_at } = corridaCreatePayload;

            starts_at = Validator.dateTime.stringToDefaultDate(String(starts_at));

            const thereIsARaceAlreadyCreatedDuringThisPeriod =
                await this.corridasRepository.thereIsARaceAlreadyCreatedDuringThisPeriod(pista_id, starts_at);

            if (thereIsARaceAlreadyCreatedDuringThisPeriod)
                throw new Error(ErrorsMessages.THERE_IS_A_RACE_ALREADY_CREATED_DURING_THIS_PERIOD);

            const had_an_agendamento_during_this_period =
                await this.corridasRepository.hadAnAgendamentoDuringThisPeriod(userId, pista_id, starts_at);

            const corridaCreated = await this.corridasRepository.create({
                user_id: userId,
                kart_id,
                pista_id,
                starts_at,
                had_an_agendamento_during_this_period,
            });

            return { success: true, data: corridaCreated };
        } catch (error) {
            throw new Error(error);
        }
    }
}
