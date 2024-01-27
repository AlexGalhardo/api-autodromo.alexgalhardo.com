import { Kart, KartStatus } from "@prisma/client";
import { KartsRepositoryPort } from "src/Repositories/Karts.repository";
import Validator from "src/Utils/Validator";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface KartCreateUseCaseResponse {
    success: boolean;
    data?: Kart
}

export interface KartCreateDTO {
    status: KartStatus
  	name: string
	marca: string
	modelo: string
	potencia: number
	marca_pneus: string
}

export interface KartCreateUseCasePort {
    execute(kartCreatePayload: KartCreateDTO): Promise<KartCreateUseCaseResponse>;
}

export default class KartCreateUseCase implements KartCreateUseCasePort {
    constructor(private readonly kartsRepository: KartsRepositoryPort) {}

    async execute(kartCreatePayload: KartCreateDTO): Promise<KartCreateUseCaseResponse> {
		try {
			const { status, name, marca, modelo, potencia, marca_pneus } = kartCreatePayload;

			if (status && !Validator.kart.statusIsValid(status)) throw new Error(ErrorsMessages.INVALID_KART_STATUS);

			if (name && (await this.kartsRepository.findByName(name))) throw new Error(ErrorsMessages.KART_NAME_ALREADY_REGISTERED);

			const kartCreated = await this.kartsRepository.create({
				status,
				name,
				marca,
				modelo,
				potencia,
				marca_pneus,
			});

			return { success: true, data: kartCreated };
		} catch (error) {
			throw new Error(error)
		}
    }
}
