import { Controller, Res, HttpStatus, Inject, Post, Body } from "@nestjs/common";
import { Kart } from "@prisma/client";
import { Response } from "express";
import { KartCreateDTO, KartCreateUseCasePort } from "src/UseCases/kart/KartCreate.useCase";

interface KartControllerResponse {
    success: boolean;
    data?: Kart
}

interface KartControllerPort {
    create(kartCreatePayload: KartCreateDTO, response: Response): Promise<Response<KartControllerResponse>>;
}

@Controller("kart")
export class KartController implements KartControllerPort {
    constructor(
        @Inject("KartCreateUseCasePort") private readonly kartCreateUseCase: KartCreateUseCasePort,
    ) {}

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
