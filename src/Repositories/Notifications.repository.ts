import { Injectable } from "@nestjs/common";
import { Notification, NotificationType } from "@prisma/client";
import { Database } from "src/Utils/Database";

interface NotificationCreateRepositoryDTO {
    type: NotificationType;
    message: string;
    race_id: string;
    send_to_users_ids: string[];
}

export interface NotificationsRepositoryPort {
    getAll(): Promise<Notification[]>;
    getHistory(userId: string): Promise<Notification[]>;
    create(notification: NotificationCreateRepositoryDTO): Promise<Notification>;
}

@Injectable()
export default class NotificationsRepository implements NotificationsRepositoryPort {
    constructor(private readonly database: Database) {}

    public async getAll(): Promise<Notification[]> {
        return await this.database.notification.findMany();
    }

    public async getHistory(userId: string): Promise<Notification[]> {
        return await this.database.notification.findMany({
            where: {
                send_to_users_ids: {
                    has: userId,
                },
            },
        });
    }

    public async create(notification: NotificationCreateRepositoryDTO): Promise<Notification> {
        try {
            const { type, message, race_id, send_to_users_ids } = notification;

            return await this.database.notification.create({
                data: {
                    type,
                    message,
                    race_id,
                    send_to_users_ids,
                },
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}
