import { Injectable } from "@nestjs/common";
import { Database } from "src/Utils/Database";
import { User, UserRole } from "@prisma/client";

interface newUserCreateDTO {
	username: string,
	role: UserRole,
	role_token: string,
	email: string,
	password: string,
	jwt_token: string
}

export interface UsersRepositoryPort {
	getByRoleToken(roleToken: string): Promise<User>
    findById(userId: string): Promise<boolean>;
    findByEmail(email: string): Promise<boolean>;
    getByEmail(email: string);
    getById(userId: string);
    create(newUser: newUserCreateDTO): Promise<User>;
    deleteByEmail(email: string): Promise<void>;
    logout(userId: string): Promise<void>;
}

@Injectable()
export default class UsersRepository implements UsersRepositoryPort {
    constructor(private readonly database: Database) {}

	public async getByRoleToken(roleToken: string): Promise<User> {
		return await this.database.user.findUnique({
			where: {
				role_token: roleToken
			}
		});
	}

    public async findById(userId: string): Promise<boolean> {
        return await this.database.user.findUnique({
            where: {
                id: userId,
            },
        }) ? true : false;
    }

    public async findByEmail(email: string): Promise<boolean> {
        return await this.database.user.findUnique({
            where: {
                email,
            },
        }) ? true : false
    }

    public async getByEmail(email: string) {
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

    public async getById(userId: string) {
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
					username: newUser.username,
					role: newUser.role,
					role_token: newUser.role_token,
					email: newUser.email,
					password: newUser.password,
					jwt_token: newUser.jwt_token
				},
			});
		}
		catch (error) {
			throw new Error(error);
		}
    }

    public async deleteByEmail(email: string): Promise<void> {
        await this.database.user.delete({
            where: {
                email,
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
}
