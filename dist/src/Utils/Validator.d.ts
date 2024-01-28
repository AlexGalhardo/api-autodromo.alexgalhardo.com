import DateTime from "./DataTypes/DateTime";
import Kart from "./DataTypes/Kart";
import User from "./DataTypes/User";
export default class Validator {
    private static readonly DATE_TIME;
    private static readonly USER;
    private static readonly KART;
    static get user(): User;
    static get dateTime(): DateTime;
    static get kart(): Kart;
}
