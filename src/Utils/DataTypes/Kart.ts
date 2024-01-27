import { KartStatus } from "@prisma/client";

export default class Role {
    constructor() {
        this.statusIsValid = this.statusIsValid.bind(this);
    }

    public statusIsValid(status: string): boolean {
        return Object.values(KartStatus).includes(status as KartStatus);
    }

    public get methods() {
        return {
            isValid: this.statusIsValid,
        };
    }
}
