import { RegExp } from "../node_modules/assemblyscript-regex/assembly/index";

import { Duration } from "./duration";
import {
  TimeComponent,
  addDate,
  dayOfWeek,
  daysInMonth,
  Overflow,
  weekOfYear,
  balanceDuration,
} from "./es";

function toPaddedString(number: i32, length: i32 = 2): string {
  return number.toString().padStart(length, "0");
}

export class PlainDate {
  readonly daysInYear: i32;
  readonly inLeapYear: bool;

  constructor(
    readonly year: i32,
    readonly month: i32,
    readonly day: i32
  ) {}

  get dayOfWeek(): i32 {
    return dayOfWeek(this.year, this.month, this.day);
  }

  get dayOfYear(): i32 {
    let days = this.day;
    for (let m = this.month - 1; m > 0; m--) {
      days += daysInMonth(this.year, m);
    }
    return days;
  }

  get weekOfYear(): i32 {
    return weekOfYear(this.year, this.month, this.day);
  }

  get daysInWeek(): i32 {
    return 7;
  }

  get monthsInYear(): i32 {
    return 12;
  }

  get monthCode(): string {
    return (this.month >= 10 ? "M" : "M0") + this.month.toString();
  }

  toString(): string {
    return (
      this.year.toString() +
      "-" +
      toPaddedString(this.month) +
      "-" +
      toPaddedString(this.day)
    );
  }

  add(duration: Duration): PlainDate {
    const balancedDuration = balanceDuration(
      duration.days,
      duration.hours,
      duration.minutes,
      duration.seconds,
      duration.milliseconds,
      duration.microseconds,
      duration.nanoseconds,
      TimeComponent.days
    );

    const newDate = addDate(
      this.year,
      this.month,
      this.day,
      duration.years,
      duration.months,
      duration.weeks,
      balancedDuration.days,
      Overflow.Constrain
    );
    return new PlainDate(newDate.year, newDate.month, newDate.day);
  }

  static from(date: string): PlainDate {
    const dateRegex = new RegExp(
      "^((?:[+-]\\d{6}|\\d{4}))(?:-(\\d{2})-(\\d{2})|(\\d{2})(\\d{2}))(?:(?:T|\\s+)(\\d{2})(?::(\\d{2})(?::(\\d{2})(?:[.,](\\d{1,9}))?)?|(\\d{2})(?:(\\d{2})(?:[.,](\\d{1,9}))?)?)?)?(?:([zZ])|(?:([+-])([01][0-9]|2[0-3])(?::?([0-5][0-9])(?::?([0-5][0-9])(?:[.,](\\d{1,9}))?)?)?)?)(?:\\[((?:(?:\\.\\.[-A-Za-z._]{1,12}|\\.[-A-Za-z_][-A-Za-z._]{0,12}|_[-A-Za-z._]{0,13}|[a-zA-Z](?:[A-Za-z._][-A-Za-z._]{0,12})?|[a-zA-Z]-(?:[-._][-A-Za-z._]{0,11})?|[a-zA-Z]-[a-zA-Z](?:[-._][-A-Za-z._]{0,10})?|[a-zA-Z]-[a-zA-Z][a-zA-Z](?:[A-Za-z._][-A-Za-z._]{0,9})?|[a-zA-Z]-[a-zA-Z][a-zA-Z]-(?:[-._][-A-Za-z._]{0,8})?|[a-zA-Z]-[a-zA-Z][a-zA-Z]-[a-zA-Z](?:[-._][-A-Za-z._]{0,7})?|[a-zA-Z]-[a-zA-Z][a-zA-Z]-[a-zA-Z][a-zA-Z](?:[-._][-A-Za-z._]{0,6})?)(?:\\/(?:\\.[-A-Za-z_]|\\.\\.[-A-Za-z._]{1,12}|\\.[-A-Za-z_][-A-Za-z._]{0,12}|[A-Za-z_][-A-Za-z._]{0,13}))*|Etc\\/GMT[-+]\\d{1,2}|(?:[+\\u2212-][0-2][0-9](?::?[0-5][0-9](?::?[0-5][0-9](?:[.,]\\d{1,9})?)?)?)))\\])?(?:\\[u-ca-((?:[A-Za-z0-9]{3,8}(?:-[A-Za-z0-9]{3,8})*))\\])?$",
      "i"
    );
    const match = dateRegex.exec(date);
    if (match != null) {
      return new PlainDate(
        I32.parseInt(match.matches[1]),
        I32.parseInt(match.matches[2]),
        I32.parseInt(match.matches[3])
      );
    }
    throw new Error("foo");
  }
}
