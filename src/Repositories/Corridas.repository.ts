import { Injectable } from "@nestjs/common";
import { Corrida, CorridaStatus } from "@prisma/client";
import { Database } from "src/Utils/Database";

interface newCorridaCreateDTO {
    user_id: string;
    kart_id: string;
    pista_id: string;
    starts_at: Date;
    had_an_agendamento_during_this_period: boolean;
}

export interface CorridasRepositoryPort {
    getById(corridaId: string): Promise<Corrida>;
    getHistorico(userId: string): Promise<Corrida[]>;
    create(newCorrida: newCorridaCreateDTO): Promise<Corrida>;
    hadAnAgendamentoDuringThisPeriod(userId: string, pistaId: string, startsAt: Date): Promise<boolean>;
    thereIsARaceAlreadyCreatedDuringThisPeriod(pistaId: string, startsAt: Date): Promise<boolean>;
    updateEndsAt(corridaId: string, endsAt: Date): Promise<Corrida>;
    updateStatus(corridaId: string, status: CorridaStatus): Promise<Corrida>;
}

@Injectable()
export default class CorridasRepository implements CorridasRepositoryPort {
    constructor(private readonly database: Database) {}

    public async getById(corridaId: string): Promise<Corrida> {
        return await this.database.corrida.findUnique({
            where: {
                id: corridaId,
            },
        });
    }

    public async getHistorico(userId: string): Promise<Corrida[]> {
        return await this.database.corrida.findMany({
            where: {
                user_id: userId,
            },
        });
    }

    public async create(newCorrida: newCorridaCreateDTO): Promise<Corrida> {
        try {
            const { user_id, kart_id, pista_id, starts_at, had_an_agendamento_during_this_period } = newCorrida;

            return await this.database.corrida.create({
                data: {
                    user_id,
                    kart_id,
                    pista_id,
                    starts_at,
                    ends_at: null,
                    had_an_agendamento_during_this_period,
                    status: CorridaStatus.CREATED,
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                    kart: {
                        select: {
                            name: true,
                        },
                    },
                    pista: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    public async updateEndsAt(corridaId: string, endsAt: Date): Promise<Corrida> {
        try {
            return await this.database.corrida.update({
                where: {
                    id: corridaId,
                },
                data: {
                    ends_at: endsAt,
                },
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async updateStatus(corridaId: string, status: CorridaStatus): Promise<Corrida> {
        try {
            return await this.database.corrida.update({
                where: {
                    id: corridaId,
                },
                data: {
                    status,
                },
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async hadAnAgendamentoDuringThisPeriod(userId: string, pistaId: string, startsAt: Date): Promise<boolean> {
        return (await this.database.agendamento.findFirst({
            where: {
                user_id: userId,
                pista_id: pistaId,
                starts_at: startsAt,
            },
        }))
            ? true
            : false;
    }

    public async thereIsARaceAlreadyCreatedDuringThisPeriod(pistaId: string, startsAt: Date): Promise<boolean> {
        // estou partindo do princípio que a criação da corrida tem que levar no mínimo/máximo 60 minutos
        // ou seja, se alguém tentar criar uma corrida as 15:45, mas já existe uma uma corrida marcada para começar as 16:30h
        // essa corrida não vai ser possível ser criada, porque vai ter conflito de uso na mesma pista

        const startsAtMinus60Minutes = new Date(startsAt.getTime() - 60 * 60000);
        const endsAtPlus60Minutes = new Date(startsAt.getTime() + 60 * 60000);

        return (await this.database.corrida.findFirst({
            where: {
                pista_id: pistaId,
                status: CorridaStatus.CREATED,
                ends_at: null,
                starts_at: {
                    gte: startsAtMinus60Minutes,
                    lte: endsAtPlus60Minutes,
                },
            },
        }))
            ? true
            : false;
    }
}
