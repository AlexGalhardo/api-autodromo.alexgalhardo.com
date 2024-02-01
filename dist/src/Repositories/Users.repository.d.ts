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
export default class UsersRepository implements UsersRepositoryPort {
    private readonly database;
    constructor(database: Database);
    getAll(): Promise<User[]>;
    getByRoleToken(roleToken: string): Promise<User>;
    getByEmail(email: string): Promise<User>;
    getById(id: string): Promise<User>;
    create({ name, role, role_token, email, password, jwt_token, }: UserRepositoryCreateDTO): Promise<User>;
    delete(id: string): Promise<User>;
    logout(id: string): Promise<void>;
    updateJwtToken(id: string, jwt_token: string): Promise<User>;
}
export {};
