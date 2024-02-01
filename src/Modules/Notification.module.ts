import { Module } from "@nestjs/common";
import NotificationController from "src/Controllers/NotificationController";
import NotificationsRepository, { NotificationsRepositoryPort } from "src/Repositories/Notifications.repository";
import { RacesRepositoryPort } from "src/Repositories/Races.repository";
import UsersRepository, { UsersRepositoryPort } from "src/Repositories/Users.repository";
import NotificationCreateUseCase from "src/UseCases/notification/NotificationCreate.useCase";
import NotificationGetAllUseCase from "src/UseCases/notification/NotificationGetAll.useCase";
import NotificationGetHistoryUseCase from "src/UseCases/notification/NotificationGetHistory.useCase";
import { Database } from "src/Utils/Database";

@Module({
    controllers: [NotificationController],
    providers: [
        Database,
        {
            provide: "NotificationsRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new NotificationsRepository(database);
            },
        },
        {
            provide: "UsersRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new UsersRepository(database);
            },
        },
        {
            provide: "NotificationGetAllUseCasePort",
            inject: ["NotificationsRepositoryPort", "UsersRepositoryPort"],
            useFactory: (racesRepository: NotificationsRepositoryPort, usersRepository: UsersRepositoryPort) => {
                return new NotificationGetAllUseCase(racesRepository, usersRepository);
            },
        },
        {
            provide: "NotificationCreateUseCasePort",
            inject: ["UsersRepositoryPort", "NotificationsRepositoryPort"],
            useFactory: (
                notificationsRepository: NotificationsRepositoryPort,
                usersRepository: UsersRepositoryPort,
				racesRepository: RacesRepositoryPort
            ) => {
                return new NotificationCreateUseCase(notificationsRepository, usersRepository, racesRepository);
            },
        },
        {
            provide: "NotificationGetHistoryUseCasePort",
            inject: ["NotificationsRepositoryPort", "UsersRepositoryPort"],
            useFactory: (
                notificationsRepository: NotificationsRepositoryPort,
                usersRepository: UsersRepositoryPort,
            ) => {
                return new NotificationGetHistoryUseCase(notificationsRepository, usersRepository);
            },
        },
    ],
})
export class NotificationModule {}
