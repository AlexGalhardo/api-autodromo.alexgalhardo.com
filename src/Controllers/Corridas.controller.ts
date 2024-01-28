import { Controller, Res, HttpStatus, Inject, Get, Post, Body } from "@nestjs/common";
import { Corrida } from "@prisma/client";
import { Response } from "express";
import { CorridaCreateDTO, CorridaCreateUseCasePort } from "src/UseCases/corrida/CorridaCreate.useCase";
import { CorridaGetHistoricoUseCasePort } from "src/UseCases/corrida/CorridaGetHistorico.useCase";

interface CorridaControllerResponse {
    success: boolean;
    data?: Corrida | Corrida[];
    message?: string;
}

interface CorridaControllerPort {
    historico(response: Response): Promise<Response<CorridaControllerResponse>>;
}

@Controller("corrida")
export class CorridaController implements CorridaControllerPort {
    constructor(
        @Inject("CorridaGetHistoricoUseCasePort")
        private readonly corridaGetHistoricoUseCase: CorridaGetHistoricoUseCasePort,
        @Inject("CorridaCreateUseCasePort") private readonly corridaCreateUseCase: CorridaCreateUseCasePort,
    ) {}

    @Get("/historico")
    async historico(@Res() response: Response): Promise<Response<CorridaControllerResponse>> {
        try {
            const userId = response.locals.userId;
            const { success, data } = await this.corridaGetHistoricoUseCase.execute(userId);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Post("/")
    async create(
        @Body() corridaCreatePayload: CorridaCreateDTO,
        @Res() response: Response,
    ): Promise<Response<CorridaControllerResponse>> {
        try {
            const userId = response.locals.userId;
            const { success, data } = await this.corridaCreateUseCase.execute(userId, corridaCreatePayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}
