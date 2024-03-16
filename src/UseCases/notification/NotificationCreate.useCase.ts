import { Notification, NotificationType } from "@prisma/client";
import { NotificationsRepositoryPort } from "src/Repositories/Notifications.repository";
import { RacesRepositoryPort } from "src/Repositories/Races.repository";
import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface NotificationCreateUseCaseResponse {
    success: boolean;
    data?: Notification;
}

export interface NotificationCreateDTO {
    type: NotificationType;
    message: string;
    race_id: string;
    send_to_users_ids: string[];
}

export interface NotificationCreateUseCasePort {
    execute(notificationCreatePayload: NotificationCreateDTO): Promise<NotificationCreateUseCaseResponse>;
}

export default class NotificationCreateUseCase implements NotificationCreateUseCasePort {
    constructor(
        private readonly notificationsRepository: NotificationsRepositoryPort,
        private readonly usersRepository: UsersRepositoryPort,
        private readonly racesRepository: RacesRepositoryPort,
    ) {}

    async execute(notificationCreatePayload: NotificationCreateDTO): Promise<NotificationCreateUseCaseResponse> {
        try {
            const { type, message, race_id, send_to_users_ids } = notificationCreatePayload;

            if (!Object.values(NotificationType).includes(type as NotificationType))
                throw new Error(ErrorsMessages.INVALID_NOTIFICATION_TYPE);

            send_to_users_ids.forEach(async (userId) => {
                if (!(await this.usersRepository.getById(userId))) throw new Error(`User ID ${userId} not found`);
            });

            if (!(await this.racesRepository.getById(race_id))) throw new Error(ErrorsMessages.RACE_NOT_FOUND);

            const notificationCreated = await this.notificationsRepository.create({
                type,
                message,
                race_id,
                send_to_users_ids,
            });

            return { success: true, data: notificationCreated };
        } catch (error) {
            throw new Error(error);
        }
    }
}
