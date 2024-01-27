import { Module } from "@nestjs/common";
import { PistaController } from "src/Controllers/Pista.controller";
import UsersRepository from "src/Repositories/Users.repository";
import { Database } from "src/Utils/Database";

@Module({
    controllers: [PistaController],
    providers: [
        Database,
        {
            provide: "UsersRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new UsersRepository(database);
            },
        }
    ],
})
export class PistaModule {}
