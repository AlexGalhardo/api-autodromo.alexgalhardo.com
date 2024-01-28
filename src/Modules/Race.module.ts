import { Module } from "@nestjs/common";
import CorridaController from "src/Controllers/Race.controller";
import racesRepository, { racesRepositoryPort } from "src/Repositories/Races.repository";
import KartsRepository, { KartsRepositoryPort } from "src/Repositories/Karts.repository";
import PistasRepository, { RoadsRepositoryPort } from "src/Repositories/Roads.repository";
import UsersRepository, { UsersRepositoryPort } from "src/Repositories/Users.repository";
import RaceCreateUseCase from "src/UseCases/race/RaceCreate.useCase";
import CorridaGetHistoricoUseCase from "src/UseCases/race/RaceGetHistorico.useCase";
import RaceUpdateEndsAtUseCase from "src/UseCases/race/RaceUpdateEndsAt.useCase";
import RaceUpdateStatusUseCase from "src/UseCases/race/RaceUpdateStatus.useCase";
import { Database } from "src/Utils/Database";

@Module({
    controllers: [CorridaController],
    providers: [
        Database,
        {
            provide: "racesRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new racesRepository(database);
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
                return new PistasRepository(database);
            },
        },
        {
            provide: "RaceCreateUseCasePort",
            inject: ["racesRepositoryPort", "KartsRepositoryPort", "RoadsRepositoryPort"],
            useFactory: (
                racesRepository: racesRepositoryPort,
                kartsRepository: KartsRepositoryPort,
                roadsRepository: RoadsRepositoryPort,
            ) => {
                return new RaceCreateUseCase(racesRepository, kartsRepository, roadsRepository);
            },
        },
        {
            provide: "RaceGetHistoricoUseCasePort",
            inject: ["racesRepositoryPort", "UsersRepositoryPort"],
            useFactory: (racesRepository: racesRepositoryPort, usersRepository: UsersRepositoryPort) => {
                return new CorridaGetHistoricoUseCase(racesRepository, usersRepository);
            },
        },
        {
            provide: "RaceUpdateEndsAtUseCasePort",
            inject: ["racesRepositoryPort"],
            useFactory: (racesRepository: racesRepositoryPort) => {
                return new RaceUpdateEndsAtUseCase(racesRepository);
            },
        },
        {
            provide: "RaceUpdateStatusUseCasePort",
            inject: ["racesRepositoryPort"],
            useFactory: (racesRepository: racesRepositoryPort) => {
                return new RaceUpdateStatusUseCase(racesRepository);
            },
        },
    ],
})
export class CorridaModule {}
