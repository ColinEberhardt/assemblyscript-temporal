import { durationSign } from "./utils";
import { MICROS_PER_SECOND, MILLIS_PER_SECOND, NANOS_PER_SECOND } from "./constants";

export class DurationLike {
  years: i32 = 0;
  months: i32 = 0;
  weeks: i32 = 0;
  days: i32 = 0;
  hours: i32 = 0;
  minutes: i32 = 0;
  seconds: i32 = 0;
  milliseconds: i32 = 0;
  microseconds: i32 = 0;
  nanoseconds: i32 = 0;

  toDuration(): Duration {
    return new Duration(
      this.years,
      this.months,
      this.weeks,
      this.days,
      this.hours,
      this.minutes,
      this.seconds,
      this.milliseconds,
      this.microseconds,
      this.nanoseconds
    );
  }
}

export class Duration {
  constructor(
    public years: i32 = 0,
    public months: i32 = 0,
    public weeks: i32 = 0,
    public days: i32 = 0,
    public hours: i32 = 0,
    public minutes: i32 = 0,
    public seconds: i32 = 0,
    public milliseconds: i32 = 0,
    public microseconds: i32 = 0,
    public nanoseconds: i32 = 0
  ) {}

  get sign(): i32 {
    return durationSign(
      this.years,
      this.months,
      this.weeks,
      this.days,
      this.hours,
      this.minutes,
      this.seconds,
      this.milliseconds,
      this.microseconds,
      this.nanoseconds
    );
  }

  // P1Y1M1DT1H1M1.1S
  toString(): string {
    const date =
      toString(this.years, "Y") +
      toString(this.months, "M") +
      toString(this.weeks, "W") +
      toString(this.days, "D");

    const time =
      toString(this.hours, "H") +
      toString(this.minutes, "M") +
      toString(
        // sort in ascending order for better sum precision
        f64(this.nanoseconds) / NANOS_PER_SECOND +
          f64(this.microseconds) / MICROS_PER_SECOND +
          f64(this.milliseconds) / MILLIS_PER_SECOND +
          f64(this.seconds),
        "S"
      );

    if (!date.length && !time.length) return "PT0S";
    return (
      (this.sign < 0 ? "-" : "") + "P" + date + (time.length ? "T" + time : "")
    );
  }
}

function toString<T extends number>(value: T, suffix: string): string {
  return value ? value.toString() + suffix : "";
}
