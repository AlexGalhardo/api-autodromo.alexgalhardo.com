import { Controller, Res, HttpStatus, Inject, Get, Post, Body, Patch } from "@nestjs/common";
import { Corrida } from "@prisma/client";
import { Response } from "express";
import { CorridaCreateDTO, CorridaCreateUseCasePort } from "src/UseCases/corrida/CorridaCreate.useCase";
import { CorridaGetHistoricoUseCasePort } from "src/UseCases/corrida/CorridaGetHistorico.useCase";
import {
    CorridaUpdateEndsAtDTO,
    CorridaUpdateEndsAtUseCasePort,
} from "src/UseCases/corrida/CorridaUpdateEndsAt.useCase";

interface CorridaControllerResponse {
    success: boolean;
    data?: Corrida | Corrida[];
    message?: string;
}

interface CorridaControllerPort {
    historico(response: Response): Promise<Response<CorridaControllerResponse>>;
    create(corridaCreatePayload: CorridaCreateDTO, response: Response): Promise<Response<CorridaControllerResponse>>;
    updateEndsAt(
        corridaUpdateEndsAtPayload: CorridaUpdateEndsAtDTO,
        response: Response,
    ): Promise<Response<CorridaControllerResponse>>;
    updateStatus(
        corridaUpdateStatusPayload: CorridaUpdateEndsAtDTO,
        response: Response,
    ): Promise<Response<CorridaControllerResponse>>;
}

@Controller("corrida")
export class CorridaController implements CorridaControllerPort {
    constructor(
        @Inject("CorridaGetHistoricoUseCasePort")
        private readonly corridaGetHistoricoUseCase: CorridaGetHistoricoUseCasePort,
        @Inject("CorridaCreateUseCasePort") private readonly corridaCreateUseCase: CorridaCreateUseCasePort,
        @Inject("CorridaUpdateEndsAtUseCasePort")
        private readonly corridaUpdateEndsAtUseCase: CorridaUpdateEndsAtUseCasePort,
        @Inject("CorridaUpdateStatusUseCasePort")
        private readonly corridaUpdateStatusUseCase: CorridaUpdateEndsAtUseCasePort,
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

    @Patch("/ends-at")
    async updateEndsAt(
        @Body() corridaUpdateEndsAtPayload: CorridaUpdateEndsAtDTO,
        @Res() response: Response,
    ): Promise<Response<CorridaControllerResponse>> {
        try {
            const { success, data } = await this.corridaUpdateEndsAtUseCase.execute(corridaUpdateEndsAtPayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Patch("/status")
    async updateStatus(
        @Body() corridaUpdateStatusPayload: CorridaUpdateEndsAtDTO,
        @Res() response: Response,
    ): Promise<Response<CorridaControllerResponse>> {
        try {
            const { success, data } = await this.corridaUpdateStatusUseCase.execute(corridaUpdateStatusPayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}
