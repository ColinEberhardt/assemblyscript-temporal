import { RegExp } from "assemblyscript-regex";

import { Instant } from "./instant";
import { DateTimeLike, PlainDateTime } from "./plaindatetime";
import { TimeZone } from "./timezone";
import { JsDate } from "./date";
import { parseISOString } from "./utils";

export class ZonedDateTime {
  @inline
  static from<T = DateTimeLike>(date: T): ZonedDateTime {
    if (isString<T>()) {
      // @ts-ignore: cast
      return this.fromString(<string>date);
    } else {
      throw new TypeError("invalid date type");
    }
  }

  private static fromString(date: string): ZonedDateTime {
    const parsed = parseISOString(date);
    if (parsed.timezone == "") {
      throw new RangeError("time zone ID required in brackets");
    }
    const epochMillis = JsDate.UTC(
      parsed.year,
      parsed.month - 1,
      parsed.day,
      parsed.hour,
      parsed.minute,
      parsed.second,
      parsed.millisecond
    );
    const epochNanos =
      i64(epochMillis) * 1_000_000 +
      i64(parsed.microsecond) * 1_000 +
      i64(parsed.nanosecond);
    const timezone = new TimeZone(parsed.timezone);
    return new ZonedDateTime(
      epochNanos - timezone.getOffsetNanosecondsFor(new Instant(epochNanos)),
      timezone
    );
  }

  private plainDateTime: PlainDateTime;

  constructor(public epochNanos: i64, public tz: TimeZone) {
    this.plainDateTime = tz.getPlainDateTimeFor(new Instant(epochNanos));
  }

  toInstant(): Instant {
    return new Instant(this.epochNanos);
  }

  toPlainDateTime(): PlainDateTime {
    return this.plainDateTime;
  }

  get year(): i32 {
    return this.plainDateTime.year;
  }

  get month(): i32 {
    return this.plainDateTime.month;
  }

  get day(): i32 {
    return this.plainDateTime.day;
  }

  get hour(): i32 {
    return this.plainDateTime.hour;
  }

  get minute(): i32 {
    return this.plainDateTime.minute;
  }

  get second(): i32 {
    return this.plainDateTime.second;
  }

  get millisecond(): i32 {
    return this.plainDateTime.millisecond;
  }

  get microsecond(): i32 {
    return this.plainDateTime.microsecond;
  }

  get nanosecond(): i32 {
    return this.plainDateTime.nanosecond;
  }

  get offset(): string {
    return this.tz.getOffsetStringFor(this.toInstant());
  }

  toString(): string {
    return (
      this.toPlainDateTime().toString() +
      this.offset +
      "[" +
      this.tz.timezone +
      "]"
    );
  }
}
