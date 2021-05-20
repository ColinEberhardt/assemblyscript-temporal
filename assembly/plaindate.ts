import { Duration, DurationLike } from "./duration";
import { Overflow, TimeComponent } from "./enums";
import { PlainDateTime } from "./plaindatetime";
import { PlainMonthDay } from "./plainmonthday";
import { PlainTime } from "./plaintime";
import { PlainYearMonth } from "./plainyearmonth";
import {
  clamp,
  toPaddedString,
  coalesce,
  checkRange,
  compare,
  floorDiv,
} from "./util";
import {
  dayOfWeek,
  leapYear,
  dayOfYear,
  weekOfYear,
  daysInMonth,
  daysInYear,
  checkDateTimeRange
} from "./util/calendar"
import {
  parseISOString
} from "./util/format"

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
      return PlainDate.fromString(<string>date);
    } else {
      if (isReference<T>()) {
        if (date instanceof PlainDate) {
          return PlainDate.fromPlainDate(date);
        } else if (date instanceof DateLike) {
          return PlainDate.fromDateLike(date);
        }
      }
      throw new TypeError("invalid date type");
    }
  }

  static balanced(year: i32, month: i32, day: i32): PlainDate {
    const yearMonth = PlainYearMonth.balanced(year, month);

    year  = yearMonth.year;
    month = yearMonth.month;

    let daysPerYear = 0;
    let testYear = month > 2 ? year : year - 1;

    while (((daysPerYear = daysInYear(testYear)), day < -daysPerYear)) {
      year -= 1;
      testYear -= 1;
      day += daysPerYear;
    }

    testYear += 1;

    while (((daysPerYear = daysInYear(testYear)), day > daysPerYear)) {
      year += 1;
      testYear += 1;
      day -= daysPerYear;
    }

    while (day < 1) {
      const yearMonth = PlainYearMonth.balanced(year, month - 1);
      year  = yearMonth.year;
      month = yearMonth.month;
      day  += daysInMonth(year, month);
    }

    let monthDays = 0;
    while (monthDays = daysInMonth(year, month), day > monthDays) {
      const yearMonth = PlainYearMonth.balanced(year, month + 1);
      year  = yearMonth.year;
      month = yearMonth.month;
      day  -= monthDays;
    }

    return new PlainDate(year, month, day);
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
    return new PlainDate(parsed.year, parsed.month, parsed.day);
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

  // @ts-ignore
  until<T = DateLike>(
    dateLike: T,
    largestUnit: TimeComponent = TimeComponent.Days
  ): Duration {
    const date = PlainDate.from(dateLike);
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

  since<T = DateLike>(
    dateLike: T,
    largestUnit: TimeComponent = TimeComponent.Days
  ): Duration {
    const date = PlainDate.from(dateLike);
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
      coalesce(dateLike.year, this.year, -1),
      coalesce(dateLike.month, this.month, -1),
      coalesce(dateLike.day, this.day, -1)
    );
  }

  add<T = DurationLike>(
    durationToAdd: T,
    overflow: Overflow = Overflow.Constrain
  ): PlainDate {
    const duration = Duration.from(durationToAdd);

    const balancedDuration = Duration.balanced(
      duration.days,
      duration.hours,
      duration.minutes,
      duration.seconds,
      duration.milliseconds,
      duration.microseconds,
      duration.nanoseconds,
      TimeComponent.Days
    );
    return addDate(
      this.year,
      this.month,
      this.day,
      duration.years,
      duration.months,
      duration.weeks,
      balancedDuration.days,
      overflow
    );
  }

  subtract<T = DurationLike>(
    durationToSubtract: T,
    overflow: Overflow = Overflow.Constrain
  ): PlainDate {
    const duration = Duration.from(durationToSubtract);

    const balancedDuration = Duration.balanced(
      duration.days,
      duration.hours,
      duration.minutes,
      duration.seconds,
      duration.milliseconds,
      duration.microseconds,
      duration.nanoseconds,
      TimeComponent.Days
    );

    return addDate(
      this.year,
      this.month,
      this.day,
      -duration.years,
      -duration.months,
      -duration.weeks,
      -balancedDuration.days,
      overflow
    );
  }

  toPlainDateTime(time: PlainTime | null = null): PlainDateTime {
    if (time) {
      return new PlainDateTime(
        this.year,
        this.month,
        this.day,
        time.hour,
        time.minute,
        time.second,
        time.millisecond,
        time.microsecond,
        time.nanosecond
      );
    } else {
      return new PlainDateTime(this.year, this.month, this.day);
    }
  }

  toPlainYearMonth(): PlainYearMonth {
    return new PlainYearMonth(this.year, this.month);
  }

  toPlainMonthDay(): PlainMonthDay {
    return new PlainMonthDay(this.month, this.day);
  }

  static compare(a: PlainDate, b: PlainDate): i32 {
    if (a === b) return 0;
    return compare(
      [a.year, a.month, a.day],
      [b.year, b.month, b.day]
    );
  }
}

// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2984
function addDate(
  year: i32,
  month: i32,
  day: i32,
  years: i32,
  months: i32,
  weeks: i32,
  days: i32,
  overflow: Overflow
): PlainDate {
  year  += years;
  month += months;

  const yearMonth = PlainYearMonth.balanced(year, month);
  year  = yearMonth.year;
  month = yearMonth.month;

  const regulatedDate = regulateDate(year, month, day, overflow);
  year  = regulatedDate.year;
  month = regulatedDate.month;
  day   = regulatedDate.day;
  day  += days + weeks * 7;

  const balancedDate = PlainDate.balanced(year, month, day);
  year  = balancedDate.year;
  month = balancedDate.month;
  day   = balancedDate.day;

  return new PlainDate(year, month, day);
}

