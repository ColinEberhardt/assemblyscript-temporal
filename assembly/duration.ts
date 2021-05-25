import { RegExp } from "assemblyscript-regex";

import { PlainDateTime } from "./plaindatetime";
import { TimeComponent } from "./enums";
import { coalesce, sign } from "./util";
import {
  MICROS_PER_SECOND,
  MILLIS_PER_SECOND,
  NANOS_PER_SECOND
} from "./util/constants";

// @ts-ignore
@lazy
const NULL = i32.MAX_VALUE;

export class DurationLike {
  years: i32 = NULL;
  months: i32 = NULL;
  weeks: i32 = NULL;
  days: i32 = NULL;
  hours: i32 = NULL;
  minutes: i32 = NULL;
  seconds: i32 = NULL;
  milliseconds: i64 = NULL;
  microseconds: i64 = NULL;
  nanoseconds: i64 = NULL;

  toDuration(): Duration {
    return new Duration(
      this.years != NULL ? this.years : 0,
      this.months != NULL ? this.months : 0,
      this.weeks != NULL ? this.weeks : 0,
      this.days != NULL ? this.days : 0,
      this.hours != NULL ? this.hours : 0,
      this.minutes != NULL ? this.minutes : 0,
      this.seconds != NULL ? this.seconds : 0,
      this.milliseconds != NULL ? this.milliseconds : 0,
      this.microseconds != NULL ? this.microseconds : 0,
      this.nanoseconds != NULL ? this.nanoseconds : 0,
    );
  }
}

export class Duration {
  static from<T = DurationLike>(duration: T): Duration {
    if (isString<T>()) {
      return Duration.fromString(changetype<string>(duration));
    } else if (duration instanceof DurationLike) {
      return Duration.fromDurationLike(duration);
    } else if (duration instanceof Duration) {
      return Duration.fromDuration(duration);
    }
    throw new TypeError("invalid duration type");
  }

  private static fromDuration(duration: Duration): Duration {
    return new Duration(
      duration.years,
      duration.months,
      duration.weeks,
      duration.days,
      duration.hours,
      duration.minutes,
      duration.seconds,
      duration.milliseconds,
      duration.microseconds,
      duration.nanoseconds
    );
  }

  private static fromString(duration: string): Duration {
    const regex = new RegExp(
      "([+−-])?P(?:(\\d+)Y)?(?:(\\d+)M)?(?:(\\d+)W)?(?:(\\d+)D)?(?:T?(?:(\\d+)?H)?(?:(\\d+)?M)?(?:(\\d+)(?:[.,](\\d{1,9}))?S)?)?$",
      "i"
    );
    const match = regex.exec(duration);
    if (match == null) {
      throw new RangeError("invalid duration: " + duration);
    }
    if (match.matches.slice(2).join("") == "") {
      throw new RangeError("invalid duration");
    }
    const sign = match.matches[1] == '-' || match.matches[1] == '\u2212' ? -1 : 1;
    const years = match.matches[2] != "" ? I32.parseInt(match.matches[2]) * sign : 0;
    const months = match.matches[3] != "" ? I32.parseInt(match.matches[3]) * sign : 0;
    const weeks = match.matches[4] != "" ? I32.parseInt(match.matches[4]) * sign : 0;
    const days = match.matches[5] != "" ? I32.parseInt(match.matches[5]) * sign : 0;
    const hours = match.matches[6] != "" ? I32.parseInt(match.matches[6]) * sign : 0;
    const minutes = match.matches[7] != "" ? I32.parseInt(match.matches[7]) * sign : 0;
    const seconds = match.matches[8] != "" ? I32.parseInt(match.matches[8]) * sign : 0;
    const fraction = match.matches[9] + "000000000";
    const millisecond = I32.parseInt(fraction.substring(0, 3)) * sign;
    const microsecond = I32.parseInt(fraction.substring(3, 6)) * sign;
    const nanosecond = I32.parseInt(fraction.substring(6, 9)) * sign;

    return new Duration(
      years, months, weeks, days,
      hours, minutes, seconds,
      millisecond,
      microsecond,
      nanosecond
    );
  }

