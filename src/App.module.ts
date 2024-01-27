import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UserModule } from "./Modules/User.module";
import { KartModule } from "./Modules/Kart.module";
import { PistaModule } from "./Modules/Pista.module";
import { HealthCheckModule } from "./Modules/HealthCheck.module";
import { ConfigModule } from "@nestjs/config";
import { ValidateToken } from "./MIddlewares/ValidateToken.middleware";

@Module({
    imports: [
        HealthCheckModule,
        UserModule,
        KartModule,
        PistaModule,
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ValidateToken)
            .forRoutes(
				{ path: "/user", method: RequestMethod.POST },
				{ path: "/kart", method: RequestMethod.POST },
				{ path: "/pista", method: RequestMethod.POST },
                { path: "/user/check-user-jwt-token", method: RequestMethod.POST },
                { path: "/user/logout", method: RequestMethod.POST },
            );
    }
}