function rejectDate(year: i32, month: i32, day: i32): void {
  if (!checkRange(month, 1, 12)) {
    throw new RangeError("month out of range");
  }
  if (!checkRange(day, 1, daysInMonth(year, month))) {
    throw new RangeError("day out of range");
  }
}

// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2617
function constrainDate(year: i32, month: i32, day: i32): PlainDate {
  month = clamp(month, 1, 12);
  day   = clamp(day, 1, daysInMonth(year, month));
  return new PlainDate(year, month, day);
}

// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2617
function regulateDate(
  year: i32,
  month: i32,
  day: i32,
  overflow: Overflow
): PlainDate {
  switch (overflow) {
    case Overflow.Reject:
      rejectDate(year, month, day);
      break;

    case Overflow.Constrain:
      const date = constrainDate(year, month, day);
      year  = date.year;
      month = date.month;
      day   = date.day;
      break;
  }

  return new PlainDate(year, month, day);
}


function differenceDate(
  yr1: i32, mo1: i32, d1: i32,
  yr2: i32, mo2: i32, d2: i32,
  largestUnit: TimeComponent = TimeComponent.Days
): Duration {
  switch (largestUnit) {
    case TimeComponent.Years:
    case TimeComponent.Months: {
      let sign = -compare(
        [yr1, mo1, d1],
        [yr2, mo2, d2]
      );
      if (sign == 0) return new Duration();

      let startYear  = yr1;
      let startMonth = mo1;

      let endYear  = yr2;
      let endMonth = mo2;
      let endDay   = d2;

      let years = endYear - startYear;
      let mid = new PlainDate(yr1, mo1, d1)
        .add(new Duration(years), Overflow.Constrain);
      let midSign = -compare(
        [mid.year, mid.month, mid.day],
        [yr2, mo2, d2]
      );

      if (midSign === 0) {
        return largestUnit === TimeComponent.Years
          ? new Duration(years)
          : new Duration(0, years * 12);
      }

      let months = endMonth - startMonth;

      if (midSign !== sign) {
        years  -= sign;
        months += sign * 12;
      }

      mid = new PlainDate(yr1, mo1, d1)
        .add(new Duration(years, months), Overflow.Constrain);
      midSign = -compare(
        [mid.year, mid.month, mid.day], 
        [yr2, mo2, d2]
      );

      if (midSign === 0) {
        return largestUnit === TimeComponent.Years
          ? new Duration(years, months)
          : new Duration(0, months + years * 12);
      }

      if (midSign !== sign) {
        // The end date is later in the month than mid date (or earlier for
        // negative durations). Back up one month.
        months -= sign;

        if (months === -sign) {
          years -= sign;
          months = sign * 11;
        }

        mid = new PlainDate(yr1, mo1, d1)
          .add(new Duration(years, months), Overflow.Constrain);
      }

      let days = endDay - mid.day; // If we get here, months and years are correct (no overflow), and `mid`
      // is within the range from `start` to `end`. To count the days between
      // `mid` and `end`, there are 3 cases:
      // 1) same month: use simple subtraction
      // 2) end is previous month from intermediate (negative duration)
      // 3) end is next month from intermediate (positive duration)

      if (mid.month === endMonth && mid.year === endYear) {
        // 1) same month: use simple subtraction
      } else if (sign < 0) {
        // 2) end is previous month from intermediate (negative duration)
        // Example: intermediate: Feb 1, end: Jan 30, DaysInMonth = 31, days = -2
        days -= daysInMonth(endYear, endMonth);
      } else {
        // 3) end is next month from intermediate (positive duration)
        // Example: intermediate: Jan 29, end: Feb 1, DaysInMonth = 31, days = 3
        days += daysInMonth(mid.year, mid.month);
      }

      if (largestUnit === TimeComponent.Months) {
        months += years * 12;
        years = 0;
      }

      return new Duration(years, months, 0, days);
    }

    case TimeComponent.Weeks:
    case TimeComponent.Days: {
      let neg = compare(
        [yr1, mo1, d1],
        [yr2, mo2, d2]
      ) < 0;

      let smallerYear  = neg ? yr1 : yr2;
      let smallerMonth = neg ? mo1 : mo2;
      let smallerDay   = neg ? d1 : d2;

      let largerYear  = neg ? yr2 : yr1;
      let largerMonth = neg ? mo2 : mo1;
      let largerDay   = neg ? d2 : d1;

      let sign = neg ? 1 : -1;

      let years = largerYear - smallerYear;

      let days = (
        dayOfYear(largerYear,  largerMonth,  largerDay) -
        dayOfYear(smallerYear, smallerMonth, smallerDay)
      );

      while (years > 0) {
        days  += daysInYear(smallerYear + years - 1);
        years -= 1;
      }

      let weeks = 0;
      if (largestUnit === TimeComponent.Weeks) {
        weeks = floorDiv(days, 7);
        days -= weeks * 7;
      }

      return new Duration(0, 0, weeks * sign, days * sign);
    }

    default:
      throw new Error('differenceDate - cannot support TimeComponent < Days');
  }
}