import { Module } from "@nestjs/common";
import KartController from "src/Controllers/Kart.controller";
import KartsRepository, { KartsRepositoryPort } from "src/Repositories/Karts.repository";
import UsersRepository, { UsersRepositoryPort } from "src/Repositories/Users.repository";
import KartCreateUseCase from "src/UseCases/kart/KartCreate.useCase";
import KartGetAllUseCase from "src/UseCases/kart/KartGetAll.useCase";
import { Database } from "src/Utils/Database";

@Module({
    controllers: [KartController],
    providers: [
        Database,
        {
            provide: "KartsRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new KartsRepository(database);
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
            provide: "KartGetAllUseCasePort",
            inject: ["UsersRepositoryPort", "KartsRepositoryPort"],
            useFactory: (usersRepository: UsersRepositoryPort, kartsRepository: KartsRepositoryPort) => {
                return new KartGetAllUseCase(usersRepository, kartsRepository);
            },
        },
        {
            provide: "KartCreateUseCasePort",
            inject: ["KartsRepositoryPort"],
            useFactory: (kartsRepository: KartsRepositoryPort) => {
                return new KartCreateUseCase(kartsRepository);
            },
        },
    ],
})
export class KartModule {}
