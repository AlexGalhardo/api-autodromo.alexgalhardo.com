import DateTime from "./DataTypes/DateTime";
import Kart from "./DataTypes/Kart";
import User from "./DataTypes/User";

export default class Validator {
    private static readonly DATE_TIME = new DateTime();
    private static readonly USER = new User();
    private static readonly KART = new Kart();

    static get user() {
        return this.USER;
    }

    static get dateTime() {
        return this.DATE_TIME;
    }

    static get kart() {
        return this.KART;
    }
}
