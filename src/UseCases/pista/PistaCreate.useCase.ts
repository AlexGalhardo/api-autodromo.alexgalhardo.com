import { Pista } from "@prisma/client";
import { PistasRepositoryPort } from "src/Repositories/Pistas.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface PistaCreateUseCaseResponse {
    success: boolean;
    data?: Pista;
}

export interface PistaCreateDTO {
    name: string;
    kilometers: number;
    quantidade_boxes: number;
    quantidade_lugares: number;
    endereco: string;
}

export interface PistaCreateUseCasePort {
    execute(PistaCreatePayload: PistaCreateDTO): Promise<PistaCreateUseCaseResponse>;
}

export default class PistaCreateUseCase implements PistaCreateUseCasePort {
    constructor(private readonly pistasRepository: PistasRepositoryPort) {}

    async execute(pistaCreatePayload: PistaCreateDTO): Promise<PistaCreateUseCaseResponse> {
        try {
            const { name, kilometers, quantidade_boxes, quantidade_lugares, endereco } = pistaCreatePayload;

            if (name && (await this.pistasRepository.findByName(name)))
                throw new Error(ErrorsMessages.PISTA_NAME_ALREADY_REGISTERED);

            const PistaCreated = await this.pistasRepository.create({
                name,
                kilometers,
                quantidade_boxes,
                quantidade_lugares,
                endereco,
            });

            return { success: true, data: PistaCreated };
        } catch (error) {
            throw new Error(error);
        }
    }
}
