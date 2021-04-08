import { RegExp } from "../node_modules/assemblyscript-regex/assembly/index";
import { Duration, DurationLike } from "./duration";
import { Overflow, TimeComponent } from "./enums";
import { PlainDate } from "./plaindate";
import { PlainDateTime } from "./plaindatetime";
import {
  balanceDuration,
  checkDateTimeRange,
  coalesce,
  compareTemporalDate,
  daysInMonth,
  durationSign,
  isoYearString,
  leapYear,
  toPaddedString,
} from "./utils";

export class YearMonthLike {
  year: i32 = -1;
  month: i32 = -1;
  referenceISODay: i32 = -1;
}

export class PlainYearMonth {
  @inline
  private static fromPlainYearMonth(yearMonth: PlainYearMonth): PlainYearMonth {
    return new PlainYearMonth(
      yearMonth.year,
      yearMonth.month,
      yearMonth.referenceISODay
    );
  }

  @inline
  private static fromYearMonthLike(yearMonth: YearMonthLike): PlainYearMonth {
    if (yearMonth.year == -1 || yearMonth.month == -1) {
      throw new TypeError("missing required property");
    }

    if (yearMonth.referenceISODay == -1) yearMonth.referenceISODay = 1;

    return new PlainYearMonth(
      yearMonth.year,
      yearMonth.month,
      yearMonth.referenceISODay
    );
  }

  @inline
  private static fromString(yearMonth: string): PlainYearMonth {
    const dateRegex = new RegExp(
      "^((?:[+\u2212-]\\d{6}|\\d{4}))-?(\\d{2})$",
      "i"
    );
    const match = dateRegex.exec(yearMonth);
    if (match != null) {
      let yearStr = match.matches[1];

      if (yearStr.charAt(0) === "\u2212")
        yearStr = "-" + yearStr.slice(1);
      // workaround for parsing "-009999" year strings
      if (yearStr.charAt(0) == "−")
        yearStr = "-" + I32.parseInt(yearStr.slice(1)).toString();

      return new PlainYearMonth(
        I32.parseInt(yearStr),
        I32.parseInt(match.matches[2])
      );
    } else {
      const dateTime = PlainDateTime.from(yearMonth);
      return new PlainYearMonth(dateTime.year, dateTime.month);
    }
  }

  @inline
  static from<T = YearMonthLike>(yearMonth: T): PlainYearMonth {
    if (isString<T>()) {
      // @ts-ignore: cast
      return this.fromString(<string>yearMonth);
    } else {
      if (isReference<T>()) {
        if (yearMonth instanceof PlainYearMonth) {
          return this.fromPlainYearMonth(yearMonth);
        } else if (yearMonth instanceof YearMonthLike) {
          return this.fromYearMonthLike(yearMonth);
        }
      }
      throw new TypeError("invalid yearMonth type");
    }
  }

  constructor(
    readonly year: i32,
    readonly month: i32,
    readonly referenceISODay: i32 = 1
  ) {
    if (!checkDateTimeRange(year, month, referenceISODay, 12)) {
      throw new RangeError("DateTime outside of supported range");
    }
  }

  @inline
  get daysInMonth(): i32 {
    return daysInMonth(this.year, this.month);
  }

  @inline
  get daysInYear(): i32 {
    return 365 + i32(leapYear(this.year));
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
    log(this);
    return isoYearString(this.year) + "-" + toPaddedString(this.month);
  }

  toPlainDate(day: i32): PlainDate {
    return new PlainDate(this.year, this.month, day);
  }

  @inline
  equals(other: PlainYearMonth): bool {
    if (this === other) return true;
    return (
      this.referenceISODay == other.referenceISODay &&
      this.month == other.month &&
      this.year == other.year
    );
  }

  until(
    yearMonth: PlainYearMonth,
    largestUnit: TimeComponent = TimeComponent.Days
  ): Duration {
    const thisDate = new PlainDate(this.year, this.month, this.referenceISODay);
    const otherDate = new PlainDate(
      yearMonth.year,
      yearMonth.month,
      yearMonth.referenceISODay
    );
    const result = thisDate.until(otherDate, largestUnit);
    return new Duration(result.years, result.months);
  }

  since(
    yearMonth: PlainYearMonth,
    largestUnit: TimeComponent = TimeComponent.Days
  ): Duration {
    const thisDate = new PlainDate(this.year, this.month, this.referenceISODay);
    const otherDate = new PlainDate(
      yearMonth.year,
      yearMonth.month,
      yearMonth.referenceISODay
    );
    const result = thisDate.until(otherDate, largestUnit);
    return new Duration(result.years, result.months);
  }

  with(yearMonth: YearMonthLike): PlainYearMonth {
    return new PlainYearMonth(
      coalesce(yearMonth.year, this.year),
      coalesce(yearMonth.month, this.month),
      coalesce(yearMonth.referenceISODay, this.referenceISODay)
    );
  }

  add<T = DurationLike>(
    durationToAdd: T,
    overflow: Overflow = Overflow.Constrain
  ): PlainYearMonth {
    const duration =
      durationToAdd instanceof DurationLike
        ? durationToAdd.toDuration()
        : // @ts-ignore TS2352
          (durationToAdd as Duration);

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

    const sign = durationSign(
      duration.years,
      duration.months,
      duration.weeks,
      balancedDuration.days,
      0,
      0,
      0,
      0,
      0,
      0
    );

    const day = sign < 0 ? daysInMonth(this.year, this.month) : 1;
    const startdate = new PlainDate(this.year, this.month, day);
    const addedDate = startdate.add(duration, overflow);
    return new PlainYearMonth(addedDate.year, addedDate.month, addedDate.day);
  }

  subtract<T = DurationLike>(
    durationToAdd: T,
    overflow: Overflow = Overflow.Constrain
  ): PlainYearMonth {
    const duration =
      durationToAdd instanceof DurationLike
        ? durationToAdd.toDuration()
        : // @ts-ignore TS2352
          (durationToAdd as Duration);

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

    const sign = durationSign(
      duration.years,
      duration.months,
      duration.weeks,
      balancedDuration.days,
      0,
      0,
      0,
      0,
      0,
      0
    );

    const day = sign < 0 ? daysInMonth(this.year, this.month) : 1;
    const startdate = new PlainDate(this.year, this.month, day);
    const addedDate = startdate.subtract(duration, overflow);
    return new PlainYearMonth(addedDate.year, addedDate.month, addedDate.day);
  }

  static compare(a: PlainYearMonth, b: PlainYearMonth): i32 {
    if (a === b) return 0;

    return compareTemporalDate(
      a.year,
      a.month,
      a.referenceISODay,
      b.year,
      b.month,
      b.referenceISODay
    );
  }
}
