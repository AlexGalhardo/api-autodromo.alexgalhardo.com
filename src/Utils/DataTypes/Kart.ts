import { KartStatus } from "@prisma/client";

export default class Kart {
    public statusIsValid(status: string): boolean {
        return Object.values(KartStatus).includes(status as KartStatus);
    }
}
