import { Module } from "@nestjs/common";
import { PistaController } from "src/Controllers/Pista.controller";
import PistasRepository, { PistasRepositoryPort } from "src/Repositories/Pistas.repository";
import PistaCreateUseCase from "src/UseCases/pista/PistaCreate.useCase";
import { Database } from "src/Utils/Database";

@Module({
    controllers: [PistaController],
    providers: [
        Database,
        {
            provide: "PistasRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new PistasRepository(database);
            },
        },
        {
            provide: "PistaCreateUseCasePort",
            inject: ["PistasRepositoryPort"],
            useFactory: (pistasRepository: PistasRepositoryPort) => {
                return new PistaCreateUseCase(pistasRepository);
            },
        },
    ],
})
export class PistaModule {}
