import { Injectable } from "@nestjs/common";
import { Database } from "src/Utils/Database";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import { Kart, KartStatus, Maintenance, Race, Schedule } from "src/config/mongoose";

interface KartRepositoryCreateDTO {
    status: KartStatus;
    name: string;
    brand: string;
    model: string;
    power: number;
    tire_brand: string;
}

export interface KartsRepositoryPort {
    getAll();
    getById(id: string);
    findByName(name: string): Promise<boolean>;
    isAvailable(kartId: string, starts_at: Date, ends_at: Date): Promise<boolean>;
    create(newKart: KartRepositoryCreateDTO);
}

@Injectable()
export default class KartsRepository implements KartsRepositoryPort {
    constructor(private readonly database: Database) {}

    public async getAll() {
        try {
            return await Kart.find().exec();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async getById(id: string) {
        try {
            return await Kart.findById(id).exec();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async findByName(name: string): Promise<boolean> {
        try {
            const kart = await Kart.findOne({ name }).exec();
            return !!kart;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async isAvailable(kartId: string, startsAt: Date, endsAt: Date): Promise<boolean> {
        try {
            const kart = await Kart.findById(kartId).exec();
            if (!kart) throw new Error(ErrorsMessages.KART_NOT_FOUND);

            if (kart.status !== KartStatus.AVAILABLE) return false;

            const conditions = {
                kart_id: kartId,
                starts_at: { $lte: endsAt },
                ends_at: { $gte: startsAt },
            };

            const maintenance = await Maintenance.findOne(conditions).exec();
            const race = await Race.findOne(conditions).exec();
            const schedule = await Schedule.findOne(conditions).exec();

            if (maintenance || race || schedule) return false;

            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async create(newKart: KartRepositoryCreateDTO) {
        try {
            const { status, name, brand, model, power, tire_brand } = newKart;

            const kart = new Kart({
                status,
                name,
                brand,
                model,
                power,
                tire_brand,
            });

            return await kart.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
