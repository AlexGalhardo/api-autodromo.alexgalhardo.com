import { Agendamento } from "@prisma/client";
import { AgendamentosRepositoryPort } from "src/Repositories/Agendamentos.repository";
import { KartsRepositoryPort } from "src/Repositories/Karts.repository";
import { PistasRepositoryPort } from "src/Repositories/Pistas.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import Validator from "src/Utils/Validator";

interface AgendamentoCreateUseCaseResponse {
    success: boolean;
    data?: Agendamento;
}

export interface AgendamentoCreateDTO {
    kart_id: string;
    pista_id: string;
    starts_at: string | Date;
    ends_at: string | Date;
}

export interface AgendamentoCreateUseCasePort {
    execute(userId: string, kartCreatePayload: AgendamentoCreateDTO): Promise<AgendamentoCreateUseCaseResponse>;
}

export default class AgendamentoCreateUseCase implements AgendamentoCreateUseCasePort {
    constructor(
        private readonly agendamentosRepository: AgendamentosRepositoryPort,
        private readonly kartsRepository: KartsRepositoryPort,
        private readonly pistasRepository: PistasRepositoryPort,
    ) {}

    async execute(
        userId: string,
        agendamentoCreatePayload: AgendamentoCreateDTO,
    ): Promise<AgendamentoCreateUseCaseResponse> {
        try {
            let { kart_id, pista_id, starts_at, ends_at } = agendamentoCreatePayload;

            const pistaFound = await this.pistasRepository.getById(pista_id);

            if (!pistaFound) throw new Error(ErrorsMessages.PISTA_NOT_FOUND);

            starts_at = Validator.dateTime.stringToDefaultDate(String(starts_at));
            ends_at = Validator.dateTime.stringToDefaultDate(String(ends_at));

            const kartAvailable = await this.kartsRepository.isAvailable(kart_id, starts_at, ends_at);

            if (!kartAvailable) throw new Error(ErrorsMessages.KART_IS_NOT_AVAILABLE);

            const agendamentoCreated = await this.agendamentosRepository.create({
                userId,
                kart_id,
                pista_id,
                starts_at,
                ends_at,
            });

            return { success: true, data: agendamentoCreated };
        } catch (error) {
            throw new Error(error);
        }
    }
}
