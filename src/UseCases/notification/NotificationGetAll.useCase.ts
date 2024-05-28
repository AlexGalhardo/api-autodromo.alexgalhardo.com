import { Notification, UserRole } from "src/config/mongoose";
import { NotificationsRepositoryPort } from "src/Repositories/Notifications.repository";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface NotificationGetAllUseCaseResponse {
    success: boolean;
    data?: typeof Notification[];
}

export interface NotificationGetAllUseCasePort {
    execute(userId: string): Promise<NotificationGetAllUseCaseResponse>;
}

export default class NotificationGetAllUseCase implements NotificationGetAllUseCasePort {
    constructor(
        private readonly notificationsRepository: NotificationsRepositoryPort,
        private readonly usersRepository: UsersRepositoryPort,
    ) {}

    async execute(userId: string): Promise<NotificationGetAllUseCaseResponse> {
        try {
            const userExists = await this.usersRepository.getById(userId);

            if (!userExists) throw new Error(ErrorsMessages.USER_NOT_FOUND);

            if (userExists.role !== UserRole.MANAGER) throw new Error(ErrorsMessages.USER_ROLE_MUST_BE_MANAGER);

            const allNotificationsFound = await this.notificationsRepository.getAll();

            return { success: true, data: allNotificationsFound };
        } catch (error) {
            throw new Error(error);
        }
    }
}
