import { Controller, Res, HttpStatus, Inject, Post, Body } from "@nestjs/common";
import { Road } from "@prisma/client";
import { Response } from "express";
import { RoadCreateDTO, RoadCreateUseCasePort } from "src/UseCases/road/RoadCreate.useCase";

interface RoadControllerResponse {
    success: boolean;
    data?: Road;
    message?: string;
}

interface RoadControllerPort {
    create(roadCreatePayload: RoadCreateDTO, response: Response): Promise<Response<RoadControllerResponse>>;
}

@Controller("road")
export default class PistaController implements RoadControllerPort {
    constructor(@Inject("RoadCreateUseCasePort") private readonly roadCreateUseCase: RoadCreateUseCasePort) {}

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
