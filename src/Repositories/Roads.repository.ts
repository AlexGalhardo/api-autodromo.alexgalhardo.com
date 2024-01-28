import { Injectable } from "@nestjs/common";
import { Road } from "@prisma/client";
import { Database } from "src/Utils/Database";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface newRoadCreateDTO {
    name: string;
    kilometers: number;
    quantity_boxes: number;
    quantity_places: number;
    address: string;
}

export interface RoadsRepositoryPort {
    getById(id: string): Promise<Road>;
    findByName(name: string): Promise<boolean>;
	isAvailable(roadId: string, startsAt: Date, endsAt: Date): Promise<boolean>;
    create(newRoad: newRoadCreateDTO): Promise<Road>;
}

@Injectable()
export default class PistasRepository implements RoadsRepositoryPort {
    constructor(private readonly database: Database) {}

    public async getById(id: string): Promise<Road> {
        return await this.database.road.findUnique({
            where: {
                id,
            },
        });
    }

    public async findByName(name: string): Promise<boolean> {
        return (await this.database.road.findUnique({
            where: {
                name,
            },
        }))
            ? true
            : false;
    }

	public async isAvailable(roadId: string, startsAt: Date, endsAt: Date): Promise<boolean> {
		const road = await this.database.road.findUnique({
            where: { id: roadId },
        });

        if (!road) throw new Error(ErrorsMessages.ROAD_NOT_FOUND);

        const entitiesToCheck = ["race", "schedule"];

        for (const entity of entitiesToCheck) {
            const isEntityAvailable = await this.database[entity].findFirst({
                where: {
                    road_id: roadId,
                    starts_at: { lte: endsAt },
                    ends_at: { gte: startsAt },
                },
            });

            if (isEntityAvailable) return false;
        }

        return true;
    }

    public async create(newRoad: newRoadCreateDTO): Promise<Road> {
        try {
            const { name, kilometers, quantity_boxes, quantity_places, address } = newRoad;

            return await this.database.road.create({
                data: {
                    name,
                    kilometers,
                    quantity_boxes,
                    quantity_places,
                    address,
                },
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}
