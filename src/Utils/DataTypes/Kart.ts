import { KartStatus } from "src/config/mongoose";

export default class Kart {
    public statusIsValid(status: string): boolean {
        return Object.values(KartStatus).includes(status as KartStatus);
    }
}
