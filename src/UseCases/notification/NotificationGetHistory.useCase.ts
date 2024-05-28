import { Notification } from "src/config/mongoose";
import { NotificationsRepositoryPort } from "src/Repositories/Notifications.repository";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface NotificationGetHistoryUseCaseResponse {
    success: boolean;
    data?: (typeof Notification)[];
}

export interface NotificationGetHistoryUseCasePort {
    execute(userId: string): Promise<NotificationGetHistoryUseCaseResponse>;
}

export default class NotificationGetHistoryUseCase implements NotificationGetHistoryUseCasePort {
    constructor(
        private readonly notificationsRepository: NotificationsRepositoryPort,
        private readonly usersRepository: UsersRepositoryPort,
    ) {}

    async execute(userId: string): Promise<NotificationGetHistoryUseCaseResponse> {
        try {
            const userExists = await this.usersRepository.getById(userId);

            if (!userExists) throw new Error(ErrorsMessages.USER_NOT_FOUND);

            const notificationsHistory = await this.notificationsRepository.getHistory(userId);

            return { success: true, data: notificationsHistory };
        } catch (error) {
            throw new Error(error);
        }
    }
}
