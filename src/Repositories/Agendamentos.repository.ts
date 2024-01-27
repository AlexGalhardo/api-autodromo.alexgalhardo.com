import { Injectable } from "@nestjs/common";
import { Agendamento } from "@prisma/client";
import { Database } from "src/Utils/Database";

interface newAgendamentoCreateDTO {
    userId: string;
    kart_id: string;
    pista_id: string;
    starts_at: Date;
    ends_at: Date;
}

export interface AgendamentosRepositoryPort {
    create(newPista: newAgendamentoCreateDTO): Promise<Agendamento>;
}

@Injectable()
export default class AgendamentosRepository implements AgendamentosRepositoryPort {
    constructor(private readonly database: Database) {}

    public async create(newAgendamento: newAgendamentoCreateDTO): Promise<Agendamento> {
        try {
            const { userId, kart_id, pista_id, starts_at, ends_at } = newAgendamento;

            return await this.database.agendamento.create({
                data: {
                    user_id: userId,
                    kart_id,
                    pista_id,
                    starts_at,
                    ends_at,
                },
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}
