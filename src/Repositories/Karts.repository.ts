import { Injectable } from "@nestjs/common";
import { Kart, KartStatus } from "@prisma/client";
import { Database } from "src/Utils/Database";

interface newKartCreateDTO {
	status: KartStatus
	name: string
	marca: string
	modelo: string
	potencia: number
	marca_pneus: string
}

export interface KartsRepositoryPort {
	findByName(name: string): Promise<boolean>;
	create(newKart: newKartCreateDTO): Promise<Kart>;
}

@Injectable()
export default class KartsRepository implements KartsRepositoryPort {
    constructor(private readonly database: Database) {}

	public async findByName(name: string): Promise<boolean> {
		return await this.database.kart.findUnique({
			where: {
				name
			}
		}) ? true : false
	}

	public async create(newKart: newKartCreateDTO): Promise<Kart> {
		try {
			const { status, name, marca, modelo, potencia, marca_pneus } = newKart;

			return await this.database.kart.create({
				data: {
					status,
					name,
					marca,
					modelo,
					potencia,
					marca_pneus
				},
			});
		}
		catch (error) {
			throw new Error(error);
		}
    }
}
