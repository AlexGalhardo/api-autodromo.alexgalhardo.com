import { Injectable } from "@nestjs/common";
import { Maintenance } from "@prisma/client";
import { Database } from "src/Utils/Database";

export interface MaintenanceCreateDTO {
    kart_id: string;
    reason: string;
    starts_at: string | Date;
    ends_at: string | Date;
}

export interface maintenancesRepositoryPort {
    create(newManutencao: MaintenanceCreateDTO): Promise<Maintenance>;
    inMaintenance(kartId: string, startAt: Date, endsAt: Date): Promise<boolean>;
}

@Injectable()
export default class maintenancesRepository implements maintenancesRepositoryPort {
    constructor(private readonly database: Database) {}

    public async inMaintenance(kartId: string, startAt: Date, endsAt: Date): Promise<boolean> {
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

    public async create(newManutencao: MaintenanceCreateDTO): Promise<Maintenance> {
        try {
            const { kart_id, reason, starts_at, ends_at } = newManutencao;

            return await this.database.maintenance.create({
                data: {
                    kart_id,
                    reason,
                    starts_at,
                    ends_at,
                },
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}
