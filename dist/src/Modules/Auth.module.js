"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const User_controller_1 = require("../Controllers/User.controller");
const Users_repository_1 = require("../Repositories/Users.repository");
const AuthLogin_useCase_1 = require("../UseCases/AuthLogin.useCase");
const AuthLogout_useCase_1 = require("../UseCases/AuthLogout.useCase");
const AuthRegister_useCase_1 = require("../UseCases/AuthRegister.useCase");
const Database_1 = require("../Utils/Database");
const AuthCheckUserJWTToken_useCase_1 = require("../UseCases/AuthCheckUserJWTToken.useCase");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        controllers: [User_controller_1.UserController],
        providers: [
            Database_1.Database,
            {
                provide: "UsersRepositoryPort",
                inject: [Database_1.Database],
                useFactory: (database) => {
                    return new Users_repository_1.default(database);
                },
            },
            {
                provide: "AuthLoginUseCasePort",
                inject: ["UsersRepositoryPort"],
                useFactory: (usersRepository) => {
                    return new AuthLogin_useCase_1.default(usersRepository);
                },
            },
            {
                provide: "AuthRegisterUseCasePort",
                inject: ["UsersRepositoryPort"],
                useFactory: (usersRepository) => {
                    return new AuthRegister_useCase_1.default(usersRepository);
                },
            },
            {
                provide: "AuthLogoutUseCasePort",
                inject: ["UsersRepositoryPort"],
                useFactory: (usersRepository) => {
                    return new AuthLogout_useCase_1.default(usersRepository);
                },
            },
            {
                provide: "AuthCheckUserJWTTokenUseCasePort",
                inject: ["UsersRepositoryPort"],
                useFactory: (usersRepository) => {
                    return new AuthCheckUserJWTToken_useCase_1.default(usersRepository);
                },
            }
        ],
    })
], UserModule);
//# sourceMappingURL=Auth.module.js.map