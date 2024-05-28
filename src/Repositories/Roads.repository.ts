import { Injectable } from "@nestjs/common";
import { Database } from "src/Utils/Database";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import { Road } from "src/config/mongoose";

interface RoadRepositoryCreateDTO {
    name: string;
    kilometers: number;
    quantity_boxes: number;
    quantity_places: number;
    address: string;
}

export interface RoadsRepositoryPort {
    getAll();
    getById(id: string);
    findByName(name: string): Promise<boolean>;
    isAvailable(roadId: string, startsAt: Date, endsAt: Date): Promise<boolean>;
    create(newRoad: RoadRepositoryCreateDTO);
}

@Injectable()
export default class RoadsRepository implements RoadsRepositoryPort {
    constructor(private readonly database: Database) {}

    public async getAll() {
        return await Road.find();
    }

    public async getById(id: string) {
        return await Road.findById(id);
    }

    public async findByName(name: string): Promise<boolean> {
        const road = await Road.findOne({ name });
        return !!road;
    }

    public async isAvailable(roadId: string, startsAt: Date, endsAt: Date): Promise<boolean> {
        const road = await Road.findById(roadId);
        if (!road) throw new Error(ErrorsMessages.ROAD_NOT_FOUND);

        const entitiesToCheck = ["race", "schedule"];

        for (const entity of entitiesToCheck) {
            const isEntityAvailable = await this.database[entity].findOne({
                road_id: roadId,
                starts_at: { $lte: endsAt },
                ends_at: { $gte: startsAt },
            });

            if (isEntityAvailable) return false;
        }

        return true;
    }

    public async create(newRoad: any) {
        try {
            const { name, kilometers, quantity_boxes, quantity_places, address } = newRoad;

            return await Road.create({
                name,
                kilometers,
                quantity_boxes,
                quantity_places,
                address,
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}
