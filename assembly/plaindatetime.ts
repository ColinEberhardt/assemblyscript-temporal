import { Duration, DurationLike } from "./duration";
import { Overflow, TimeComponent } from "./enums";
import { PlainTime } from "./plaintime";
import { PlainDate } from "./plaindate";
import { PlainYearMonth } from "./plainyearmonth";
import { PlainMonthDay } from "./plainmonthday";
import { coalesce, larger, compare } from "./util";
import {
  dayOfWeek,
  leapYear,
  dayOfYear,
  weekOfYear,
  daysInMonth,
  daysInYear,
  epochFromParts
} from "./util/calendar";
import { formatISOString, parseISOString } from "./util/format";

// @ts-ignore
@lazy
const NULL = -1;

export class DateTimeLike {
  year: i32 = -1;
  month: i32 = -1;
  day: i32 = -1;
  hour: i32 = -1;
  minute: i32 = -1;
  second: i32 = -1;
  millisecond: i32 = -1;
  microsecond: i32 = -1;
  nanosecond: i32 = -1;

  toPlainDateTime(): PlainDateTime {
    if (this.year == NULL || this.month == NULL || this.day == NULL) {
      throw new TypeError("missing required property");
    }
    return new PlainDateTime(
      this.year != NULL ? this.year : 0,
      this.month != NULL ? this.month : 0,
      this.day != NULL ? this.day : 0,
      this.hour != NULL ? this.hour : 0,
      this.minute != NULL ? this.minute : 0,
      this.second != NULL ? this.second : 0,
      this.millisecond != NULL ? this.millisecond : 0,
      this.microsecond != NULL ? this.microsecond : 0,
      this.nanosecond != NULL ? this.nanosecond : 0
    );
  }
}

export class PlainDateTime {
  @inline
  static from<T = DateTimeLike>(date: T): PlainDateTime {
    if (isString<T>()) {
      // @ts-ignore: cast
      return PlainDateTime.fromString(<string>date);
    } else {
      if (isReference<T>()) {
        if (date instanceof PlainDateTime) {
          return PlainDateTime.fromPlainDateTime(date);
        } else if (date instanceof DateTimeLike) {
          return PlainDateTime.fromDateTimeLike(date);
        }
      }
      throw new TypeError("invalid date type");
    }
  }

  @inline
  private static fromPlainDateTime(date: PlainDateTime): PlainDateTime {
    return new PlainDateTime(
      date.year,
      date.month,
      date.day,
      date.hour,
      date.minute,
      date.second,
      date.millisecond,
      date.microsecond,
      date.nanosecond
    );
  }

  @inline
  private static fromDateTimeLike(date: DateTimeLike): PlainDateTime {
    return date.toPlainDateTime();
  }

  private static fromString(date: string): PlainDateTime {
    const parsed = parseISOString(date);
    return new PlainDateTime(
      parsed.year,
      parsed.month,
      parsed.day,
      parsed.hour,
      parsed.minute,
      parsed.second,
      parsed.millisecond,
      parsed.microsecond,
      parsed.nanosecond
    );
  }

  constructor(
    readonly year: i32,
    readonly month: i32,
    readonly day: i32,
    readonly hour: i32 = 0,
    readonly minute: i32 = 0,
    readonly second: i32 = 0,
    readonly millisecond: i32 = 0,
    readonly microsecond: i32 = 0,
    readonly nanosecond: i32 = 0
  ) {}

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
  get epochNanoseconds(): i64 {
    return epochFromParts(
      this.year,
      this.month,
      this.day,
      this.hour,
      this.minute,
      this.second,
      this.millisecond,
      this.microsecond,
      this.nanosecond
    );
  }

  with(dateTimeLike: DateTimeLike): PlainDateTime {
    return new PlainDateTime(
      coalesce(dateTimeLike.year, this.year),
      coalesce(dateTimeLike.month, this.month),
      coalesce(dateTimeLike.day, this.day),
      coalesce(dateTimeLike.hour, this.hour),
      coalesce(dateTimeLike.minute, this.minute),
      coalesce(dateTimeLike.second, this.second),
      coalesce(dateTimeLike.millisecond, this.millisecond),
      coalesce(dateTimeLike.microsecond, this.microsecond),
      coalesce(dateTimeLike.nanosecond, this.nanosecond)
    );
  }

