"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const User_module_1 = require("./Modules/User.module");
const Kart_module_1 = require("./Modules/Kart.module");
const Road_module_1 = require("./Modules/Road.module");
const HealthCheck_module_1 = require("./Modules/HealthCheck.module");
const config_1 = require("@nestjs/config");
const Schedule_module_1 = require("./Modules/Schedule.module");
const ValidateJWTTokenRoleIsValid_middleware_1 = require("./MIddlewares/ValidateJWTTokenRoleIsValid.middleware");
const Race_module_1 = require("./Modules/Race.module");
const Maintenance_module_1 = require("./Modules/Maintenance.module");
const ValidateJWTTokenRoleAffiliate_middleware_1 = require("./MIddlewares/ValidateJWTTokenRoleAffiliate.middleware");
const ValidateJWTTokenRoleManager_middleware_1 = require("./MIddlewares/ValidateJWTTokenRoleManager.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(ValidateJWTTokenRoleManager_middleware_1.ValidateJWTTokenRoleManager)
            .forRoutes({ path: "/user", method: common_1.RequestMethod.POST }, { path: "/kart", method: common_1.RequestMethod.POST }, { path: "/road", method: common_1.RequestMethod.POST })
            .apply(ValidateJWTTokenRoleAffiliate_middleware_1.ValidateJWTTokenRoleAffiliate)
            .forRoutes({ path: "/schedule", method: common_1.RequestMethod.POST })
            .apply(ValidateJWTTokenRoleIsValid_middleware_1.ValidateJWTTokenRoleIsValid)
            .forRoutes({ path: "/user/check-logged-in", method: common_1.RequestMethod.POST }, { path: "/race", method: common_1.RequestMethod.POST }, { path: "/race/history", method: common_1.RequestMethod.GET }, { path: "/race/ends-at", method: common_1.RequestMethod.PATCH }, { path: "/race/status", method: common_1.RequestMethod.PATCH });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            HealthCheck_module_1.HealthCheckModule,
            User_module_1.UserModule,
            Kart_module_1.KartModule,
            Road_module_1.RoadModule,
            Schedule_module_1.ScheduleModule,
            Race_module_1.RaceModule,
            Maintenance_module_1.MaintenanceModule,
            config_1.ConfigModule.forRoot({ isGlobal: true }),
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=App.module.js.map