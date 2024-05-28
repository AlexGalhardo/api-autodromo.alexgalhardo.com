import { Race, RaceStatus } from "src/config/mongoose";
import { RacesRepositoryPort } from "src/Repositories/Races.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";

interface RaceUpdateStatusUseCaseResponse {
    success: boolean;
    data?: typeof Race;
}

export interface RaceUpdateEndsAtDTO {
    id: string;
    status: RaceStatus;
}

export interface RaceUpdateStatusUseCasePort {
    execute(raceUpdateEndsAtPayload: RaceUpdateEndsAtDTO): Promise<RaceUpdateStatusUseCaseResponse>;
}

export default class RaceUpdateStatusUseCase implements RaceUpdateStatusUseCasePort {
    constructor(private readonly racesRepository: RacesRepositoryPort) {}

    async execute(raceUpdateEndsAtPayload: RaceUpdateEndsAtDTO): Promise<RaceUpdateStatusUseCaseResponse> {
        try {
            let { id, status } = raceUpdateEndsAtPayload;

            const corrida = await this.racesRepository.getById(id);

            if (!corrida) throw new Error(ErrorsMessages.RACE_NOT_FOUND);

            if (corrida.status !== RaceStatus.SCHEDULED) throw new Error(ErrorsMessages.CAN_NOT_UPDATE_CORRIDA_STATUS);

            const raceUpdatedStatus = await this.racesRepository.updateStatus(id, status);

            return { success: true, data: raceUpdatedStatus };
        } catch (error) {
            throw new Error(error);
        }
    }
}
