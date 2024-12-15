export class TimeUtilities {
    static createDateAsUTC(date: Date) {
      return new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds()
        )
      );
    }
  
    static convertDateToUTC(date: Date) {
      return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      );
    }
  
    static getDateDifferentByMonths(numberOfMonths: number): Date {
      const now = new Date();
      const prevMonth = new Date(
        now.getFullYear(),
        now.getMonth() - numberOfMonths
      );
      return prevMonth;
    }
  
    static getFirstDayOfMonth(currentDate: Date): Date {
      const y = currentDate.getFullYear(),
        m = currentDate.getMonth();
      return new Date(y, m, 1);
    }
  
    static getLastDayOfMonth(currentDate: Date): Date {
      const y = currentDate.getFullYear(),
        m = currentDate.getMonth();
      return new Date(y, m + 1, 0);
    }
  }
  