import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UserModule } from "./Modules/User.module";
import { KartModule } from "./Modules/Kart.module";
import { RoadModule } from "./Modules/Road.module";
import { HealthCheckModule } from "./Modules/HealthCheck.module";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "./Modules/Schedule.module";
import { ValidateJWTTokenRoleIsValid } from "./MIddlewares/ValidateJWTTokenRoleIsValid.middleware";
import { RaceModule } from "./Modules/Race.module";
import { MaintenanceModule } from "./Modules/Maintenance.module";
import { ValidateJWTTokenRoleAffiliate } from "./MIddlewares/ValidateJWTTokenRoleAffiliate.middleware";
import { ValidateJWTTokenRoleManager } from "./MIddlewares/ValidateJWTTokenRoleManager.middleware";
import { ValidateJWTTokenRoleManagerOrAffiliate } from "./MIddlewares/ValidateJWTTokenRoleManagerOrAffiliate.middleware";

@Module({
    imports: [
        HealthCheckModule,
        UserModule,
        KartModule,
        RoadModule,
        ScheduleModule,
        RaceModule,
        MaintenanceModule,
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
                { path: "/race/all", method: RequestMethod.GET },
                { path: "/user/all", method: RequestMethod.GET },
                { path: "/kart/all", method: RequestMethod.GET },
                { path: "/road/all", method: RequestMethod.GET },
                { path: "/maintenance/all", method: RequestMethod.GET },
                { path: "/notification/all", method: RequestMethod.GET },
                { path: "/user/:user_id", method: RequestMethod.DELETE },
            )

            .apply(ValidateJWTTokenRoleAffiliate)
            .forRoutes({ path: "/schedule", method: RequestMethod.POST })

            .apply(ValidateJWTTokenRoleManagerOrAffiliate)
            .forRoutes({ path: "/schedule/all", method: RequestMethod.GET })

            .apply(ValidateJWTTokenRoleIsValid)
            .forRoutes(
                { path: "/user/check-logged-in", method: RequestMethod.POST },
                { path: "/race", method: RequestMethod.POST },
                { path: "/race/history", method: RequestMethod.GET },
                { path: "/race/ends-at", method: RequestMethod.PATCH },
                { path: "/race/status", method: RequestMethod.PATCH },
            );
    }
}
