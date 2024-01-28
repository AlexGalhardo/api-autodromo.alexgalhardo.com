import { Road } from "@prisma/client";
import { RoadsRepositoryPort } from "src/Repositories/Roads.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface RoadCreateUseCaseResponse {
    success: boolean;
    data?: Road;
}

export interface RoadCreateDTO {
    name: string;
    kilometers: number;
    quantity_boxes: number;
    quantity_places: number;
    address: string;
}

export interface RoadCreateUseCasePort {
    execute(roadCreatePayload: RoadCreateDTO): Promise<RoadCreateUseCaseResponse>;
}

export default class RoadCreateUseCase implements RoadCreateUseCasePort {
    constructor(private readonly roadsRepository: RoadsRepositoryPort) {}

    async execute(roadCreatePayload: RoadCreateDTO): Promise<RoadCreateUseCaseResponse> {
        try {
            const { name, kilometers, quantity_boxes, quantity_places, address } = roadCreatePayload;

            if (name && (await this.roadsRepository.findByName(name)))
                throw new Error(ErrorsMessages.ROAD_NAME_ALREADY_REGISTERED);

            const RoadCreated = await this.roadsRepository.create({
                name,
                kilometers,
                quantity_boxes,
                quantity_places,
                address,
            });

            return { success: true, data: RoadCreated };
        } catch (error) {
            throw new Error(error);
        }
    }
}
