import { UserRole } from "@prisma/client";

export default class User {
    public roleIsValid(role: string): boolean {
        return Object.values(UserRole).includes(role as UserRole);
    }

    public emailIsValid(email: string): boolean {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    }

    public passowordIsSecure(plainTextPasswordToCheck: string): boolean {
        if (plainTextPasswordToCheck.length < 12) {
            return false;
        }

        const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;
        const uppercaseRegex = /[A-Z]/;
        const numberRegex = /[0-9]/;

        return (
            specialCharRegex.test(plainTextPasswordToCheck) &&
            uppercaseRegex.test(plainTextPasswordToCheck) &&
            numberRegex.test(plainTextPasswordToCheck)
        );
    }
}
