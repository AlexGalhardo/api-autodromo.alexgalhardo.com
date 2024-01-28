import { Injectable } from "@nestjs/common";
import { Kart, KartStatus } from "@prisma/client";
import { Database } from "src/Utils/Database";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface newKartCreateDTO {
    status: KartStatus;
    name: string;
    marca: string;
    modelo: string;
    potencia: number;
    marca_pneus: string;
}

export interface KartsRepositoryPort {
    findByName(name: string): Promise<boolean>;
    isAvailable(kartId: string, starts_at: Date, ends_at: Date): Promise<boolean>;
    create(newKart: newKartCreateDTO): Promise<Kart>;
}

@Injectable()
export default class KartsRepository implements KartsRepositoryPort {
    constructor(private readonly database: Database) {}

    public async findByName(name: string): Promise<boolean> {
        return (await this.database.kart.findUnique({
            where: {
                name,
            },
        }))
            ? true
            : false;
    }

    public async isAvailable(kartId: string, starts_at: Date, ends_at: Date): Promise<boolean> {
        const kart = await this.database.kart.findUnique({
            where: { id: kartId },
        });

        if (!kart) throw new Error(ErrorsMessages.KART_NOT_FOUND);

        if (kart && kart.status !== KartStatus.LIVRE) return false;

        const entitiesToCheck = ["manutencao", "corrida", "agendamento"];

        for (const entity of entitiesToCheck) {
            const isEntityAvailable = await this.database[entity].findFirst({
                where: {
                    kart_id: kartId,
                    starts_at: { lte: ends_at },
                    ends_at: { gte: starts_at },
                },
            });

            if (isEntityAvailable) return false;
        }

        return true;
    }

    public async create(newKart: newKartCreateDTO): Promise<Kart> {
        try {
            const { status, name, marca, modelo, potencia, marca_pneus } = newKart;

            return await this.database.kart.create({
                data: {
                    status,
                    name,
                    marca,
                    modelo,
                    potencia,
                    marca_pneus,
                },
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}
