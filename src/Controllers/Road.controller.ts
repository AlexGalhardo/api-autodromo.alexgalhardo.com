import { Controller, Res, HttpStatus, Inject, Get, Post, Body } from "@nestjs/common";
import { Response } from "express";
import { RoadCreateDTO, RoadCreateUseCasePort } from "src/UseCases/road/RoadCreate.useCase";
import { RoadGetAllUseCasePort } from "src/UseCases/road/RoadGetAll.useCase";
import { Road } from "src/config/mongoose";

interface RoadControllerResponse {
    success: boolean;
    data?: typeof Road;
    message?: string;
}

interface RoadControllerPort {
    create(roadCreatePayload: RoadCreateDTO, response: Response): Promise<Response<RoadControllerResponse>>;
}

@Controller("road")
export default class RoadController implements RoadControllerPort {
    constructor(
        @Inject("RoadGetAllUseCasePort") private readonly roadGetAllUseCase: RoadGetAllUseCasePort,
        @Inject("RoadCreateUseCasePort") private readonly roadCreateUseCase: RoadCreateUseCasePort,
    ) {}

    @Get("/all")
    async all(@Res() response: Response): Promise<Response<RoadControllerResponse>> {
        try {
            const { success, data } = await this.roadGetAllUseCase.execute(response.locals.userId);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Post("/")
    async create(
        @Body() roadCreatePayload: RoadCreateDTO,
        @Res() response: Response,
    ): Promise<Response<RoadControllerResponse>> {
        try {
            const { success, data } = await this.roadCreateUseCase.execute(roadCreatePayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}
