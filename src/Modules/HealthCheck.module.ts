import { Module } from "@nestjs/common";
import HealthCheckController from "src/Controllers/HealthCheck.controller";

@Module({
    controllers: [HealthCheckController],
    providers: [],
})
export class HealthCheckModule {}
