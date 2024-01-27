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
    getByRoleToken(roleToken: string): Promise<User>;
    findById(userId: string): Promise<boolean>;
    findByEmail(email: string): Promise<boolean>;
    getByEmail(email: string): any;
    getById(userId: string): any;
    create(newUser: newUserCreateDTO): Promise<User>;
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
        name: string;
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
        name: string;
        email: string;
        jwt_token: string;
        password: string;
        created_at: Date;
        updated_at: Date;
    }>;
    create(newUser: newUserCreateDTO): Promise<User>;
    deleteByEmail(email: string): Promise<void>;
    logout(userId: string): Promise<void>;
}
export {};
