import { Injectable } from "@nestjs/common";
import { Pista } from "@prisma/client";
import { Database } from "src/Utils/Database";

interface newPistaCreateDTO {
	name: string
	kilometers: number
	quantidade_boxes: number
	quantidade_lugares: number
	endereco: string
}

export interface PistasRepositoryPort {
	findByName(name: string): Promise<boolean>;
	create(newPista: newPistaCreateDTO): Promise<Pista>;
}

@Injectable()
export default class PistasRepository implements PistasRepositoryPort {
    constructor(private readonly database: Database) {}

	public async findByName(name: string): Promise<boolean> {
		return await this.database.pista.findUnique({
			where: {
				name
			}
		}) ? true : false
	}

	public async create(newPista: newPistaCreateDTO): Promise<Pista> {
		try {
			const { name, kilometers, quantidade_boxes, quantidade_lugares, endereco } = newPista;

			return await this.database.pista.create({
				data: {
					name,
					kilometers,
					quantidade_boxes,
					quantidade_lugares,
					endereco,
				},
			});
		}
		catch (error) {
			throw new Error(error);
		}
    }
}
