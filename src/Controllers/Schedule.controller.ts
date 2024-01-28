import { Controller, Res, HttpStatus, Inject, Post, Body } from "@nestjs/common";
import { Schedule } from "@prisma/client";
import { Response } from "express";
import { ScheduleCreateDTO, ScheduleCreateUseCasePort } from "src/UseCases/schedule/ScheduleCreate.useCase";

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
        @Inject("ScheduleCreateUseCasePort") private readonly agendamentoCreateUseCase: ScheduleCreateUseCasePort,
    ) {}

    @Post("/")
    async create(
        @Body() scheduleCreatePayload: ScheduleCreateDTO,
        @Res() response: Response,
    ): Promise<Response<ScheduleControllerResponse>> {
        try {
            const userId = response.locals.userId;
            const { success, data } = await this.agendamentoCreateUseCase.execute(userId, scheduleCreatePayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}
