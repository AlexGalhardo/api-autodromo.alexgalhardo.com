import { Injectable } from "@nestjs/common";
import { Database } from "src/Utils/Database";
import { Notification, NotificationType } from "src/config/mongoose";

interface NotificationCreateRepositoryDTO {
    type: NotificationType;
    message: string;
    race_id: string;
    send_to_users_ids: string[];
}

export interface NotificationsRepositoryPort {
    getAll();
    getHistory(userId: string);
    create(notification: NotificationCreateRepositoryDTO);
}

@Injectable()
export default class NotificationsRepository implements NotificationsRepositoryPort {
    constructor(private readonly database: Database) {}

    public async getAll() {
        try {
            return await Notification.find().exec();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async getHistory(userId: string) {
        try {
            return await Notification.find({
                send_to_users_ids: userId,
            }).exec();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async create(notification: NotificationCreateRepositoryDTO) {
        try {
            const { type, message, race_id, send_to_users_ids } = notification;

            const newNotification = new Notification({
                type,
                message,
                race_id,
                send_to_users_ids,
            });

            return await newNotification.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
