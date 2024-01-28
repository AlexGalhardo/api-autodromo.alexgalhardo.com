import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UserModule } from "./Modules/User.module";
import { KartModule } from "./Modules/Kart.module";
import { PistaModule } from "./Modules/Pista.module";
import { HealthCheckModule } from "./Modules/HealthCheck.module";
import { ConfigModule } from "@nestjs/config";
import { ValidateJWTTokenRoleGestor } from "./MIddlewares/ValidateJWTTokenRoleGestor.middleware";
import { ValidateJWTTokenRoleAfiliado } from "./MIddlewares/ValidateJWTTokenRoleAfiliado.middleware";
import { AgendamentoModule } from "./Modules/Agendamento.module";
import { ValidateJWTTokenRoleIsValid } from "./MIddlewares/ValidateJWTTokenRoleIsValid.middleware";
import { CorridaModule } from "./Modules/Corrida.module";

@Module({
    imports: [
        HealthCheckModule,
        UserModule,
        KartModule,
        PistaModule,
        AgendamentoModule,
        CorridaModule,
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
                { path: "/pista", method: RequestMethod.POST },
            )

            .apply(ValidateJWTTokenRoleAfiliado)
            .forRoutes({ path: "/agendamento", method: RequestMethod.POST })

            .apply(ValidateJWTTokenRoleIsValid)
            .forRoutes(
                { path: "/corrida", method: RequestMethod.POST },
                { path: "/corrida/historico", method: RequestMethod.GET },
            );
    }
}
