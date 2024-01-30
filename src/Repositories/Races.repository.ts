import { Injectable } from "@nestjs/common";
import { Race, RaceStatus } from "@prisma/client";
import { Database } from "src/Utils/Database";

interface newRaceCreateDTO {
    user_id: string;
    kart_id: string;
    road_id: string;
    starts_at: Date;
    had_an_schedule_during_this_period: boolean;
}

export interface RacesRepositoryPort {
    inRace(kartId: string, startAt: Date, endsAt: Date): Promise<boolean>;
    getById(raceId: string): Promise<Race>;
    getHistory(userId: string): Promise<Race[]>;
    create(newRace: newRaceCreateDTO): Promise<Race>;
    hadAnScheduleDuringThisPeriod(userId: string, pistaId: string, startsAt: Date): Promise<boolean>;
    thereIsARaceAlreadyCreatedDuringThisPeriod(pistaId: string, startsAt: Date): Promise<boolean>;
    updateEndsAt(raceId: string, endsAt: Date): Promise<Race>;
    updateStatus(raceId: string, status: RaceStatus): Promise<Race>;
}

@Injectable()
export default class RacesRepository implements RacesRepositoryPort {
    constructor(private readonly database: Database) {}

    public async inRace(kartId: string, startAt: Date, endsAt: Date): Promise<boolean> {
        return (await this.database.maintenance.findFirst({
            where: {
                kart_id: kartId,
                starts_at: { lte: endsAt },
                ends_at: { gte: startAt },
            },
        }))
            ? true
            : false;
    }

    public async getById(raceId: string): Promise<Race> {
        return await this.database.race.findUnique({
            where: {
                id: raceId,
            },
        });
    }

    public async getHistory(userId: string): Promise<Race[]> {
        return await this.database.race.findMany({
            where: {
                user_id: userId,
            },
        });
    }

    public async create(newRace: newRaceCreateDTO): Promise<Race> {
        try {
            const { user_id, kart_id, road_id, starts_at, had_an_schedule_during_this_period } = newRace;

            return await this.database.race.create({
                data: {
                    user_id,
                    kart_id,
                    road_id,
                    starts_at,
                    ends_at: null,
                    had_an_schedule_during_this_period,
                    status: RaceStatus.CREATED,
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

    public async updateEndsAt(raceId: string, endsAt: Date): Promise<Race> {
        try {
            return await this.database.race.update({
                where: {
                    id: raceId,
                },
                data: {
                    ends_at: endsAt,
                },
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async updateStatus(raceId: string, status: RaceStatus): Promise<Race> {
        try {
            return await this.database.race.update({
                where: {
                    id: raceId,
                },
                data: {
                    status,
                },
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async hadAnScheduleDuringThisPeriod(userId: string, pistaId: string, startsAt: Date): Promise<boolean> {
        return (await this.database.schedule.findFirst({
            where: {
                user_id: userId,
                road_id: pistaId,
                starts_at: startsAt,
            },
        }))
            ? true
            : false;
    }

    public async thereIsARaceAlreadyCreatedDuringThisPeriod(pistaId: string, startsAt: Date): Promise<boolean> {
        // estou partindo do princípio que a criação da corrida tem que levar no mínimo/máximo 60 minutos
        // ou seja, se alguém tentar criar uma corrida as 15:45, mas já existe uma uma corrida marcada para começar as 16:30h
        // essa corrida não vai ser possível ser criada, porque vai ter conflito de uso na mesma road

        const startsAtMinus60Minutes = new Date(startsAt.getTime() - 60 * 60000);
        const endsAtPlus60Minutes = new Date(startsAt.getTime() + 60 * 60000);

        return (await this.database.race.findFirst({
            where: {
                road_id: pistaId,
                status: RaceStatus.CREATED,
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