  private static fromDurationLike(d: DurationLike): Duration {
    return d.toDuration();
  }

  constructor(
    public years: i32 = 0,
    public months: i32 = 0,
    public weeks: i32 = 0,
    public days: i32 = 0,
    public hours: i32 = 0,
    public minutes: i32 = 0,
    public seconds: i32 = 0,
    public milliseconds: i64 = 0,
    public microseconds: i64 = 0,
    public nanoseconds: i64 = 0
  ) {
    // durationSign returns the sign of the first non-zero component
    const sig = this.sign;
    if (
      (years && sign(years) != sig) ||
      (months && sign(months) != sig) ||
      (weeks && sign(weeks) != sig) ||
      (days && sign(days) != sig) ||
      (hours && sign(hours) != sig) ||
      (minutes && sign(minutes) != sig) ||
      (seconds && sign(seconds) != sig) ||
      (milliseconds && sign(milliseconds) != sig) ||
      (microseconds && sign(microseconds) != sig) ||
      (nanoseconds && sign(nanoseconds) != sig)
    ) {
      throw new RangeError("mixed-sign values not allowed as duration fields");
    }
  }

  with(durationLike: DurationLike): Duration {
    return new Duration(
      coalesce(durationLike.years, this.years, NULL),
      coalesce(durationLike.months, this.months, NULL),
      coalesce(durationLike.weeks, this.weeks, NULL),
      coalesce(durationLike.days, this.days, NULL),
      coalesce(durationLike.hours, this.hours, NULL),
      coalesce(durationLike.minutes, this.minutes, NULL),
      coalesce(durationLike.seconds, this.seconds, NULL),
      coalesce(durationLike.milliseconds, this.milliseconds, NULL),
      coalesce(durationLike.microseconds, this.microseconds, NULL),
      coalesce(durationLike.nanoseconds, this.nanoseconds, NULL)
    );
  }

  get sign(): i32 {
    if (this.years) return sign(this.years);
    if (this.months) return sign(this.months);
    if (this.weeks) return sign(this.weeks);
    if (this.days) return sign(this.days);
    if (this.hours) return sign(this.hours);
    if (this.minutes) return sign(this.minutes);
    if (this.seconds) return sign(this.seconds);
    if (this.milliseconds) return sign(this.milliseconds as i32);
    if (this.microseconds) return sign(this.microseconds as i32);
    if (this.nanoseconds) return sign(this.nanoseconds as i32);
    return 0;
  }

  get blank(): bool {
    return this.sign == 0;
  }

  private get largestDurationUnit(): TimeComponent {
    if (this.years) return TimeComponent.Years;
    if (this.months) return TimeComponent.Months;
    if (this.weeks) return TimeComponent.Weeks;
    if (this.days) return TimeComponent.Days;
    if (this.hours) return TimeComponent.Hours;
    if (this.minutes) return TimeComponent.Minutes;
    if (this.seconds) return TimeComponent.Seconds;
    if (this.milliseconds) return TimeComponent.Milliseconds;
    if (this.microseconds) return TimeComponent.Microseconds;
    return TimeComponent.Nanoseconds;
  }

  // P1Y1M1DT1H1M1.1S
  toString(): string {
    const date =
      toString(abs(this.years), "Y") +
      toString(abs(this.months), "M") +
      toString(abs(this.weeks), "W") +
      toString(abs(this.days), "D");

    const time =
      toString(abs(this.hours), "H") +
      toString(abs(this.minutes), "M") +
      toString(abs(
          // sort in ascending order for better sum precision
          f64(this.nanoseconds)  / NANOS_PER_SECOND +
          f64(this.microseconds) / MICROS_PER_SECOND +
          f64(this.milliseconds) / MILLIS_PER_SECOND +
          f64(this.seconds)
        ),
        "S"
      );

    if (!date.length && !time.length) return "PT0S";
    return (
      (this.sign < 0 ? "-" : "") + "P" + date + (time.length ? "T" + time : "")
    );
  }

