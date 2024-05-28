import { Injectable } from "@nestjs/common";
import { Database } from "src/Utils/Database";
import { Schedule } from "src/config/mongoose";

interface ScheduleRepositoryCreateDTO {
	userId: string;
	kart_id: string;
	road_id: string;
	starts_at: Date;
	ends_at: Date;
}

export interface SchedulesRepositoryPort {
	getAll();
	create(schedule: ScheduleRepositoryCreateDTO);
}

@Injectable()
export default class SchedulesRepository implements SchedulesRepositoryPort {
	constructor(private readonly database: Database) { }

	public async getAll() {
		try {
			return await Schedule.find()
				.populate('user', 'name email')
				.populate('kart', 'name')
				.populate('road', 'name')
				.exec();
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public async create(schedule: ScheduleRepositoryCreateDTO): Promise<any> {
		try {
			const { userId, kart_id, road_id, starts_at, ends_at } = schedule;

			const newSchedule = new Schedule({
				user_id: userId,
				kart_id,
				road_id,
				starts_at,
				ends_at,
			});

			// Save the new schedule
			await newSchedule.save();

			// Populate the user, kart, and road fields
			await (await (await newSchedule.populate('user', 'name email')).populate('kart', 'name')).populate('road', 'name')

			return newSchedule;
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
