import { UserRole } from "@prisma/client";

export default class Role {
    constructor() {
        this.isValid = this.isValid.bind(this);
    }

    public isValid(role: string): boolean {
        return Object.values(UserRole).includes(role as UserRole);
    }

    public get methods() {
        return {
            isValid: this.isValid,
        };
    }
}
