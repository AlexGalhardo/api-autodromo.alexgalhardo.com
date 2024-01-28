import { Injectable } from "@nestjs/common";
import { Road } from "@prisma/client";
import { Database } from "src/Utils/Database";

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
    create(newPista: newRoadCreateDTO): Promise<Road>;
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

    public async create(newPista: newRoadCreateDTO): Promise<Road> {
        try {
            const { name, kilometers, quantity_boxes, quantity_places, address } = newPista;

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
