import { Controller, Res, HttpStatus, Inject, Get, Post, Body } from "@nestjs/common";
import { Kart } from "@prisma/client";
import { Response } from "express";
import { KartCreateDTO, KartCreateUseCasePort } from "src/UseCases/kart/KartCreate.useCase";
import { KartGetAllUseCasePort } from "src/UseCases/kart/KartGetAll.useCase";

interface KartControllerResponse {
    success: boolean;
    data?: Kart;
    message?: string;
}

interface KartControllerPort {
    create(kartCreatePayload: KartCreateDTO, response: Response): Promise<Response<KartControllerResponse>>;
}

@Controller("kart")
export default class KartController implements KartControllerPort {
    constructor(
		@Inject("KartGetAllUseCasePort") private readonly kartGetAllUseCase: KartGetAllUseCasePort,
		@Inject("KartCreateUseCasePort") private readonly kartCreateUseCase: KartCreateUseCasePort
	) {}

	@Get("/all")
    async all(@Res() response: Response): Promise<Response<KartControllerResponse>> {
        try {
            const { success, data } = await this.kartGetAllUseCase.execute(response.locals.userId);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Post("/")
    async create(
        @Body() kartCreatePayload: KartCreateDTO,
        @Res() response: Response,
    ): Promise<Response<KartControllerResponse>> {
        try {
            const { success, data } = await this.kartCreateUseCase.execute(kartCreatePayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}
