import { Module } from "@nestjs/common";
import { CorridaController } from "src/Controllers/Corridas.controller";
import CorridasRepository, { CorridasRepositoryPort } from "src/Repositories/Corridas.repository";
import UsersRepository, { UsersRepositoryPort } from "src/Repositories/Users.repository";
import CorridaCreateUseCase from "src/UseCases/corrida/CorridaCreate.useCase";
import CorridaGetHistoricoUseCase from "src/UseCases/corrida/CorridaGetHistorico.useCase";
import { Database } from "src/Utils/Database";

@Module({
    controllers: [CorridaController],
    providers: [
        Database,
        {
            provide: "CorridasRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new CorridasRepository(database);
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
            provide: "CorridaCreateUseCasePort",
            inject: ["CorridasRepositoryPort"],
            useFactory: (corridasRepository: CorridasRepositoryPort) => {
                return new CorridaCreateUseCase(corridasRepository);
            },
        },
        {
            provide: "CorridaGetHistoricoUseCasePort",
            inject: ["CorridasRepositoryPort", "UsersRepositoryPort"],
            useFactory: (corridasRepository: CorridasRepositoryPort, usersRepository: UsersRepositoryPort) => {
                return new CorridaGetHistoricoUseCase(corridasRepository, usersRepository);
            },
        },
    ],
})
export class CorridaModule {}
