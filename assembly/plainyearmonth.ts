import { RegExp } from "../node_modules/assemblyscript-regex/assembly/index";
import { PlainDateTime } from "./plaindatetime";
import { checkDateTimeRange, daysInMonth, leapYear } from "./utils";

export class YearMonthLike {
  year: i32 = -1;
  month: i32 = -1;
  referenceISODay: i32 = 1;
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
    return new PlainYearMonth(
      yearMonth.year,
      yearMonth.month,
      yearMonth.referenceISODay
    );
  }

  @inline
  private static fromString(yearMonth: string): PlainYearMonth {
    const dateRegex = new RegExp("^((?:[+\u2212-]\d{6}|\d{4}))-?(\d{2})$", "i");
    const match = dateRegex.exec(yearMonth);
    if (match != null) {
      let yearStr = match.matches[1];
      return new PlainYearMonth(
        I32.parseInt(
          yearStr === "\u2212" ? "-" + yearStr.substring(1) : yearStr
        ),
        I32.parseInt(match.matches[2])
      );
    } else {
      const dateTime = PlainDateTime.from(yearMonth);
      return new PlainYearMonth(dateTime.year, dateTime.month, dateTime.day);
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
}
