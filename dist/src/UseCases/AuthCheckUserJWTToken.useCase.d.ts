import { UsersRepositoryPort } from "src/Repositories/Users.repository";
export interface AuthCheckUserJWTTokenUseCasePort {
    execute(token: string): any;
}
export default class AuthCheckUserJWTTokenUseCase implements AuthCheckUserJWTTokenUseCasePort {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepositoryPort);
    execute(token: string): Promise<{
        success: boolean;
        data: any;
    }>;
}
