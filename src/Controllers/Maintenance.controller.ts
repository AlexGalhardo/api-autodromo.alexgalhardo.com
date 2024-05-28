import { Controller, Res, HttpStatus, Inject, Post, Body } from "@nestjs/common";
import { Response } from "express";
import { MaintenanceCreateDTO } from "src/Repositories/Maintenances.repository";
import { MaintenanceCreateUseCasePort } from "src/UseCases/maintenance/MaintenanceCreate.useCase";
import { Maintenance } from "src/config/mongoose";

interface MaintenanceControllerResponse {
    success: boolean;
    data?: typeof Maintenance;
    message?: string;
}

interface MaintenanceControllerPort {
    create(
        maintenanceCreatePayload: MaintenanceCreateDTO,
        response: Response,
    ): Promise<Response<MaintenanceControllerResponse>>;
}

@Controller("maintenance")
export default class MaintenanceController implements MaintenanceControllerPort {
    constructor(
        @Inject("MaintenanceCreateUseCasePort") private readonly maintenanceCreateUseCase: MaintenanceCreateUseCasePort,
    ) {}

    @Post("/")
    async create(
        @Body() maintenanceCreatePayload: MaintenanceCreateDTO,
        @Res() response: Response,
    ): Promise<Response<MaintenanceControllerResponse>> {
        try {
            const { success, data } = await this.maintenanceCreateUseCase.execute(maintenanceCreatePayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}
