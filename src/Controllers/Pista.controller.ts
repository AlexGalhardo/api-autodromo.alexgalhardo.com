import { Controller, Res, HttpStatus, Inject, Post, Body } from "@nestjs/common";
import { Pista } from "@prisma/client";
import { Response } from "express";
import { PistaCreateDTO, PistaCreateUseCasePort } from "src/UseCases/pista/PistaCreate.useCase";

interface PistaControllerResponse {
    success: boolean;
    data?: Pista;
    message?: string;
}

interface PistaControllerPort {
    create(kartCreatePayload: PistaCreateDTO, response: Response): Promise<Response<PistaControllerResponse>>;
}

@Controller("pista")
export class PistaController implements PistaControllerPort {
    constructor(@Inject("PistaCreateUseCasePort") private readonly pistaCreateUseCase: PistaCreateUseCasePort) {}

    @Post("/")
    async create(
        @Body() pistaCreatePayload: PistaCreateDTO,
        @Res() response: Response,
    ): Promise<Response<PistaControllerResponse>> {
        try {
            const { success, data } = await this.pistaCreateUseCase.execute(pistaCreatePayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}