  add<T = DurationLike>(durationToAdd: T, relativeTo: PlainDateTime | null = null): Duration {
    const duration = Duration.from(durationToAdd);
    const largestUnit = min<i32>(this.largestDurationUnit, duration.largestDurationUnit);

    if (!relativeTo) {
      if (
        largestUnit == TimeComponent.Years  ||
        largestUnit == TimeComponent.Months ||
        largestUnit == TimeComponent.Weeks
      ) throw new RangeError("relativeTo is required for years, months, or weeks arithmetic");

      const balanced = balancedDuration(
        this.days + duration.days,
        this.hours + duration.hours,
        this.minutes + duration.minutes,
        this.seconds + duration.seconds,
        this.milliseconds + duration.milliseconds,
        this.microseconds + duration.microseconds,
        this.nanoseconds + duration.nanoseconds,
        largestUnit
      );
      return balanced;
    } else {
      const datePart = relativeTo.toPlainDate();

      const dateDuration1 = new Duration(this.years, this.months, this.weeks, this.days);
      const dateDuration2 = new Duration(duration.years, duration.months, duration.weeks, duration.days);

      const intermediate = datePart.add(dateDuration1);
      const end = intermediate.add(dateDuration2);

      const dateLargestUnit = min(largestUnit, TimeComponent.Days) as TimeComponent;
      const dateDiff = datePart.until(end, dateLargestUnit);

      const dur = balancedDuration(
        dateDiff.days,
        this.hours + duration.hours,
        this.minutes + duration.minutes,
        this.seconds + duration.seconds,
        this.milliseconds + duration.milliseconds,
        this.microseconds + duration.microseconds,
        this.nanoseconds + duration.nanoseconds,
        largestUnit
      );

      return new Duration(
        dateDiff.years, dateDiff.months, dateDiff.weeks,
        dur.days, dur.hours, dur.minutes, dur.seconds,
        dur.milliseconds, dur.microseconds, dur.nanoseconds
      );
    }
  }

  subtract<T = DurationLike>(durationToAdd: T, relativeTo: PlainDateTime | null = null): Duration {
    return this.add(Duration.from(durationToAdd).negated(), relativeTo);
  }

  negated(): Duration {
    return new Duration(
      -this.years,
      -this.months,
      -this.weeks,
      -this.days,
      -this.hours,
      -this.minutes,
      -this.seconds,
      -this.milliseconds,
      -this.microseconds,
      -this.nanoseconds
    );
  }

  abs(): Duration {
    return new Duration(
      abs(this.years),
      abs(this.months),
      abs(this.weeks),
      abs(this.days),
      abs(this.hours),
      abs(this.minutes),
      abs(this.seconds),
      abs(this.milliseconds),
      abs(this.microseconds),
      abs(this.nanoseconds)
    );
  }
}

function toString<T extends number>(value: T, suffix: string): string {
  if (value) return (isFloat<T>() ? stringify(value) : value.toString()) + suffix;
  return "";
}

// @ts-ignore: decorator
@inline
function stringify(value: f64): string {
  return F64.isSafeInteger(value) ? i64(value).toString() : value.toString();
}

function totalDurationNanoseconds(
  days: i64,
  hours: i64,
  minutes: i64,
  seconds: i64,
  milliseconds: i64,
  microseconds: i64,
  nanoseconds: i64
): i64 {
  hours += days * 24;
  minutes += hours * 60;
  seconds += minutes * 60;
  milliseconds += seconds * MILLIS_PER_SECOND;
  microseconds += milliseconds * 1000;
  return nanoseconds + microseconds * 1000;
}

