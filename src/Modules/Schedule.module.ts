import { Module } from "@nestjs/common";
import ScheduleController from "src/Controllers/Schedule.controller";
import SchedulesRepository, { SchedulesRepositoryPort } from "src/Repositories/Schedules.repository";
import KartsRepository, { KartsRepositoryPort } from "src/Repositories/Karts.repository";
import RoadsRepository, { RoadsRepositoryPort } from "src/Repositories/Roads.repository";
import ScheduleCreateUseCase from "src/UseCases/schedule/ScheduleCreate.useCase";
import { Database } from "src/Utils/Database";
import ScheduleGetAllUseCase from "src/UseCases/schedule/ScheduleGetAll.useCase";
import UsersRepository, { UsersRepositoryPort } from "src/Repositories/Users.repository";

@Module({
    controllers: [ScheduleController],
    providers: [
        Database,
        {
            provide: "SchedulesRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new SchedulesRepository(database);
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
            provide: "UsersRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new UsersRepository(database);
            },
        },
        {
            provide: "ScheduleGetAllUseCasePort",
            inject: ["SchedulesRepositoryPort", "UsersRepositoryPort"],
            useFactory: (schedulesRepository: SchedulesRepositoryPort, usersRepository: UsersRepositoryPort) => {
                return new ScheduleGetAllUseCase(schedulesRepository, usersRepository);
            },
        },
        {
            provide: "ScheduleCreateUseCasePort",
            inject: ["SchedulesRepositoryPort", "KartsRepositoryPort", "RoadsRepositoryPort"],
            useFactory: (
                schedulesRepository: SchedulesRepositoryPort,
                kartsRepository: KartsRepositoryPort,
                roadsRepository: RoadsRepositoryPort,
            ) => {
                return new ScheduleCreateUseCase(schedulesRepository, kartsRepository, roadsRepository);
            },
        },
    ],
})
export class ScheduleModule {}
