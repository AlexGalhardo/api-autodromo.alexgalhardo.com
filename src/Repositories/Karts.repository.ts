import { Injectable } from "@nestjs/common";
import { Database } from "src/Utils/Database";
// import { ErrorsMessages } from "src/Utils/ErrorsMessages";

export interface KartsRepositoryPort {

}

@Injectable()
export default class KartsRepository implements KartsRepositoryPort {
    constructor(
        private readonly database: Database,
    ) {}
}
