import { Controller, Res, HttpStatus, Inject, Get, Post, Body, Patch } from "@nestjs/common";
import { Race } from "@prisma/client";
import { Response } from "express";
import { RaceCreateDTO, RaceCreateUseCasePort } from "src/UseCases/race/RaceCreate.useCase";
import { RaceGetHistoricoUseCasePort } from "src/UseCases/race/RaceGetHistorico.useCase";
import { RaceUpdateEndsAtDTO, RaceUpdateEndsAtUseCasePort } from "src/UseCases/race/RaceUpdateEndsAt.useCase";

interface RaceControllerResponse {
    success: boolean;
    data?: Race | Race[];
    message?: string;
}

interface RaceControllerPort {
    history(response: Response): Promise<Response<RaceControllerResponse>>;
    create(raceCreatePayload: RaceCreateDTO, response: Response): Promise<Response<RaceControllerResponse>>;
    updateEndsAt(
        raceUpdateEndsAtPayload: RaceUpdateEndsAtDTO,
        response: Response,
    ): Promise<Response<RaceControllerResponse>>;
    updateStatus(
        raceUpdateStatusPayload: RaceUpdateEndsAtDTO,
        response: Response,
    ): Promise<Response<RaceControllerResponse>>;
}

@Controller("race")
export default class CorridaController implements RaceControllerPort {
    constructor(
        @Inject("RaceGetHistoricoUseCasePort")
        private readonly raceGetHistoricoUseCase: RaceGetHistoricoUseCasePort,
        @Inject("RaceCreateUseCasePort") private readonly raceCreateUseCase: RaceCreateUseCasePort,
        @Inject("RaceUpdateEndsAtUseCasePort")
        private readonly raceUpdateEndsAtUseCase: RaceUpdateEndsAtUseCasePort,
        @Inject("RaceUpdateStatusUseCasePort")
        private readonly raceUpdateStatusUseCase: RaceUpdateEndsAtUseCasePort,
    ) {}

    @Get("/history")
    async history(@Res() response: Response): Promise<Response<RaceControllerResponse>> {
        try {
            const userId = response.locals.userId;
            const { success, data } = await this.raceGetHistoricoUseCase.execute(userId);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Post("/")
    async create(
        @Body() raceCreatePayload: RaceCreateDTO,
        @Res() response: Response,
    ): Promise<Response<RaceControllerResponse>> {
        try {
            const userId = response.locals.userId;
            const { success, data } = await this.raceCreateUseCase.execute(userId, raceCreatePayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Patch("/ends-at")
    async updateEndsAt(
        @Body() raceUpdateEndsAtPayload: RaceUpdateEndsAtDTO,
        @Res() response: Response,
    ): Promise<Response<RaceControllerResponse>> {
        try {
            const { success, data } = await this.raceUpdateEndsAtUseCase.execute(raceUpdateEndsAtPayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Patch("/status")
    async updateStatus(
        @Body() raceUpdateStatusPayload: RaceUpdateEndsAtDTO,
        @Res() response: Response,
    ): Promise<Response<RaceControllerResponse>> {
        try {
            const { success, data } = await this.raceUpdateStatusUseCase.execute(raceUpdateStatusPayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}
