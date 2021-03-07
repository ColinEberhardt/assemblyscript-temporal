import { RegExp } from "../node_modules/assemblyscript-regex/assembly/index";

import { Duration } from "./duration";
import { log } from "./env";
import {
  ord,
  sign,
  TimeComponent,
  addDate,
  dayOfWeek,
  Overflow,
  leapYear,
  dayOfYear,
  weekOfYear,
  daysInMonth,
  balanceDuration,
  toPaddedString,
  checkRange,
  checkDateTimeRange
} from "./utils";

export class DateLike {
  year: i32 = -1;
  month: i32 = -1;
  day: i32 = -1;
}

export class PlainDate {
  private _daysInYear: i32 = 0;

  @inline
  static fromPlainDate(date: PlainDate): PlainDate {
    return new PlainDate(date.year, date.month, date.day);
  }

  @inline
  static fromDateLike(date: DateLike): PlainDate {
    if (date.year == -1 || date.month == -1 || date.day == -1) {
      throw new TypeError("missing required property");
    }
    return new PlainDate(date.year, date.month, date.day);
  }

  static fromString(date: string): PlainDate {
    const dateRegex = new RegExp(
      "^((?:[+-]\\d{6}|\\d{4}))(?:-(\\d{2})-(\\d{2})|(\\d{2})(\\d{2}))(?:(?:T|\\s+)(\\d{2})(?::(\\d{2})(?::(\\d{2})(?:[.,](\\d{1,9}))?)?|(\\d{2})(?:(\\d{2})(?:[.,](\\d{1,9}))?)?)?)?(?:([zZ])|(?:([+-])([01][0-9]|2[0-3])(?::?([0-5][0-9])(?::?([0-5][0-9])(?:[.,](\\d{1,9}))?)?)?)?)(?:\\[((?:(?:\\.\\.[-A-Za-z._]{1,12}|\\.[-A-Za-z_][-A-Za-z._]{0,12}|_[-A-Za-z._]{0,13}|[a-zA-Z](?:[A-Za-z._][-A-Za-z._]{0,12})?|[a-zA-Z]-(?:[-._][-A-Za-z._]{0,11})?|[a-zA-Z]-[a-zA-Z](?:[-._][-A-Za-z._]{0,10})?|[a-zA-Z]-[a-zA-Z][a-zA-Z](?:[A-Za-z._][-A-Za-z._]{0,9})?|[a-zA-Z]-[a-zA-Z][a-zA-Z]-(?:[-._][-A-Za-z._]{0,8})?|[a-zA-Z]-[a-zA-Z][a-zA-Z]-[a-zA-Z](?:[-._][-A-Za-z._]{0,7})?|[a-zA-Z]-[a-zA-Z][a-zA-Z]-[a-zA-Z][a-zA-Z](?:[-._][-A-Za-z._]{0,6})?)(?:\\/(?:\\.[-A-Za-z_]|\\.\\.[-A-Za-z._]{1,12}|\\.[-A-Za-z_][-A-Za-z._]{0,12}|[A-Za-z_][-A-Za-z._]{0,13}))*|Etc\\/GMT[-+]\\d{1,2}|(?:[+\\u2212-][0-2][0-9](?::?[0-5][0-9](?::?[0-5][0-9](?:[.,]\\d{1,9})?)?)?)))\\])?(?:\\[u-ca-((?:[A-Za-z0-9]{3,8}(?:-[A-Za-z0-9]{3,8})*))\\])?$",
      "i"
    );
    const match = dateRegex.exec(date);
    if (match != null) {
      return new PlainDate(
        I32.parseInt(match.matches[1]),
        // see https://github.com/ColinEberhardt/assemblyscript-regex/issues/38
        I32.parseInt(
          match.matches[2] != "" ? match.matches[2] : match.matches[19]
        ),
        I32.parseInt(
          match.matches[3] != "" ? match.matches[3] : match.matches[20]
        )
      );
    }
    throw new RangeError("invalid ISO 8601 string: " + date);
  }

  @inline
  static from<T>(date: T): PlainDate {
    if (isString<T>()) {
      // @ts-ignore: cast
      return this.fromString(<string>date);
    } else {
      if (isReference<T>()) {
        if (date instanceof PlainDate) {
          return new PlainDate(date.year, date.month, date.day);
        } else if (date instanceof DateLike) {
          return this.fromDateLike(date);
        }
      }
      throw new TypeError("invalid date type");
    }
  }

  constructor(readonly year: i32, readonly month: i32, readonly day: i32) {
    // if (!(
    //   checkRange(month, 1, 12) &&
    //   checkRange(day, 1, daysInMonth(year, month))
    // )) throw new RangeError("invalid plain date");

    if (!checkDateTimeRange(year, month, day, 12)) {
      throw new RangeError('DateTime outside of supported range')
    }
  }

  @inline
  get dayOfWeek(): i32 {
    return dayOfWeek(this.year, this.month, this.day);
  }

  @inline
  get dayOfYear(): i32 {
    return dayOfYear(this.year, this.month, this.day);
  }

  @inline
  get weekOfYear(): i32 {
    return weekOfYear(this.year, this.month, this.day);
  }

  @inline
  get daysInWeek(): i32 {
    return 7;
  }

  @inline
  get daysInMonth(): i32 {
    return daysInMonth(this.year, this.month);
  }

  @inline
  get daysInYear(): i32 {
    if (this._daysInYear) return this._daysInYear;
    return (this._daysInYear = 365 + i32(leapYear(this.year)));
  }

  @inline
  get monthsInYear(): i32 {
    return 12;
  }

  @inline
  get isLeapYear(): bool {
    return leapYear(this.year);
  }

  @inline
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

  @inline
  equals(other: PlainDate): bool {
    if (this === other) return true;
    return (
      this.day   == other.day   &&
      this.month == other.month &&
      this.year  == other.year
    );
  }

  with(dateLike: DateLike): PlainDate {
    const year = dateLike.year != -1 ? dateLike.year : this.year;
    const month = dateLike.month != -1 ? dateLike.month : this.month;
    const day = dateLike.day != -1 ? dateLike.day : this.day;
    return new PlainDate(year, month, day);
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

  subtract(duration: Duration): PlainDate {
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
      -duration.years,
      -duration.months,
      -duration.weeks,
      -balancedDuration.days,
      Overflow.Constrain
    );
    return new PlainDate(newDate.year, newDate.month, newDate.day);
  }

  static compare(a: PlainDate, b: PlainDate): i32 {
    if (a === b) return 0;

    let res = a.year - b.year;
    if (res) return sign(res);

    res = a.month - b.month;
    if (res) return sign(res);

    return ord(a.day, b.day);
  }
}
