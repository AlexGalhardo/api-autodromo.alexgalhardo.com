"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DateTime_1 = require("./DataTypes/DateTime");
const Kart_1 = require("./DataTypes/Kart");
const User_1 = require("./DataTypes/User");
class Validator {
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
Validator.DATE_TIME = new DateTime_1.default();
Validator.USER = new User_1.default();
Validator.KART = new Kart_1.default();
exports.default = Validator;
//# sourceMappingURL=Validator.js.map