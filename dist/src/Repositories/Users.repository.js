"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const Database_1 = require("../Utils/Database");
let UsersRepository = class UsersRepository {
    constructor(database) {
        this.database = database;
    }
    async getByRoleToken(roleToken) {
        return await this.database.user.findUnique({
            where: {
                role_token: roleToken,
            },
        });
    }
    async findById(userId) {
        return (await this.database.user.findUnique({
            where: {
                id: userId,
            },
        }))
            ? true
            : false;
    }
    async findByEmail(email) {
        return (await this.database.user.findUnique({
            where: {
                email,
            },
        }))
            ? true
            : false;
    }
    async getByEmail(email) {
        try {
            return await this.database.user.findUnique({
                where: {
                    email,
                },
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getById(userId) {
        try {
            return await this.database.user.findUnique({
                where: {
                    id: userId,
                },
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async create(newUser) {
        try {
            return await this.database.user.create({
                data: {
                    username: newUser.username,
                    role: newUser.role,
                    role_token: newUser.role_token,
                    email: newUser.email,
                    password: newUser.password,
                    jwt_token: newUser.jwt_token,
                },
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async deleteByEmail(email) {
        await this.database.user.delete({
            where: {
                email,
            },
        });
    }
    async logout(userId) {
        await this.database.user.update({
            where: {
                id: userId,
            },
            data: {
                jwt_token: null,
            },
        });
    }
};
UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Database_1.Database])
], UsersRepository);
exports.default = UsersRepository;
//# sourceMappingURL=Users.repository.js.map