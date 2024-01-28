import { Module } from "@nestjs/common";
import PistaController from "src/Controllers/Road.controller";
import PistasRepository, { RoadsRepositoryPort } from "src/Repositories/Roads.repository";
import RoadCreateUseCase from "src/UseCases/road/RoadCreate.useCase";
import { Database } from "src/Utils/Database";

@Module({
    controllers: [PistaController],
    providers: [
        Database,
        {
            provide: "RoadsRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new PistasRepository(database);
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
export class PistaModule {}
