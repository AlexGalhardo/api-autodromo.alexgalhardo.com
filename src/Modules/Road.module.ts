import { Module } from "@nestjs/common";
import RoadController from "src/Controllers/Road.controller";
import RoadsRepository, { RoadsRepositoryPort } from "src/Repositories/Roads.repository";
import RoadCreateUseCase from "src/UseCases/road/RoadCreate.useCase";
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
            provide: "RoadCreateUseCasePort",
            inject: ["RoadsRepositoryPort"],
            useFactory: (roadsRepository: RoadsRepositoryPort) => {
                return new RoadCreateUseCase(roadsRepository);
            },
        },
    ],
})
export class RoadModule {}
