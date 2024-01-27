import { Controller, Res, HttpStatus, Inject, Post, Body } from "@nestjs/common";
import { Agendamento } from "@prisma/client";
import { Response } from "express";
import { AgendamentoCreateDTO, AgendamentoCreateUseCasePort } from "src/UseCases/agendamento/AgendamentoCreate.useCase";

interface AgendamentoControllerResponse {
    success: boolean;
    data?: Agendamento;
    message?: string;
}

interface AgendamentoControllerPort {
    create(
        agendamentoCreatePayload: AgendamentoCreateDTO,
        response: Response,
    ): Promise<Response<AgendamentoControllerResponse>>;
}

@Controller("agendamento")
export class AgendamentoController implements AgendamentoControllerPort {
    constructor(
        @Inject("AgendamentoCreateUseCasePort") private readonly agendamentoCreateUseCase: AgendamentoCreateUseCasePort,
    ) {}

    @Post("/")
    async create(
        @Body() agendamentoCreatePayload: AgendamentoCreateDTO,
        @Res() response: Response,
    ): Promise<Response<AgendamentoControllerResponse>> {
        try {
            const userId = response.locals.userId;
            const { success, data } = await this.agendamentoCreateUseCase.execute(userId, agendamentoCreatePayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}