export function balancedDuration(
  days: i32,
  hours: i32,
  minutes: i32,
  seconds: i32,
  milliseconds: i64,
  microseconds: i64,
  nanoseconds: i64,
  largestUnit: TimeComponent
): Duration {
  const durationNs = totalDurationNanoseconds(
    days as i64,
    hours as i64,
    minutes as i64,
    seconds as i64,
    milliseconds,
    microseconds,
    nanoseconds
  );

  let
    nanosecondsI64: i64 = 0,
    microsecondsI64: i64 = 0,
    millisecondsI64: i64 = 0,
    secondsI64: i64 = 0,
    minutesI64: i64 = 0,
    hoursI64: i64 = 0,
    daysI64: i64 = 0;

  if (
    largestUnit >= TimeComponent.Years &&
    largestUnit <= TimeComponent.Days
  ) {
    // inlined nanosecondsToDays
    const oneDayNs: i64 = 24 * 60 * 60 * NANOS_PER_SECOND;
    if (durationNs != 0) {
      daysI64        = durationNs / oneDayNs;
      nanosecondsI64 = durationNs % oneDayNs;
    }
  } else {
    nanosecondsI64 = durationNs;
  }

  const sig = i32(sign(nanosecondsI64));
  nanosecondsI64 = abs(nanosecondsI64);

  switch (largestUnit) {
    case TimeComponent.Years:
    case TimeComponent.Months:
    case TimeComponent.Weeks:
    case TimeComponent.Days:
    case TimeComponent.Hours:
      microsecondsI64 = nanosecondsI64 / 1000;
      nanosecondsI64  = nanosecondsI64 % 1000;

      millisecondsI64 = microsecondsI64 / 1000;
      microsecondsI64 = microsecondsI64 % 1000;

      secondsI64      = millisecondsI64 / 1000;
      millisecondsI64 = millisecondsI64 % 1000;

      minutesI64 = secondsI64 / 60;
      secondsI64 = secondsI64 % 60;

      hoursI64   = minutesI64 / 60;
      minutesI64 = minutesI64 % 60;
      break;

    case TimeComponent.Minutes:
      microsecondsI64 = nanosecondsI64 / 1000;
      nanosecondsI64  = nanosecondsI64 % 1000;

      millisecondsI64 = microsecondsI64 / 1000;
      microsecondsI64 = microsecondsI64 % 1000;

      secondsI64      = millisecondsI64 / 1000;
      millisecondsI64 = millisecondsI64 % 1000;

      minutesI64 = secondsI64 / 60;
      secondsI64 = secondsI64 % 60;
      break;

    case TimeComponent.Seconds:
      microsecondsI64 = nanosecondsI64 / 1000;
      nanosecondsI64  = nanosecondsI64 % 1000;

      millisecondsI64 = microsecondsI64 / 1000;
      microsecondsI64 = microsecondsI64 % 1000;

      secondsI64      = millisecondsI64 / 1000;
      millisecondsI64 = millisecondsI64 % 1000;
      break;

    case TimeComponent.Milliseconds:
      microsecondsI64 = nanosecondsI64 / 1000;
      nanosecondsI64  = nanosecondsI64 % 1000;

      millisecondsI64 = microsecondsI64 / 1000;
      microsecondsI64 = microsecondsI64 % 1000;
      break;

    case TimeComponent.Microseconds:
      microsecondsI64 = nanosecondsI64 / 1000;
      nanosecondsI64  = nanosecondsI64 % 1000;
      break;

    case TimeComponent.Nanoseconds:
      break;
  }

  return new Duration(
    0,
    0,
    0,
    i32(daysI64),
    i32(hoursI64) * sig,
    i32(minutesI64) * sig,
    i32(secondsI64) * sig,
    i32(millisecondsI64) * sig,
    i32(microsecondsI64) * sig,
    i32(nanosecondsI64) * sig
  );
}


