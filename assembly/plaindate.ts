import { RegExp } from "assemblyscript-regex";

import { Duration, DurationLike } from "./duration";
import { Overflow, TimeComponent } from "./enums";
import {
  addDate,
  dayOfWeek,
  leapYear,
  dayOfYear,
  weekOfYear,
  daysInMonth,
  daysInYear,
  balanceDuration,
  toPaddedString,
  rejectDate,
  checkDateTimeRange,
  compareTemporalDate,
  differenceDate,
  coalesce,
} from "./utils";

export class DateLike {
  year: i32 = -1;
  month: i32 = -1;
  day: i32 = -1;
}

export class PlainDate {
  @inline
  static from<T = DateLike>(date: T): PlainDate {
    if (isString<T>()) {
      // @ts-ignore: cast
      return this.fromString(<string>date);
    } else {
      if (isReference<T>()) {
        if (date instanceof PlainDate) {
          return this.fromPlainDate(date);
        } else if (date instanceof DateLike) {
          return this.fromDateLike(date);
        }
      }
      throw new TypeError("invalid date type");
    }
  }

  @inline
  private static fromPlainDate(date: PlainDate): PlainDate {
    return new PlainDate(date.year, date.month, date.day);
  }

  @inline
  private static fromDateLike(date: DateLike): PlainDate {
    if (date.year == -1 || date.month == -1 || date.day == -1) {
      throw new TypeError("missing required property");
    }
    return new PlainDate(date.year, date.month, date.day);
  }

  private static fromString(date: string): PlainDate {
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

  constructor(readonly year: i32, readonly month: i32, readonly day: i32) {
    rejectDate(year, month, day);

    if (!checkDateTimeRange(year, month, day, 12)) {
      throw new RangeError("DateTime outside of supported range");
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
    return daysInYear(this.year);
  }

  @inline
  get monthsInYear(): i32 {
    return 12;
  }

  @inline
  get inLeapYear(): bool {
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
      this.day == other.day &&
      this.month == other.month &&
      this.year == other.year
    );
  }

  until(
    date: PlainDate,
    largestUnit: TimeComponent = TimeComponent.Days
  ): Duration {
    return differenceDate(
      this.year,
      this.month,
      this.day,
      date.year,
      date.month,
      date.day,
      largestUnit
    );
  }

  since(
    date: PlainDate,
    largestUnit: TimeComponent = TimeComponent.Days
  ): Duration {
    return differenceDate(
      date.year,
      date.month,
      date.day,
      this.year,
      this.month,
      this.day,
      largestUnit
    );
  }

  with(dateLike: DateLike): PlainDate {
    return new PlainDate(
      coalesce(dateLike.year, this.year),
      coalesce(dateLike.month, this.month),
      coalesce(dateLike.day, this.day)
    );
  }

  add<T = DurationLike>(durationToAdd: T, overflow: Overflow = Overflow.Constrain): PlainDate {
    const duration =
      durationToAdd instanceof DurationLike
        ? durationToAdd.toDuration()
        // @ts-ignore TS2352
        : (durationToAdd as Duration);

    const balancedDuration = balanceDuration(
      duration.days,
      duration.hours,
      duration.minutes,
      duration.seconds,
      duration.milliseconds,
      duration.microseconds,
      duration.nanoseconds,
      TimeComponent.Days
    );
    const newDate = addDate(
      this.year,
      this.month,
      this.day,
      duration.years,
      duration.months,
      duration.weeks,
      balancedDuration.days,
      overflow
    );
    return new PlainDate(newDate.year, newDate.month, newDate.day);
  }

  subtract<T = DurationLike>(durationToSubtract: T): PlainDate {
    const duration =
      durationToSubtract instanceof DurationLike
        ? durationToSubtract.toDuration()
        // @ts-ignore TS2352
        : (durationToSubtract as Duration);

    const balancedDuration = balanceDuration(
      duration.days,
      duration.hours,
      duration.minutes,
      duration.seconds,
      duration.milliseconds,
      duration.microseconds,
      duration.nanoseconds,
      TimeComponent.Days
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

    return compareTemporalDate(a.year, a.month, a.day, b.year, b.month, b.day);
  }
}
