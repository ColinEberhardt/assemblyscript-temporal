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
  parseISOString,
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
    const parsed = parseISOString(date);
    return new PlainDate(
      parsed.year,
      parsed.month,
      parsed.day
    );
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

  until(date: PlainDate, largestUnit: TimeComponent = TimeComponent.Days): Duration {
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

  since(date: PlainDate, largestUnit: TimeComponent = TimeComponent.Days): Duration {
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
        : durationToAdd as Duration;

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

  subtract<T = DurationLike>(durationToSubtract: T, overflow: Overflow = Overflow.Constrain): PlainDate {
    const duration =
      durationToSubtract instanceof DurationLike
        ? durationToSubtract.toDuration()
        // @ts-ignore TS2352
        : durationToSubtract as Duration;

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
      overflow
    );

    return new PlainDate(newDate.year, newDate.month, newDate.day);
  }

  static compare(a: PlainDate, b: PlainDate): i32 {
    if (a === b) return 0;
    return compareTemporalDate(a.year, a.month, a.day, b.year, b.month, b.day);
  }
}
