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
const ErrorsMessages_1 = require("../Utils/ErrorsMessages");
const DateTime_1 = require("../Utils/DataTypes/DateTime");
const common_1 = require("@nestjs/common");
const Database_1 = require("../Utils/Database");
require("dotenv/config");
let UsersRepository = class UsersRepository {
    constructor(database) {
        this.database = database;
    }
    async findById(userId) {
        return await this.database.users.findUnique({
            where: {
                id: userId,
            },
        }) ? true : false;
    }
    async findByEmail(email) {
        return await this.database.users.findUnique({
            where: {
                email,
            },
        }) ? true : false;
    }
    async getByEmail(email) {
        try {
            return await this.database.users.findUnique({
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
            return await this.database.users.findUnique({
                where: {
                    id: userId,
                },
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getByResetPasswordToken(resetPasswordToken) {
        try {
            return await this.database.users.findFirst({
                where: {
                    reset_password_token: resetPasswordToken,
                },
            });
        }
        catch (error) {
            throw new Error(ErrorsMessages_1.ErrorsMessages.USER_NOT_FOUND);
        }
    }
    async create(user) {
        try {
            await this.database.users.create({
                data: {
                    id: user.id,
                    role: user.role,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    jwt_token: user.jwt_token,
                    reset_password_token: user.reset_password_token,
                    reset_password_token_expires_at: user.reset_password_token_expires_at,
                    created_at: new Date(),
                    updated_at: null,
                },
            });
        }
        catch (error) {
            throw new Error(ErrorsMessages_1.ErrorsMessages.USER_NOT_FOUND);
        }
    }
    async deleteByEmail(email) {
        await this.database.users.delete({
            where: {
                email,
            },
        });
    }
    async logout(userId) {
        await this.database.users.update({
            where: {
                id: userId,
            },
            data: {
                jwt_token: null,
            },
        });
    }
    async saveResetPasswordToken(userId, resetPasswordToken) {
        await this.database.users.update({
            where: {
                id: userId,
            },
            data: {
                reset_password_token: resetPasswordToken,
                reset_password_token_expires_at: String(new Date(new Date().getTime() + 60 * 60 * 1000)),
            },
        });
    }
    async resetPassword(userId, newPassword) {
        const user = await this.database.users.findUnique({
            where: {
                id: userId,
            },
        });
        if (user) {
            if (!DateTime_1.default.isExpired(new Date(user.reset_password_token_expires_at))) {
                await this.database.users.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        password: newPassword,
                        reset_password_token: null,
                        reset_password_token_expires_at: null,
                    },
                });
            }
            else {
                throw new Error(ErrorsMessages_1.ErrorsMessages.RESET_PASSWORD_TOKEN_EXPIRED);
            }
        }
    }
    async findResetPasswordToken(resetPasswordToken) {
        const user = await this.database.users.findFirst({
            where: {
                reset_password_token: resetPasswordToken,
            },
        });
        if (user) {
            if (!DateTime_1.default.isExpired(new Date(user.reset_password_token_expires_at)))
                return true;
        }
        return false;
    }
};
UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Database_1.Database])
], UsersRepository);
exports.default = UsersRepository;
//# sourceMappingURL=Users.repository.js.map