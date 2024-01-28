import { Injectable } from "@nestjs/common";
import { Schedule } from "@prisma/client";
import { Database } from "src/Utils/Database";

interface NewAgendamentoCreateDTO {
    userId: string;
    kart_id: string;
    road_id: string;
    starts_at: Date;
    ends_at: Date;
}

export interface SchedulesRepositoryPort {
    create(newRoad: NewAgendamentoCreateDTO): Promise<Schedule>;
}

@Injectable()
export default class SchedulesRepository implements SchedulesRepositoryPort {
    constructor(private readonly database: Database) {}

    public async create(newAgendamento: NewAgendamentoCreateDTO): Promise<any> {
        try {
            const { userId, kart_id, road_id, starts_at, ends_at } = newAgendamento;

            return await this.database.schedule.create({
                data: {
                    user_id: userId,
                    kart_id,
                    road_id,
                    starts_at,
                    ends_at,
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
                    road: {
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
}
