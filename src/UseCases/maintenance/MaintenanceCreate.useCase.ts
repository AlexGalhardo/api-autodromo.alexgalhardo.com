import { Maintenance } from "@prisma/client";
import { RacesRepositoryPort } from "src/Repositories/Races.repository";
import { KartsRepositoryPort } from "src/Repositories/Karts.repository";
import { MaintenanceCreateDTO, maintenancesRepositoryPort } from "src/Repositories/Maintenances.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import Validator from "src/Utils/Validator";

interface MaintenanceCreateUseCaseResponse {
    success: boolean;
    data?: Maintenance;
}

export interface MaintenanceCreateUseCasePort {
    execute(maintenanceCreatePayload: MaintenanceCreateDTO): Promise<MaintenanceCreateUseCaseResponse>;
}

export default class MaintenanceCreateUseCase implements MaintenanceCreateUseCasePort {
    constructor(
        private readonly maintenancesRepository: maintenancesRepositoryPort,
        private readonly kartsRepository: KartsRepositoryPort,
        private readonly racesRepository: RacesRepositoryPort,
    ) {}

    async execute(maintenanceCreatePayload: MaintenanceCreateDTO): Promise<MaintenanceCreateUseCaseResponse> {
        try {
            let { kart_id, reason, starts_at, ends_at } = maintenanceCreatePayload;

            const kartFound = await this.kartsRepository.getById(kart_id);

            if (!kartFound) throw new Error(ErrorsMessages.KART_NOT_FOUND);

            starts_at = Validator.dateTime.stringToDefaultDate(String(starts_at));
            ends_at = Validator.dateTime.stringToDefaultDate(String(ends_at));

            const kartIsInMaintenance = await this.maintenancesRepository.inMaintenance(
                kartFound.id,
                starts_at,
                ends_at,
            );

            if (kartIsInMaintenance) throw new Error(ErrorsMessages.KART_IS_IN_MAINTENANCE);

            const kartIsInRace = await this.racesRepository.inRace(kartFound.id, starts_at, ends_at);

            if (kartIsInRace) throw new Error(ErrorsMessages.KART_IS_IN_RACE);

            const maintenanceCreated = await this.maintenancesRepository.create({
                kart_id,
                reason,
                starts_at,
                ends_at,
            });

            return { success: true, data: maintenanceCreated };
        } catch (error) {
            throw new Error(error);
        }
    }
}
