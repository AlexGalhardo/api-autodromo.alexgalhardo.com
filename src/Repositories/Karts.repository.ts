import { Injectable } from "@nestjs/common";
import { Kart, KartStatus } from "@prisma/client";
import { Database } from "src/Utils/Database";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface newKartCreateDTO {
    status: KartStatus;
    name: string;
    brand: string;
    model: string;
    power: number;
    tire_brand: string;
}

export interface KartsRepositoryPort {
    getById(id: string): Promise<Kart>;
    findByName(name: string): Promise<boolean>;
    isAvailable(kartId: string, starts_at: Date, ends_at: Date): Promise<boolean>;
    create(newKart: newKartCreateDTO): Promise<Kart>;
}

@Injectable()
export default class KartsRepository implements KartsRepositoryPort {
    constructor(private readonly database: Database) {}

    public async getById(id: string): Promise<Kart> {
        return await this.database.kart.findUnique({
            where: {
                id,
            },
        });
    }

    public async findByName(name: string): Promise<boolean> {
        return (await this.database.kart.findUnique({
            where: {
                name,
            },
        }))
            ? true
            : false;
    }

    public async isAvailable(kartId: string, startsAt: Date, endsAt: Date): Promise<boolean> {
        const kart = await this.database.kart.findUnique({
            where: { id: kartId },
        });

        if (!kart) throw new Error(ErrorsMessages.KART_NOT_FOUND);

        if (kart && kart.status !== KartStatus.AVAILABLE) return false;

        const entitiesToCheck = ["maintenance", "race", "schedule"];

        for (const entity of entitiesToCheck) {
            const isEntityAvailable = await this.database[entity].findFirst({
                where: {
                    kart_id: kartId,
                    starts_at: { lte: endsAt },
                    ends_at: { gte: startsAt },
                },
            });

            if (isEntityAvailable) return false;
        }

        return true;
    }

    public async create(newKart: newKartCreateDTO): Promise<Kart> {
        try {
            const { status, name, brand, model, power, tire_brand } = newKart;

            return await this.database.kart.create({
                data: {
                    status,
                    name,
                    brand,
                    model,
                    power,
                    tire_brand,
                },
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}
