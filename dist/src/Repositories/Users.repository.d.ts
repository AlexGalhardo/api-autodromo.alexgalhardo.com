import { Database } from "src/Utils/Database";
import "dotenv/config";
export interface UsersRepositoryPort {
    findById(userId: string): Promise<boolean>;
    findByEmail(email: string): Promise<boolean>;
    getByEmail(email: string): any;
    getById(userId: string): any;
    getByResetPasswordToken(resetPasswordToken: string): any;
    create(user: any): Promise<void>;
    deleteByEmail(email: string): Promise<void>;
    logout(userId: string): Promise<void>;
    saveResetPasswordToken(userId: string, resetPasswordToken: string): Promise<void>;
    resetPassword(userId: string, newPassword: string): Promise<void>;
    findResetPasswordToken(resetPasswordToken: string): Promise<boolean>;
}
export default class UsersRepository implements UsersRepositoryPort {
    private readonly database;
    constructor(database: Database);
    findById(userId: string): Promise<boolean>;
    findByEmail(email: string): Promise<boolean>;
    getByEmail(email: string): Promise<any>;
    getById(userId: string): Promise<any>;
    getByResetPasswordToken(resetPasswordToken: string): Promise<any>;
    create(user: any): Promise<void>;
    deleteByEmail(email: string): Promise<void>;
    logout(userId: string): Promise<void>;
    saveResetPasswordToken(userId: string, resetPasswordToken: string): Promise<void>;
    resetPassword(userId: string, newPassword: string): Promise<void>;
    findResetPasswordToken(resetPasswordToken: string): Promise<boolean>;
}
