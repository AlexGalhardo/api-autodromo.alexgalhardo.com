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
const Pista_module_1 = require("./Modules/Pista.module");
const HealthCheck_module_1 = require("./Modules/HealthCheck.module");
const config_1 = require("@nestjs/config");
const ValidateJWTTokenRoleGestor_middleware_1 = require("./MIddlewares/ValidateJWTTokenRoleGestor.middleware");
const ValidateJWTTokenRoleAfiliado_middleware_1 = require("./MIddlewares/ValidateJWTTokenRoleAfiliado.middleware");
const Agendamento_module_1 = require("./Modules/Agendamento.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(ValidateJWTTokenRoleGestor_middleware_1.ValidateJWTTokenRoleGestor)
            .forRoutes({ path: "/user", method: common_1.RequestMethod.POST }, { path: "/kart", method: common_1.RequestMethod.POST }, { path: "/pista", method: common_1.RequestMethod.POST })
            .apply(ValidateJWTTokenRoleAfiliado_middleware_1.ValidateJWTTokenRoleAfiliado)
            .forRoutes({ path: "/agendamento", method: common_1.RequestMethod.POST });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            HealthCheck_module_1.HealthCheckModule,
            User_module_1.UserModule,
            Kart_module_1.KartModule,
            Pista_module_1.PistaModule,
            Agendamento_module_1.AgendamentoModule,
            config_1.ConfigModule.forRoot({ isGlobal: true }),
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=App.module.js.map