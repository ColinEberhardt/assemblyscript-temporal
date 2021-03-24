import {
  MICROS_PER_SECOND,
  MILLIS_PER_SECOND,
  NANOS_PER_SECOND,
} from "./constants";
import { Instant } from "./instant";
import { PlainDateTime } from "./plaindatetime";
import { TimeZone } from "./timezone";
import { toPaddedString } from "./utils";

export class ZonedDateTime {
  private plainDateTime: PlainDateTime;

  constructor(public epochNanos: i64, public tz: TimeZone) {
    this.plainDateTime = tz.getPlainDateTimeFor(new Instant(epochNanos));
  }

  toInstant(): Instant {
    return new Instant(this.epochNanos);
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
    // TODO: refactor from PlainDateTime
    // 1976-11-18T00:00:00
    return (
      this.year.toString() +
      "-" +
      toPaddedString(this.month) +
      "-" +
      toPaddedString(this.day) +
      "T" +
      toPaddedString(this.hour) +
      ":" +
      toPaddedString(this.minute) +
      ":" +
      toPaddedString(this.second) +
      (this.nanosecond != 0 || this.microsecond != 0 || this.millisecond != 0
        ? (
            f64(this.nanosecond) / NANOS_PER_SECOND +
            f64(this.microsecond) / MICROS_PER_SECOND +
            f64(this.millisecond) / MILLIS_PER_SECOND
          )
            .toString()
            .substring(1)
        : "") +
      this.offset
    );
  }
}
