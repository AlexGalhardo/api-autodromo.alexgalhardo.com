import { Injectable } from "@nestjs/common";
import { Database } from "src/Utils/Database";
import { User, UserRole } from "@prisma/client";

interface UserRepositoryCreateDTO {
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
    getByEmail(email: string): Promise<User>;
    getById(id: string): Promise<User>;
    create(user: UserRepositoryCreateDTO): Promise<User>;
    delete(id: string): Promise<User>;
    logout(id: string): Promise<void>;
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

    public async getById(id: string): Promise<User> {
        try {
            return await this.database.user.findUnique({
                where: {
                    id,
                },
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    public async create({
        name,
        role,
        role_token,
        email,
        password,
        jwt_token,
    }: UserRepositoryCreateDTO): Promise<User> {
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
        } catch (error) {
            throw new Error(error);
        }
    }

    public async delete(id: string): Promise<User> {
        return await this.database.user.delete({
            where: {
                id,
            },
        });
    }

    public async logout(id: string): Promise<void> {
        await this.database.user.update({
            where: {
                id,
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
