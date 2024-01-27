import { Database } from "src/Utils/Database";
import { Injectable } from "@nestjs/common";

export interface PistasRepositoryPort {
}

@Injectable()
export default class PistasRepository implements PistasRepositoryPort {
    constructor(
        private readonly database: Database,
    ) {}
}
