import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UserModule } from "./Modules/User.module";
import { KartModule } from "./Modules/Kart.module";
import { PistaModule } from "./Modules/Road.module";
import { HealthCheckModule } from "./Modules/HealthCheck.module";
import { ConfigModule } from "@nestjs/config";
import { AgendamentoModule } from "./Modules/Schedule.module";
import { ValidateJWTTokenRoleIsValid } from "./MIddlewares/ValidateJWTTokenRoleIsValid.middleware";
import { CorridaModule } from "./Modules/Race.module";
import { ManutencaoModule } from "./Modules/Maintenance.module";
import { ValidateJWTTokenRoleAffiliate } from "./MIddlewares/ValidateJWTTokenRoleAffiliate.middleware";
import { ValidateJWTTokenRoleManager } from "./MIddlewares/ValidateJWTTokenRoleManager.middleware";

@Module({
    imports: [
        HealthCheckModule,
        UserModule,
        KartModule,
        PistaModule,
        AgendamentoModule,
        CorridaModule,
        ManutencaoModule,
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ValidateJWTTokenRoleManager)
            .forRoutes(
                { path: "/user", method: RequestMethod.POST },
                { path: "/kart", method: RequestMethod.POST },
                { path: "/road", method: RequestMethod.POST },
            )

            .apply(ValidateJWTTokenRoleAffiliate)
            .forRoutes({ path: "/schedule", method: RequestMethod.POST })

            .apply(ValidateJWTTokenRoleIsValid)
            .forRoutes(
                { path: "/race", method: RequestMethod.POST },
                { path: "/race/history", method: RequestMethod.GET },
                { path: "/race/ends-at", method: RequestMethod.PATCH },
                { path: "/race/status", method: RequestMethod.PATCH },
            );
    }
}
