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
const Auth_module_1 = require("./Modules/Auth.module");
const Kart_module_1 = require("./Modules/Kart.module");
const Pista_module_1 = require("./Modules/Pista.module");
const HealthCheck_module_1 = require("./Modules/HealthCheck.module");
const config_1 = require("@nestjs/config");
const ValidateToken_middleware_1 = require("./MIddlewares/ValidateToken.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(ValidateToken_middleware_1.ValidateToken)
            .forRoutes({ path: "/check-user-jwt-token", method: common_1.RequestMethod.POST }, { path: "/logout", method: common_1.RequestMethod.POST }, { path: "/profile", method: common_1.RequestMethod.PUT }, { path: "/stripe/create-checkout-session", method: common_1.RequestMethod.POST }, { path: "/stripe/create-portal-session", method: common_1.RequestMethod.POST }, { path: "/games/random", method: common_1.RequestMethod.GET }, { path: "/games/id/:game_id", method: common_1.RequestMethod.GET }, { path: "/games/title/:game_title", method: common_1.RequestMethod.GET });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            HealthCheck_module_1.HealthCheckModule,
            Auth_module_1.AuthModule,
            Kart_module_1.KartModule,
            Pista_module_1.PistaModule,
            config_1.ConfigModule.forRoot({ isGlobal: true }),
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=App.module.js.map