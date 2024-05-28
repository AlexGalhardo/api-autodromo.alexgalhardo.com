import { Injectable } from "@nestjs/common";
import { Database } from "src/Utils/Database";
import { Maintenance, Race, RaceStatus, Schedule } from "src/config/mongoose";

interface RaceCreateRepositoryDTO {
	user_id: string;
	kart_id: string;
	road_id: string;
	starts_at: Date;
	had_an_schedule_during_this_period: boolean;
}

export interface RacesRepositoryPort {
	getAll();
	inRace(kartId: string, startAt: Date, endsAt: Date);
	getById(raceId: string);
	getHistory(userId: string);
	create(newRace: RaceCreateRepositoryDTO);
	hadAnScheduleDuringThisPeriod(userId: string, pistaId: string, startsAt: Date): Promise<boolean>;
	thereIsARaceAlreadyCreatedDuringThisPeriod(pistaId: string, startsAt: Date): Promise<boolean>;
	updateEndsAt(raceId: string, endsAt: Date);
	updateStatus(raceId: string, status: RaceStatus);
}

@Injectable()
export default class RacesRepository implements RacesRepositoryPort {
	constructor(private readonly database: Database) { }

	public async getAll() {
		return await Race.find();
	}

	public async inRace(kartId: string, startAt: Date, endsAt: Date): Promise<boolean> {
		return await Maintenance.exists({
			kart_id: kartId,
			starts_at: { $lte: endsAt },
			ends_at: { $gte: startAt },
		}) ? true : false
	}

	public async getById(raceId: string) {
		return await Race.findById(raceId);
	}

	public async getHistory(userId: string) {
		return await Race.find({ user_id: userId }).populate("user", "name email").populate("kart", "name").populate("road", "name");
	}

	public async create(newRace: any) {
		try {
			const { user_id, kart_id, road_id, starts_at, had_an_schedule_during_this_period } = newRace;

			return await Race.create({
				user_id,
				kart_id,
				road_id,
				starts_at,
				ends_at: null,
				had_an_schedule_during_this_period,
				status: RaceStatus.SCHEDULED,
			});
		} catch (error) {
			throw new Error(error);
		}
	}

	public async updateEndsAt(raceId: string, endsAt: Date) {
		try {
			return await Race.findByIdAndUpdate(raceId, { ends_at: endsAt }, { new: true });
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public async updateStatus(raceId: string, status: RaceStatus) {
		try {
			return await Race.findByIdAndUpdate(raceId, { status }, { new: true });
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public async hadAnScheduleDuringThisPeriod(userId: string, pistaId: string, startsAt: Date): Promise<boolean> {
		return await Schedule.exists({
			user_id: userId,
			road_id: pistaId,
			starts_at: startsAt,
		}) ? true : false
	}

	public async thereIsARaceAlreadyCreatedDuringThisPeriod(pistaId: string, startsAt: Date): Promise<boolean> {
		const startsAtMinus60Minutes = new Date(startsAt.getTime() - 60 * 60000);
		const endsAtPlus60Minutes = new Date(startsAt.getTime() + 60 * 60000);

		return await Race.exists({
			road_id: pistaId,
			status: RaceStatus.SCHEDULED,
			ends_at: null,
			starts_at: {
				$gte: startsAtMinus60Minutes,
				$lte: endsAtPlus60Minutes,
			},
		}) ? true : false
	}
}
