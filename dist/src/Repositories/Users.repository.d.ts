import { Database } from "src/Utils/Database";
import "dotenv/config";
import { User } from "@prisma/client";
export interface UsersRepositoryPort {
    getByRoleToken(roleToken: string): Promise<User>;
    findById(userId: string): Promise<boolean>;
    findByEmail(email: string): Promise<boolean>;
    getByEmail(email: string): any;
    getById(userId: string): any;
    create(user: any): Promise<void>;
    deleteByEmail(email: string): Promise<void>;
    logout(userId: string): Promise<void>;
}
export default class UsersRepository implements UsersRepositoryPort {
    private readonly database;
    constructor(database: Database);
    getByRoleToken(roleToken: string): Promise<User>;
    findById(userId: string): Promise<boolean>;
    findByEmail(email: string): Promise<boolean>;
    getByEmail(email: string): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        role_token: string;
        username: string;
        email: string;
        jwt_token: string;
        password: string;
        created_at: Date;
        updated_at: Date;
    }>;
    getById(userId: string): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        role_token: string;
        username: string;
        email: string;
        jwt_token: string;
        password: string;
        created_at: Date;
        updated_at: Date;
    }>;
    create(newUser: any): Promise<void>;
    deleteByEmail(email: string): Promise<void>;
    logout(userId: string): Promise<void>;
}
