const monthsName = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

class SimpleDate {
    constructor(date){
        this.date = date ? new Date(date) : new Date();
    }

    /**
     * Return a string with a simple ISO format instead of native ISO format
     * native ISO format -> 1996-10-15T00:05:32.000Z
     * Returned simple ISO format -> 2020-May-2 17:10
     */
    readableIso = () =>{
        let year = this.date.getUTCFullYear();
        let month = this.getMonthAbbreviaton(this.date.getUTCMonth());
        let date = this.date.getUTCDate();
        let hours = this.date.getUTCHours();
        let minutes = this.date.getUTCMinutes();

        return `${year}-${month}-${date} ${hours}:${minutes}`;
    }

    /**
     * Return a month abbreviations name
     */
    getMonthAbbreviaton = (monthNumber) =>{
        return monthsName[monthNumber].substring(0,3);
    }

    /**
     * Allow user to append year, months, date, hours and minutes.
     * This function do not replace, it append time based on the actual time of this date.
     * passed arguments is an JSON object -> 
     * { year : 0 , months : 0, date : 0, hours : 0, minutes : 0 }
     * you can also only pass { months : 4 } to append 4 months to the actual date.
     */
    appendToDate = (args) =>{
        args.year ? this.date.setFullYear(this.date.getFullYear() + args.year) : null;
        args.months ? this.date.setMonth(this.date.getMonth() + args.months) : null;
        args.date ? this.date.setDate(this.date.getDate() + args.date) : null;
        args.hours ? this.date.setHours(this.date.getHours() + args.hours) : null;
        args.minutes ? this.date.setMinutes(this.date.getMinutes() + args.minutes) : null;

        return this.readableIso();
    }
}

module.exports = SimpleDate;