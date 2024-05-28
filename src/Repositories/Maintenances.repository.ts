import { Injectable } from "@nestjs/common";
import { Database } from "src/Utils/Database";
import { Maintenance } from "src/config/mongoose";

export interface MaintenanceCreateDTO {
    kart_id: string;
    reason: string;
    starts_at: string | Date;
    ends_at: string | Date;
}

export interface maintenancesRepositoryPort {
    create(newManutencao: MaintenanceCreateDTO);
    inMaintenance(kartId: string, startAt: Date, endsAt: Date): Promise<boolean>;
}

@Injectable()
export default class maintenancesRepository implements maintenancesRepositoryPort {
    constructor(private readonly database: Database) {}

    public async inMaintenance(kartId: string, startAt: Date, endsAt: Date): Promise<boolean> {
        const maintenance = await Maintenance.findOne({
            kart_id: kartId,
            starts_at: { $lte: endsAt },
            ends_at: { $gte: startAt },
        });
        return !!maintenance;
    }

    public async create(newMaintenance: any) {
        try {
            const { kart_id, reason, starts_at, ends_at } = newMaintenance;

            return await Maintenance.create({
                kart_id,
                reason,
                starts_at,
                ends_at,
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}