  until<T = DateTimeLike>(
    otherLike: T,
    largestUnit: TimeComponent = TimeComponent.Days
  ): Duration {
    const other = PlainDateTime.from(otherLike);

    const diffTime = this.toPlainTime().until(
      other.toPlainTime()
    );
  
    const balancedDate = PlainDate.balanced(this.year, this.month, this.day + diffTime.days);
    const diffDate = balancedDate.until(
      other.toPlainDate(),
      larger(largestUnit, TimeComponent.Days)
    );
  
    // Signs of date part and time part may not agree; balance them together
    const balancedBoth = Duration.balanced(
      diffDate.days,
      diffTime.hours,
      diffTime.minutes,
      diffTime.seconds,
      diffTime.milliseconds,
      diffTime.microseconds,
      diffTime.nanoseconds,
      largestUnit
    );
    return new Duration(
      diffDate.years,
      diffDate.months,
      diffDate.weeks,
      balancedBoth.days,
      balancedBoth.hours,
      balancedBoth.minutes,
      balancedBoth.seconds,
      balancedBoth.milliseconds,
      balancedBoth.microseconds,
      balancedBoth.nanoseconds
    );
  }

  since<T = DateTimeLike>(
    otherLike: T,
    largestUnit: TimeComponent = TimeComponent.Days
  ): Duration {
    return PlainDateTime.from(otherLike).until(this, largestUnit);
  }

  toString(): string {
    return formatISOString(
      this.year,
      this.month,
      this.day,
      this.hour,
      this.minute,
      this.second,
      this.millisecond,
      this.microsecond,
      this.nanosecond
    );
  }

  toPlainTime(): PlainTime {
    return new PlainTime(
      this.hour,
      this.minute,
      this.second,
      this.millisecond,
      this.microsecond,
      this.nanosecond
    );
  }

  toPlainDate(): PlainDate {
    return new PlainDate(this.year, this.month, this.day);
  }

  toPlainYearMonth(): PlainYearMonth {
    return new PlainYearMonth(this.year, this.month);
  }

  toPlainMonthDay(): PlainMonthDay {
    return new PlainMonthDay(this.month, this.day);
  }

  static compare(a: PlainDateTime, b: PlainDateTime): i32 {
    if (a === b) return 0;
    return compare(
      [
        a.year,
        a.month,
        a.day,
        a.hour,
        a.minute,
        a.second,
        a.millisecond,
        a.microsecond,
        a.nanosecond
      ],
      [
        b.year,
        b.month,
        b.day,
        b.hour,
        b.minute,
        b.second,
        b.millisecond,
        b.microsecond,
        b.nanosecond
      ]
    );
  }

  @inline
  equals(other: PlainDateTime): bool {
    if (this === other) return true;
    return (
      this.nanosecond == other.nanosecond &&
      this.microsecond == other.microsecond &&
      this.millisecond == other.millisecond &&
      this.second == other.second &&
      this.minute == other.minute &&
      this.hour == other.hour &&
      this.day == other.day &&
      this.month == other.month &&
      this.year == other.year
    );
  }

  add<T = DurationLike>(
    durationToAdd: T,
    overflow: Overflow = Overflow.Constrain
  ): PlainDateTime {
    const duration = Duration.from(durationToAdd);

    const addedTime = PlainTime.balanced(
      duration.hours + this.hour,
      duration.minutes + this.minute,
      duration.seconds + this.second,
      duration.milliseconds + this.millisecond as i64,
      duration.microseconds + this.microsecond as i64,
      duration.nanoseconds + this.nanosecond as i64
    );

    const addedDate = new PlainDate(this.year, this.month, this.day).add(
      new Duration(duration.years, duration.months, duration.weeks, duration.days + addedTime.deltaDays),
      overflow
    );
  
    return new PlainDateTime(
      addedDate.year,
      addedDate.month,
      addedDate.day,
      addedTime.hour,
      addedTime.minute,
      addedTime.second,
      addedTime.millisecond,
      addedTime.microsecond,
      addedTime.nanosecond
    );
  }

  subtract<T = DurationLike>(
    durationToSubtract: T,
    overflow: Overflow = Overflow.Constrain
  ): PlainDateTime {
    return this.add(Duration.from(durationToSubtract).negated(), overflow);
  }
}
