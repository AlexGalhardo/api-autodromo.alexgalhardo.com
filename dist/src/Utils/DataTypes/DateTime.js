"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DateTime {
    static timestampToGetNow(timestamp) {
        const date = new Date(timestamp * 1000).toLocaleDateString(process.env.LOCALE_DATE_TIME);
        const time = new Date(timestamp * 1000).toLocaleTimeString(process.env.LOCALE_DATE_TIME);
        return `${date} ${time}`;
    }
    static getNow() {
        const date = new Date().toLocaleDateString(process.env.LOCALE_DATE_TIME);
        const time = new Date().toLocaleTimeString(process.env.LOCALE_DATE_TIME);
        return `${date} ${time}`;
    }
    static isToday(dateLastAPIRequest) {
        return new Date().getDate() === dateLastAPIRequest.getDate();
    }
    static isExpired(dateToCheck) {
        return dateToCheck <= new Date();
    }
    secondsToMilliseconds(seconds) {
        return seconds * 1000;
    }
    minutesToMilliseconds(minutes) {
        return minutes * 60000;
    }
    hoursToMilliseconds(hours) {
        return hours * 3600000;
    }
    daysToMilliseconds(days) {
        return days * 86400000;
    }
    get secondInMilliseconds() {
        return 1000;
    }
    get minuteInMilliseconds() {
        return 60000;
    }
    get hourInMilliseconds() {
        return 3600000;
    }
    stringToDefaultDate(dateString) {
        const [day, month, yearHour] = dateString.split("/");
        const [year, hourMinute] = yearHour.split(" ");
        const [hour, minute] = hourMinute.split(":");
        return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
    }
    get methods() {
        return {
            secondsToMilliseconds: this.secondsToMilliseconds,
            minutesToMilliseconds: this.minutesToMilliseconds,
            hoursToMilliseconds: this.hoursToMilliseconds,
            daysToMilliseconds: this.daysToMilliseconds,
            secondInMilliseconds: this.secondInMilliseconds,
            minuteInMilliseconds: this.minuteInMilliseconds,
            hourInMilliseconds: this.hourInMilliseconds,
        };
    }
}
exports.default = DateTime;
//# sourceMappingURL=DateTime.js.map