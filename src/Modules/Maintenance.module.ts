import { Module } from "@nestjs/common";
import MaintenanceController from "src/Controllers/Maintenance.controller";
import KartsRepository, { KartsRepositoryPort } from "src/Repositories/Karts.repository";
import MaintenancesRepository from "src/Repositories/Maintenances.repository";
import RacesRepository, { RacesRepositoryPort } from "src/Repositories/Races.repository";
import MaintenanceCreateUseCase from "src/UseCases/maintenance/MaintenanceCreate.useCase";
import { Database } from "src/Utils/Database";

@Module({
    controllers: [MaintenanceController],
    providers: [
        Database,
        {
            provide: "MaintenancesRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new MaintenancesRepository(database);
            },
        },
        {
            provide: "KartsRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new KartsRepository(database);
            },
        },
        {
            provide: "RacesRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new RacesRepository(database);
            },
        },
        {
            provide: "MaintenanceCreateUseCasePort",
            inject: ["MaintenancesRepositoryPort", "KartsRepositoryPort", "RacesRepositoryPort"],
            useFactory: (
                maintenancesRepository: MaintenancesRepository,
                kartsRepository: KartsRepositoryPort,
                racesRepository: RacesRepositoryPort,
            ) => {
                return new MaintenanceCreateUseCase(maintenancesRepository, kartsRepository, racesRepository);
            },
        },
    ],
})
export class MaintenanceModule {}
