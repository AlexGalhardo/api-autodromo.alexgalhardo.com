import { Module } from "@nestjs/common";
import RaceController from "src/Controllers/Race.controller";
import KartsRepository, { KartsRepositoryPort } from "src/Repositories/Karts.repository";
import RoadsRepository, { RoadsRepositoryPort } from "src/Repositories/Roads.repository";
import UsersRepository, { UsersRepositoryPort } from "src/Repositories/Users.repository";
import RaceCreateUseCase from "src/UseCases/race/RaceCreate.useCase";
import RaceGetHistoryUseCase from "src/UseCases/race/RaceGetHistory.useCase";
import RaceUpdateEndsAtUseCase from "src/UseCases/race/RaceUpdateEndsAt.useCase";
import RaceUpdateStatusUseCase from "src/UseCases/race/RaceUpdateStatus.useCase";
import { Database } from "src/Utils/Database";
import RacesRepository, { RacesRepositoryPort } from "src/Repositories/Races.repository";

@Module({
    controllers: [RaceController],
    providers: [
        Database,
        {
            provide: "RacesRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new RacesRepository(database);
            },
        },
        {
            provide: "UsersRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new UsersRepository(database);
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
            provide: "RoadsRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new RoadsRepository(database);
            },
        },
        {
            provide: "RaceCreateUseCasePort",
            inject: ["RacesRepositoryPort", "KartsRepositoryPort", "RoadsRepositoryPort"],
            useFactory: (
                racesRepository: RacesRepositoryPort,
                kartsRepository: KartsRepositoryPort,
                roadsRepository: RoadsRepositoryPort,
            ) => {
                return new RaceCreateUseCase(racesRepository, kartsRepository, roadsRepository);
            },
        },
        {
            provide: "RaceGetHistoryUseCasePort",
            inject: ["RacesRepositoryPort", "UsersRepositoryPort"],
            useFactory: (racesRepository: RacesRepositoryPort, usersRepository: UsersRepositoryPort) => {
                return new RaceGetHistoryUseCase(racesRepository, usersRepository);
            },
        },
        {
            provide: "RaceUpdateEndsAtUseCasePort",
            inject: ["RacesRepositoryPort"],
            useFactory: (racesRepository: RacesRepositoryPort) => {
                return new RaceUpdateEndsAtUseCase(racesRepository);
            },
        },
        {
            provide: "RaceUpdateStatusUseCasePort",
            inject: ["RacesRepositoryPort"],
            useFactory: (racesRepository: RacesRepositoryPort) => {
                return new RaceUpdateStatusUseCase(racesRepository);
            },
        },
    ],
})
export class RaceModule {}
