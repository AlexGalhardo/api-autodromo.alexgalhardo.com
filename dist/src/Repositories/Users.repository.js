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
    async getAll() {
        try {
            return await this.database.user.findMany();
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getByRoleToken(roleToken) {
        return await this.database.user.findUnique({
            where: {
                role_token: roleToken,
            },
        });
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
    async getById(id) {
        try {
            return await this.database.user.findUnique({
                where: {
                    id,
                },
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async create({ name, role, role_token, email, password, jwt_token, }) {
        try {
            return await this.database.user.create({
                data: {
                    name,
                    role,
                    role_token,
                    email,
                    password,
                    jwt_token,
                },
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async delete(id) {
        return await this.database.user.delete({
            where: {
                id,
            },
        });
    }
    async logout(id) {
        await this.database.user.update({
            where: {
                id,
            },
            data: {
                jwt_token: null,
            },
        });
    }
    async updateJwtToken(id, jwt_token) {
        try {
            return await this.database.user.update({
                where: {
                    id,
                },
                data: {
                    jwt_token,
                },
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
};
UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Database_1.Database])
], UsersRepository);
exports.default = UsersRepository;
//# sourceMappingURL=Users.repository.js.map