import { Controller, Res, HttpStatus, Inject, Get, Post, Body } from "@nestjs/common";
import { Notification } from "@prisma/client";
import { Response } from "express";
import {
    NotificationCreateDTO,
    NotificationCreateUseCasePort,
} from "src/UseCases/notification/NotificationCreate.useCase";
import { RaceGetAllUseCasePort } from "src/UseCases/race/RaceGetAll.useCase";
import { RaceGetHistoryUseCasePort } from "src/UseCases/race/RaceGetHistory.useCase";

interface NotificationControllerResponse {
    success: boolean;
    data?: Notification | Notification[];
    message?: string;
}

interface NotificationControllerPort {
    history(response: Response): Promise<Response<NotificationControllerResponse>>;
    all(response: Response): Promise<Response<NotificationControllerResponse>>;
    create(
        notificationCreatePayload: NotificationCreateDTO,
        response: Response,
    ): Promise<Response<NotificationControllerResponse>>;
}

@Controller("notification")
export default class NotificationController implements NotificationControllerPort {
    constructor(
        @Inject("NotificationGetHistoryUseCasePort")
        private readonly notificationGetHistoryUseCase: RaceGetHistoryUseCasePort,
        @Inject("NotificationGetAllUseCasePort")
        private readonly notificationGetAllUseCase: RaceGetAllUseCasePort,
        @Inject("NotificationCreateUseCasePort")
        private readonly notificationCreateUseCase: NotificationCreateUseCasePort,
    ) {}

    @Get("/history")
    async history(@Res() response: Response): Promise<Response<NotificationControllerResponse>> {
        try {
            const { success, data } = await this.notificationGetHistoryUseCase.execute(response.locals.userId);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Get("/all")
    async all(@Res() response: Response): Promise<Response<NotificationControllerResponse>> {
        try {
            const { success, data } = await this.notificationGetAllUseCase.execute(response.locals.userId);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Post("/")
    async create(
        @Body() notificationCreatePayload: NotificationCreateDTO,
        @Res() response: Response,
    ): Promise<Response<NotificationControllerResponse>> {
        try {
            const { success, data } = await this.notificationCreateUseCase.execute(notificationCreatePayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}
