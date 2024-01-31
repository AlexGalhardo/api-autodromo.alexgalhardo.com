import { Injectable } from "@nestjs/common";
import { Database } from "src/Utils/Database";
import { User, UserRole } from "@prisma/client";

interface newUserCreateDTO {
    name: string;
    role: UserRole;
    role_token: string;
    email: string;
    password: string;
    jwt_token: string;
}

export interface UsersRepositoryPort {
    getAll(): Promise<User[]>;
    getByRoleToken(roleToken: string): Promise<User>;
    findById(userId: string): Promise<boolean>;
    findByEmail(email: string): Promise<boolean>;
    getByEmail(email: string): Promise<User>;
    getById(userId: string): Promise<User>;
    create(newUser: newUserCreateDTO): Promise<User>;
    deleteById(userId: string): Promise<User>;
    logout(userId: string): Promise<void>;
    updateJwtToken(id: string, jwt_token: string): Promise<User>;
}

@Injectable()
export default class UsersRepository implements UsersRepositoryPort {
    constructor(private readonly database: Database) {}

    public async getAll(): Promise<User[]> {
        try {
            return await this.database.user.findMany();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async getByRoleToken(roleToken: string): Promise<User> {
        return await this.database.user.findUnique({
            where: {
                role_token: roleToken,
            },
        });
    }

    public async findById(userId: string): Promise<boolean> {
        return (await this.database.user.findUnique({
            where: {
                id: userId,
            },
        }))
            ? true
            : false;
    }

    public async findByEmail(email: string): Promise<boolean> {
        return (await this.database.user.findUnique({
            where: {
                email,
            },
        }))
            ? true
            : false;
    }

    public async getByEmail(email: string): Promise<User> {
        try {
            return await this.database.user.findUnique({
                where: {
                    email,
                },
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    public async getById(userId: string): Promise<User> {
        try {
            return await this.database.user.findUnique({
                where: {
                    id: userId,
                },
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    public async create(newUser: newUserCreateDTO): Promise<User> {
        try {
            return await this.database.user.create({
                data: {
                    name: newUser.name,
                    role: newUser.role,
                    role_token: newUser.role_token,
                    email: newUser.email,
                    password: newUser.password,
                    jwt_token: newUser.jwt_token,
                },
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    public async deleteById(id: string): Promise<User> {
        return await this.database.user.delete({
            where: {
                id,
            },
        });
    }

    public async logout(userId: string): Promise<void> {
        await this.database.user.update({
            where: {
                id: userId,
            },
            data: {
                jwt_token: null,
            },
        });
    }

    public async updateJwtToken(id: string, jwt_token: string): Promise<User> {
        try {
            return await this.database.user.update({
                where: {
                    id,
                },
                data: {
                    jwt_token,
                },
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
