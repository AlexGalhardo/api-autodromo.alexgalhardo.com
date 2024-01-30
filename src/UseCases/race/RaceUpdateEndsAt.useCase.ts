import { Race } from "@prisma/client";
import { RacesRepositoryPort } from "src/Repositories/Races.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import Validator from "src/Utils/Validator";

interface RaceUpdateEndsAtUseCaseResponse {
    success: boolean;
    data?: Race;
}

export interface RaceUpdateEndsAtDTO {
    id: string;
    ends_at: string | Date;
}

export interface RaceUpdateEndsAtUseCasePort {
    execute(raceUpdateEndsAtPayload: RaceUpdateEndsAtDTO): Promise<RaceUpdateEndsAtUseCaseResponse>;
}

export default class RaceUpdateEndsAtUseCase implements RaceUpdateEndsAtUseCasePort {
    constructor(private readonly racesRepository: RacesRepositoryPort) {}

    async execute(raceUpdateEndsAtPayload: RaceUpdateEndsAtDTO): Promise<RaceUpdateEndsAtUseCaseResponse> {
        try {
            let { id, ends_at } = raceUpdateEndsAtPayload;

            ends_at = Validator.dateTime.stringToDefaultDate(String(ends_at));

            const corrida = await this.racesRepository.getById(id);

            if (!corrida) throw new Error(ErrorsMessages.CORRIDA_NOT_FOUND);

            if (ends_at.getTime() <= corrida.starts_at.getTime())
                throw new Error(ErrorsMessages.ENDS_AT_MUST_BE_GREATER_THAN_REGISTERED_STARTS_AT);

            const raceUpdatedEndsAt = await this.racesRepository.updateEndsAt(id, ends_at);

            return { success: true, data: raceUpdatedEndsAt };
        } catch (error) {
            throw new Error(error);
        }
    }
}
