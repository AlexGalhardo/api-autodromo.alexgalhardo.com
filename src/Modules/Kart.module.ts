import { Module } from "@nestjs/common";
import { KartController } from "src/Controllers/KartController";

@Module({
    controllers: [KartController],
    providers: [],
})
export class KartModule {}
