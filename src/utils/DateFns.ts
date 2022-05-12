import addMinutes from 'date-fns/addMinutes';
import compareDesc from 'date-fns/compareDesc';
import format from 'date-fns/format';
import getDate from 'date-fns/getDate';
import getHours from 'date-fns/getHours';
import getMinutes from 'date-fns/getMinutes';
import getMonth from 'date-fns/getMonth';
import getSeconds from 'date-fns/getSeconds';
import getYear from 'date-fns/getYear';
import isFuture from 'date-fns/isFuture';
import isValid from 'date-fns/isValid';
import isWeekend from 'date-fns/isWeekend';
import set from 'date-fns/set';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import isAfter from 'date-fns/isAfter';
import subMinutes from 'date-fns/subMinutes';
import endOfDay from 'date-fns/endOfDay';
class DateFns {
  public formatDateTime(date: Date, pattern: string) {
    return format(date, pattern);
  }

  public format(
    date: Date | number,
    pattern: string,
    options?: Parameters<typeof format>[2]
  ) {
    return format(date, pattern, options);
  }

  public combineDateTime(date: Date, time: Date): Date {
    const hours = getHours(time);
    const minutes = getMinutes(time);
    return setMinutes(setHours(date, hours), minutes);
  }

  public combine(date: Date, time: Date): Date {
    const hours = getHours(time);
    const minutes = getMinutes(time);
    const seconds = getSeconds(time);
    return set(date, { hours, minutes, seconds });
  }

  public compare(from: Date, to: Date): number {
    return compareDesc(from, to);
  }

  public utcToLocalDate(utc: string): Date {
    const date = new Date(utc);
    const localTime = date.getTime() - date.getTimezoneOffset() * 60 * 1000;
    return new Date(localTime);
  }

  public isFuture(date: string | null) {
    return isFuture(new Date(date || ''));
  }

  public isWeekend(date: Date | null) {
    if (!date) return false;
    return isWeekend(date);
  }

  public isSame(dateLeft: Date, dateRight: Date) {
    const isSameDate = getDate(dateLeft) === getDate(dateRight);
    const isSameMonth = getMonth(dateLeft) === getMonth(dateRight);
    const isSameYear = getYear(dateLeft) === getYear(dateRight);

    return isSameDate && isSameMonth && isSameYear;
  }

  public addMinutes(date: Date, amount: number) {
    return addMinutes(date, amount);
  }

  public subMinutes(date: Date, amount: number) {
    return subMinutes(date, amount);
  }

  public isValid(date: any): date is Date {
    return isValid(date);
  }

  public isAfter(date: Date, dateToCompare: Date): date is Date {
    return isAfter(date, dateToCompare);
  }

  public areValid(...dates: (Date | null)[]) {
    return dates.every((date) => date instanceof Date && isValid(date));
  }

  //not on dateFns
  public getFirstDayOfMonth() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  //not on dateFns
  public get30DayPriorCurrent() {
    const today = new Date();
    return new Date(new Date().setDate(today.getDate() - 30));
  }

  public getEndOfDay() {
    return endOfDay(new Date());
  }
}

export default new DateFns();
