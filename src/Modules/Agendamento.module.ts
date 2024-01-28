import { Module } from "@nestjs/common";
import { AgendamentoController } from "src/Controllers/Agendamento.controller";
import AgendamentosRepository, { AgendamentosRepositoryPort } from "src/Repositories/Agendamentos.repository";
import KartsRepository, { KartsRepositoryPort } from "src/Repositories/Karts.repository";
import PistasRepository, { PistasRepositoryPort } from "src/Repositories/Pistas.repository";
import AgendamentoCreateUseCase from "src/UseCases/agendamento/AgendamentoCreate.useCase";
import KartCreateUseCase from "src/UseCases/kart/KartCreate.useCase";
import { Database } from "src/Utils/Database";

@Module({
    controllers: [AgendamentoController],
    providers: [
        Database,
        {
            provide: "AgendamentosRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new AgendamentosRepository(database);
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
            provide: "PistasRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new PistasRepository(database);
            },
        },
        {
            provide: "KartCreateUseCasePornpmt",
            inject: ["KartsRepositoryPort"],
            useFactory: (kartsRepository: KartsRepositoryPort) => {
                return new KartCreateUseCase(kartsRepository);
            },
        },
        {
            provide: "AgendamentoCreateUseCasePort",
            inject: ["AgendamentosRepositoryPort", "KartsRepositoryPort", "PistasRepositoryPort"],
            useFactory: (
                agendamentosRepository: AgendamentosRepositoryPort,
                kartsRepository: KartsRepositoryPort,
                pistasRepository: PistasRepositoryPort,
            ) => {
                return new AgendamentoCreateUseCase(agendamentosRepository, kartsRepository, pistasRepository);
            },
        },
    ],
})
export class AgendamentoModule {}
