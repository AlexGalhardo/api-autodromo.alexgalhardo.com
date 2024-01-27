import { Injectable } from "@nestjs/common";
import { Agendamento } from "@prisma/client";
import { Database } from "src/Utils/Database";

interface NewAgendamentoCreateDTO {
    userId: string;
    kart_id: string;
    pista_id: string;
    starts_at: Date;
    ends_at: Date;
}

export interface AgendamentosRepositoryPort {
    create(newPista: NewAgendamentoCreateDTO): Promise<Agendamento>;
}

@Injectable()
export default class AgendamentosRepository implements AgendamentosRepositoryPort {
    constructor(private readonly database: Database) {}

    public async create(newAgendamento: NewAgendamentoCreateDTO): Promise<any> {
        try {
            const { userId, kart_id, pista_id, starts_at, ends_at } = newAgendamento;

            const result = await this.database.agendamento.create({
                data: {
                    user_id: userId,
                    kart_id,
                    pista_id,
                    starts_at,
                    ends_at,
                },
                include: {
                    user: true,
                    kart: true,
                    pista: true,
                },
            });

            return {
                user_id: result.user.id,
                user_name: result.user.name,
                kart_id: result.kart.id,
                kart_name: result.kart.name,
                pista_id: result.pista.id,
                pista_name: result.pista.name,
                starts_at: result.starts_at,
                ends_at: result.ends_at,
            };
        } catch (error) {
            throw new Error(error);
        }
    }
}
