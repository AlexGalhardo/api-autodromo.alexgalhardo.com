import "dotenv/config";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";
interface AuthRegisterUseCaseResponse {
    success: boolean;
    jwt_token?: string;
}
export interface UserCreateDTO {
    username: string;
    email: string;
    password: string;
}
export interface AuthRegisterUseCasePort {
    execute(UserCreateDTO: UserCreateDTO): Promise<AuthRegisterUseCaseResponse>;
}
export default class AuthRegisterUseCase implements AuthRegisterUseCasePort {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepositoryPort);
    execute(UserCreateDTO: UserCreateDTO): Promise<AuthRegisterUseCaseResponse>;
}
export {};
