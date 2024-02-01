import { Notification, NotificationType } from "@prisma/client";
import { NotificationsRepositoryPort } from "src/Repositories/Notifications.repository";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface NotificationCreateUseCaseResponse {
    success: boolean;
    data?: Notification;
}

export interface NotificationCreateDTO {
    type: NotificationType;
    message: string;
    send_to_users_ids: string[];
}

export interface NotificationCreateUseCasePort {
    execute(notificationCreatePayload: NotificationCreateDTO): Promise<NotificationCreateUseCaseResponse>;
}

export default class NotificationCreateUseCase implements NotificationCreateUseCasePort {
    constructor(private readonly notificationsRepository: NotificationsRepositoryPort, private readonly usersRepository: UsersRepositoryPort) {}

    async execute(notificationCreatePayload: NotificationCreateDTO): Promise<NotificationCreateUseCaseResponse> {
        try {
            const { type, message, send_to_users_ids } = notificationCreatePayload;

            if(!Object.values(NotificationType).includes(type as NotificationType)) throw new Error(ErrorsMessages.INVALID_NOTIFICATION_TYPE)

			send_to_users_ids.forEach(async userId => {
				if(!await this.usersRepository.getById(userId)) throw new Error(`User ID ${userId} not found`)
			})

            const notificationCreated = await this.notificationsRepository.create({
                type,
                message,
                send_to_users_ids
            });

            return { success: true, data: notificationCreated };
        } catch (error) {
            throw new Error(error);
        }
    }
}
