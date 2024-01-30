import { Race } from "@prisma/client";
import Validator from "src/Utils/Validator";
import { RacesRepositoryPort } from "src/Repositories/Races.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import { KartsRepositoryPort } from "src/Repositories/Karts.repository";
import { RoadsRepositoryPort } from "src/Repositories/Roads.repository";

interface RaceCreateUseCaseResponse {
    success: boolean;
    data?: Race;
}

export interface RaceCreateDTO {
    kart_id: string;
    road_id: string;
    starts_at: string | Date;
}

export interface RaceCreateUseCasePort {
    execute(userId: string, raceCreatePayload: RaceCreateDTO): Promise<RaceCreateUseCaseResponse>;
}

export default class RaceCreateUseCase implements RaceCreateUseCasePort {
    constructor(
        private readonly racesRepository: RacesRepositoryPort,
        private readonly kartsRepository: KartsRepositoryPort,
        private readonly roadsRepository: RoadsRepositoryPort,
    ) {}

    async execute(userId: string, raceCreatePayload: RaceCreateDTO): Promise<RaceCreateUseCaseResponse> {
        try {
            let { kart_id, road_id, starts_at } = raceCreatePayload;

            if (!(await this.kartsRepository.getById(kart_id))) throw new Error(ErrorsMessages.KART_NOT_FOUND);

            if (!(await this.roadsRepository.getById(road_id))) throw new Error(ErrorsMessages.ROAD_NOT_FOUND);

            starts_at = Validator.dateTime.stringToDefaultDate(String(starts_at));

            const thereIsARaceAlreadyCreatedDuringThisPeriod =
                await this.racesRepository.thereIsARaceAlreadyCreatedDuringThisPeriod(road_id, starts_at);

            if (thereIsARaceAlreadyCreatedDuringThisPeriod)
                throw new Error(ErrorsMessages.THERE_IS_A_RACE_ALREADY_CREATED_DURING_THIS_PERIOD);

            const had_an_schedule_during_this_period = await this.racesRepository.hadAnScheduleDuringThisPeriod(
                userId,
                road_id,
                starts_at,
            );

            const raceCreated = await this.racesRepository.create({
                user_id: userId,
                kart_id,
                road_id,
                starts_at,
                had_an_schedule_during_this_period,
            });

            return { success: true, data: raceCreated };
        } catch (error) {
            throw new Error(error);
        }
    }
}
