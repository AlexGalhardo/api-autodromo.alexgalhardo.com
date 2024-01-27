import "dotenv/config";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { UserRole } from "@prisma/client";
interface AuthRegisterUseCaseResponse {
    success: boolean;
    jwt_token?: string;
}
export interface UserCreateDTO {
    username: string;
    email: string;
    password: string;
    role: UserRole;
}
export interface AuthRegisterUseCasePort {
    execute(jwtToken: string, userCreatePayload: UserCreateDTO): Promise<AuthRegisterUseCaseResponse>;
}
export default class AuthRegisterUseCase implements AuthRegisterUseCasePort {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepositoryPort);
    execute(jwtToken: string, userCreatePayload: UserCreateDTO): Promise<AuthRegisterUseCaseResponse>;
}
export {};
