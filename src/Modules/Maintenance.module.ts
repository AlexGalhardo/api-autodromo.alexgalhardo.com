import { Module } from "@nestjs/common";
import MaintenanceController from "src/Controllers/Maintenance.controller";
import { racesRepositoryPort } from "src/Repositories/Races.repository";
import KartsRepository, { KartsRepositoryPort } from "src/Repositories/Karts.repository";
import maintenancesRepository from "src/Repositories/Maintenances.repository";
import MaintenanceCreateUseCase from "src/UseCases/maintenance/MaintenanceCreate.useCase";
import { Database } from "src/Utils/Database";

@Module({
    controllers: [MaintenanceController],
    providers: [
        Database,
        {
            provide: "maintenancesRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new maintenancesRepository(database);
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
            provide: "MaintenanceCreateUseCasePort",
            inject: ["maintenancesRepositoryPort", "KartsRepositoryPort"],
            useFactory: (
                maintenancesRepository: maintenancesRepository,
                kartsRepository: KartsRepositoryPort,
                racesRepository: racesRepositoryPort,
            ) => {
                return new MaintenanceCreateUseCase(maintenancesRepository, kartsRepository, racesRepository);
            },
        },
    ],
})
export class ManutencaoModule {}
