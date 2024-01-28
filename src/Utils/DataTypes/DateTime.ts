import { ErrorsMessages } from "../ErrorsMessages";

export default class DateTime {
    public stringToDefaultDate(dateString: string): Date {
        try {
            const [day, month, yearHour] = dateString.split("/");
            const [year, hourMinute] = yearHour.split(" ");
            const [hour, minute] = hourMinute.split(":");

            if (day.length !== 2 || month.length !== 2 || year.length !== 4 || hour.length !== 2 || minute.length !== 2)
                throw new Error(ErrorsMessages.INVALID_DATE_STRING_FORMAT);

            if (Number(hour) < 0 || Number(hour) > 23) throw new Error(ErrorsMessages.INVALID_DATE_STRING_FORMAT);

            if (Number(minute) < 0 || Number(minute) > 59) throw new Error(ErrorsMessages.INVALID_DATE_STRING_FORMAT);

            return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
        } catch (error) {
            throw new Error(ErrorsMessages.INVALID_DATE_STRING_FORMAT);
        }
    }
}
