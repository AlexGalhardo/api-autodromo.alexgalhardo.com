import { Module } from "@nestjs/common";
import RoadController from "src/Controllers/Road.controller";
import RoadsRepository, { RoadsRepositoryPort } from "src/Repositories/Roads.repository";
import UsersRepository, { UsersRepositoryPort } from "src/Repositories/Users.repository";
import RoadCreateUseCase from "src/UseCases/road/RoadCreate.useCase";
import RoadGetAllUseCase from "src/UseCases/road/RoadGetAll.useCase";
import { Database } from "src/Utils/Database";

@Module({
    controllers: [RoadController],
    providers: [
        Database,
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
            provide: "RoadGetAllUseCasePort",
            inject: ["UsersRepositoryPort", "RoadsRepositoryPort"],
            useFactory: (usersRepository: UsersRepositoryPort, roadsRepository: RoadsRepositoryPort) => {
                return new RoadGetAllUseCase(usersRepository, roadsRepository);
            },
        },
        {
            provide: "RoadCreateUseCasePort",
            inject: ["RoadsRepositoryPort"],
            useFactory: (roadsRepository: RoadsRepositoryPort) => {
                return new RoadCreateUseCase(roadsRepository);
            },
        },
    ],
})
export class RoadModule {}
