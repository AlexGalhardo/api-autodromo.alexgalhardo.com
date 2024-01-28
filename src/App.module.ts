import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UserModule } from "./Modules/User.module";
import { KartModule } from "./Modules/Kart.module";
import { PistaModule } from "./Modules/Road.module";
import { HealthCheckModule } from "./Modules/HealthCheck.module";
import { ConfigModule } from "@nestjs/config";
import { ValidateJWTTokenRoleGestor } from "./MIddlewares/ValidateJWTTokenRoleGestor.middleware";
import { ValidateJWTTokenRoleAfiliado } from "./MIddlewares/ValidateJWTTokenRoleAfiliado.middleware";
import { AgendamentoModule } from "./Modules/Schedule.module";
import { ValidateJWTTokenRoleIsValid } from "./MIddlewares/ValidateJWTTokenRoleIsValid.middleware";
import { CorridaModule } from "./Modules/Race.module";
import { ManutencaoModule } from "./Modules/Maintenance.module";

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
            .apply(ValidateJWTTokenRoleGestor)
            .forRoutes(
                { path: "/user", method: RequestMethod.POST },
                { path: "/kart", method: RequestMethod.POST },
                { path: "/road", method: RequestMethod.POST },
            )

            .apply(ValidateJWTTokenRoleAfiliado)
            .forRoutes({ path: "/schedule", method: RequestMethod.POST })

            .apply(ValidateJWTTokenRoleIsValid)
            .forRoutes(
                { path: "/corrida", method: RequestMethod.POST },
                { path: "/corrida/historico", method: RequestMethod.GET },
                { path: "/corrida/ends-at", method: RequestMethod.PATCH },
                { path: "/corrida/status", method: RequestMethod.PATCH },
            );
    }
}
