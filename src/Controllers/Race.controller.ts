import { Controller, Res, HttpStatus, Inject, Get, Post, Body, Patch } from "@nestjs/common";
import { Race } from "@prisma/client";
import { Response } from "express";
import { RaceCreateDTO, RaceCreateUseCasePort } from "src/UseCases/race/RaceCreate.useCase";
import { RaceGetHistoricoUseCasePort } from "src/UseCases/race/RaceGetHistorico.useCase";
import { RaceUpdateEndsAtDTO, RaceUpdateEndsAtUseCasePort } from "src/UseCases/race/RaceUpdateEndsAt.useCase";

interface CorridaControllerResponse {
    success: boolean;
    data?: Race | Race[];
    message?: string;
}

interface CorridaControllerPort {
    historico(response: Response): Promise<Response<CorridaControllerResponse>>;
    create(raceCreatePayload: RaceCreateDTO, response: Response): Promise<Response<CorridaControllerResponse>>;
    updateEndsAt(
        raceUpdateEndsAtPayload: RaceUpdateEndsAtDTO,
        response: Response,
    ): Promise<Response<CorridaControllerResponse>>;
    updateStatus(
        corridaUpdateStatusPayload: RaceUpdateEndsAtDTO,
        response: Response,
    ): Promise<Response<CorridaControllerResponse>>;
}

@Controller("corrida")
export default class CorridaController implements CorridaControllerPort {
    constructor(
        @Inject("RaceGetHistoricoUseCasePort")
        private readonly corridaGetHistoricoUseCase: RaceGetHistoricoUseCasePort,
        @Inject("RaceCreateUseCasePort") private readonly corridaCreateUseCase: RaceCreateUseCasePort,
        @Inject("RaceUpdateEndsAtUseCasePort")
        private readonly corridaUpdateEndsAtUseCase: RaceUpdateEndsAtUseCasePort,
        @Inject("RaceUpdateStatusUseCasePort")
        private readonly corridaUpdateStatusUseCase: RaceUpdateEndsAtUseCasePort,
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
        @Body() raceCreatePayload: RaceCreateDTO,
        @Res() response: Response,
    ): Promise<Response<CorridaControllerResponse>> {
        try {
            const userId = response.locals.userId;
            const { success, data } = await this.corridaCreateUseCase.execute(userId, raceCreatePayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Patch("/ends-at")
    async updateEndsAt(
        @Body() raceUpdateEndsAtPayload: RaceUpdateEndsAtDTO,
        @Res() response: Response,
    ): Promise<Response<CorridaControllerResponse>> {
        try {
            const { success, data } = await this.corridaUpdateEndsAtUseCase.execute(raceUpdateEndsAtPayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Patch("/status")
    async updateStatus(
        @Body() corridaUpdateStatusPayload: RaceUpdateEndsAtDTO,
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
