import { Controller, Res, HttpStatus, Inject, Post, Get, Body } from "@nestjs/common";
import { Schedule } from "@prisma/client";
import { Response } from "express";
import { ScheduleCreateDTO, ScheduleCreateUseCasePort } from "src/UseCases/schedule/ScheduleCreate.useCase";
import { ScheduleGetAllUseCasePort } from "src/UseCases/schedule/ScheduleGetAll.useCase";

interface ScheduleControllerResponse {
    success: boolean;
    data?: Schedule;
    message?: string;
}

interface AgendamentoControllerPort {
    create(scheduleCreatePayload: ScheduleCreateDTO, response: Response): Promise<Response<ScheduleControllerResponse>>;
}

@Controller("schedule")
export default class ScheduleController implements AgendamentoControllerPort {
    constructor(
		@Inject("ScheduleGetAllUseCasePort") private readonly scheduleGetAllUseCase: ScheduleGetAllUseCasePort,
        @Inject("ScheduleCreateUseCasePort") private readonly scheduleCreateUseCase: ScheduleCreateUseCasePort,
    ) {}

	@Get("/all")
    async all(@Res() response: Response): Promise<Response<ScheduleControllerResponse>> {
        try {
            const { success, data } = await this.scheduleGetAllUseCase.execute(response.locals.userId);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Post("/")
    async create(
        @Body() scheduleCreatePayload: ScheduleCreateDTO,
        @Res() response: Response,
    ): Promise<Response<ScheduleControllerResponse>> {
        try {
            const userId = response.locals.userId;
            const { success, data } = await this.scheduleCreateUseCase.execute(userId, scheduleCreatePayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}
