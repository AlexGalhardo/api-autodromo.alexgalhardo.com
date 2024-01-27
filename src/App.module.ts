import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AuthModule } from "./Modules/Auth.module";
import { KartModule } from "./Modules/Kart.module";
import { PistaModule } from "./Modules/Pista.module";
import { HealthCheckModule } from "./Modules/HealthCheck.module";
import { ConfigModule } from "@nestjs/config";
import { ValidateToken } from "./MIddlewares/ValidateToken.middleware";

@Module({
    imports: [
        HealthCheckModule,
        AuthModule,
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
                { path: "/check-user-jwt-token", method: RequestMethod.POST },
                { path: "/logout", method: RequestMethod.POST },
                { path: "/profile", method: RequestMethod.PUT },
                { path: "/stripe/create-checkout-session", method: RequestMethod.POST },
                { path: "/stripe/create-portal-session", method: RequestMethod.POST },
                { path: "/games/random", method: RequestMethod.GET },
                { path: "/games/id/:game_id", method: RequestMethod.GET },
                { path: "/games/title/:game_title", method: RequestMethod.GET },
            );
    }
}
