import { Injectable } from "@nestjs/common";
import { Database } from "src/Utils/Database";
import { User, UserRole } from "src/config/mongoose";

interface UserRepositoryCreateDTO {
    name: string;
    role: UserRole;
    role_token: string;
    email: string;
    password: string;
    jwt_token: string;
}

export interface UsersRepositoryPort {
    getAll();
    getByRoleToken(roleToken: string);
    getByEmail(email: string);
    getById(id: string);
    create(user: UserRepositoryCreateDTO);
    delete(id: string);
    logout(id: string): Promise<void>;
    updateJwtToken(id: string, jwt_token: string);
}

@Injectable()
export default class UsersRepository implements UsersRepositoryPort {
    constructor(private readonly database: Database) {}

    public async getAll() {
        try {
            return await User.find().exec();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async getByRoleToken(roleToken: string) {
        try {
            return await User.findOne({ role_token: roleToken }).exec();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async getByEmail(email: string) {
        try {
            return await User.findOne({ email }).exec();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async getById(id: string) {
        try {
            return await User.findById(id).exec();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async create({ name, role, role_token, email, password, jwt_token }: UserRepositoryCreateDTO) {
        try {
            const user = new User({
                name,
                role,
                role_token,
                email,
                password,
                jwt_token,
            });
            return await user.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async delete(id: string) {
        try {
            return await User.findByIdAndDelete(id).exec();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async logout(id: string): Promise<void> {
        try {
            await User.findByIdAndUpdate(id, { jwt_token: null }).exec();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async updateJwtToken(id: string, jwt_token: string) {
        try {
            return await User.findByIdAndUpdate(id, { jwt_token }, { new: true }).exec();
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
