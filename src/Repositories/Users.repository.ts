import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import DateTime from "src/Utils/DataTypes/DateTime";
import { ProfileUpdateDTO } from "src/UseCases/ProfileUpdate.useCase";
import { Bcrypt } from "src/Utils/Bcrypt";
import { Injectable } from "@nestjs/common";
import { Database } from "src/Utils/Database";
import "dotenv/config";
import { SubscriptionName } from "src/UseCases/AuthRegister.useCase";

export interface UsersRepositoryPort {
    findById(userId: string): Promise<boolean>;
    findByEmail(email: string): Promise<boolean>;
    getByEmail(email: string);
    getById(userId: string);
    getByResetPasswordToken(resetPasswordToken: string);
    create(user): Promise<void>;
    deleteByEmail(email: string): Promise<void>;
    logout(userId: string): Promise<void>;
    saveResetPasswordToken(userId: string, resetPasswordToken: string): Promise<void>;
    resetPassword(userId: string, newPassword: string): Promise<void>;
    findResetPasswordToken(resetPasswordToken: string): Promise<boolean>;
}

@Injectable()
export default class UsersRepository implements UsersRepositoryPort {
    constructor(
        private readonly database: Database,
    ) { }

    public async findById(userId: string): Promise<boolean> {
        return await this.database.users.findUnique({
            where: {
                id: userId,
            },
        }) ? true : false;
    }

    public async findByEmail(email: string): Promise<boolean> {
        return await this.database.users.findUnique({
            where: {
                email,
            },
        }) ? true : false
    }

    public async getByEmail(email: string) {
        try {
            return await this.database.users.findUnique({
                where: {
                    email,
                },
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    public async getById(userId: string) {
        try {
            return await this.database.users.findUnique({
                where: {
                    id: userId,
                },
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    public async getByResetPasswordToken(resetPasswordToken: string) {
        try {
			return await this.database.users.findFirst({
				where: {
					reset_password_token: resetPasswordToken,
				},
			});
		} catch (error) {
			throw new Error(ErrorsMessages.USER_NOT_FOUND);
		}
    }

    public async create(user): Promise<void> {
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
			throw new Error(ErrorsMessages.USER_NOT_FOUND);
		}
    }

    public async deleteByEmail(email: string): Promise<void> {
        await this.database.users.delete({
            where: {
                email,
            },
        });
    }

    public async logout(userId: string): Promise<void> {
        await this.database.users.update({
            where: {
                id: userId,
            },
            data: {
                jwt_token: null,
            },
        });
    }

    public async saveResetPasswordToken(userId: string, resetPasswordToken: string): Promise<void> {
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

    public async resetPassword(userId: string, newPassword: string): Promise<void> {
        const user = await this.database.users.findUnique({
            where: {
                id: userId,
            },
        });

        if (user) {
            if (!DateTime.isExpired(new Date(user.reset_password_token_expires_at))) {
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
            } else {
                throw new Error(ErrorsMessages.RESET_PASSWORD_TOKEN_EXPIRED);
            }
        }
    }

    public async findResetPasswordToken(resetPasswordToken: string): Promise<boolean> {
        const user = await this.database.users.findFirst({
            where: {
                reset_password_token: resetPasswordToken,
            },
        });

        if (user) {
            if (!DateTime.isExpired(new Date(user.reset_password_token_expires_at))) return true;
        }
        return false;
    }
}
