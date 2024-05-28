import { Schedule } from "src/config/mongoose";
import { SchedulesRepositoryPort } from "src/Repositories/Schedules.repository";
import { KartsRepositoryPort } from "src/Repositories/Karts.repository";
import { RoadsRepositoryPort } from "src/Repositories/Roads.repository";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import Validator from "src/Utils/Validator";

interface ScheduleCreateUseCaseResponse {
    success: boolean;
    data?: typeof Schedule;
}

export interface ScheduleCreateDTO {
    kart_id: string;
    road_id: string;
    starts_at: string | Date;
    ends_at: string | Date;
}

export interface ScheduleCreateUseCasePort {
    execute(userId: string, kartCreatePayload: ScheduleCreateDTO): Promise<ScheduleCreateUseCaseResponse>;
}

export default class ScheduleCreateUseCase implements ScheduleCreateUseCasePort {
    constructor(
        private readonly schedulesRepository: SchedulesRepositoryPort,
        private readonly kartsRepository: KartsRepositoryPort,
        private readonly roadsRepository: RoadsRepositoryPort,
    ) {}

    async execute(userId: string, scheduleCreatePayload: ScheduleCreateDTO): Promise<ScheduleCreateUseCaseResponse> {
        try {
            let { kart_id, road_id, starts_at, ends_at } = scheduleCreatePayload;

            starts_at = Validator.dateTime.stringToDefaultDate(String(starts_at));
            ends_at = Validator.dateTime.stringToDefaultDate(String(ends_at));

            const roadAvailableToSchedule = await this.roadsRepository.isAvailable(road_id, starts_at, ends_at);

            if (!roadAvailableToSchedule) throw new Error(ErrorsMessages.ROAD_IS_NOT_AVAILABLE);

            const kartAvailableToSchedule = await this.kartsRepository.isAvailable(kart_id, starts_at, ends_at);

            if (!kartAvailableToSchedule) throw new Error(ErrorsMessages.KART_IS_NOT_AVAILABLE);

            const scheduleCreated = await this.schedulesRepository.create({
                userId,
                kart_id,
                road_id,
                starts_at,
                ends_at,
            });

            return { success: true, data: scheduleCreated };
        } catch (error) {
            throw new Error(error);
        }
    }
}
