import { Module } from "@nestjs/common";
import { KartController } from "src/Controllers/KartController";
import KartsRepository, { KartsRepositoryPort } from "src/Repositories/Karts.repository";
import KartCreateUseCase from "src/UseCases/kart/KartCreate.useCase";
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
            provide: "KartCreateUseCasePort",
            inject: ["KartsRepositoryPort"],
            useFactory: (kartsRepository: KartsRepositoryPort) => {
                return new KartCreateUseCase(kartsRepository);
            },
        },
	]
})
export class KartModule {}
