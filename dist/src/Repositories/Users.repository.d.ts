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
    deleteByEmail(email: string): Promise<void>;
    logout(userId: string): Promise<void>;
    updateJwtToken(id: string, jwt_token: string): Promise<User>;
}
export default class UsersRepository implements UsersRepositoryPort {
    private readonly database;
    constructor(database: Database);
    getAll(): Promise<User[]>;
    getByRoleToken(roleToken: string): Promise<User>;
    findById(userId: string): Promise<boolean>;
    findByEmail(email: string): Promise<boolean>;
    getByEmail(email: string): Promise<User>;
    getById(userId: string): Promise<User>;
    create(newUser: newUserCreateDTO): Promise<User>;
    deleteByEmail(email: string): Promise<void>;
    logout(userId: string): Promise<void>;
    updateJwtToken(id: string, jwt_token: string): Promise<User>;
}
export {};
