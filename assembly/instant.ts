import { NANOS_PER_SECOND } from "./util/constants";
import { balancedDuration, Duration, DurationLike } from "./duration";
import { TimeComponent } from "./enums";
import { PlainDateTime } from "./plaindatetime";
import { ord } from "./util";
import { formatISOString } from "./util/format";

export class Instant {
  @inline
  public static from<T>(instant: T): Instant {
    if (isString<T>()) {
      // @ts-ignore: cast
      const pdt = PlainDateTime.from(<string>instant);
      return new Instant(pdt.epochNanoseconds);
    } else {
      if (isReference<T>()) {
        if (instant instanceof Instant) {
          return new Instant(instant.epochNanoseconds);
        }
      }
      throw new TypeError("invalid instant type");
    }
  }

  @inline
  static compare(i1: Instant, i2: Instant): i32 {
    return ord(i1.epochNanoseconds, i2.epochNanoseconds);
  }

  @inline
  public static fromEpochSeconds(seconds: i64): Instant {
    return new Instant(seconds * NANOS_PER_SECOND);
  }

  @inline
  public static fromEpochMilliseconds(millis: i64): Instant {
    return new Instant(millis * 1_000_000);
  }

  @inline
  public static fromEpochMicroseconds(micros: i64): Instant {
    return new Instant(micros * 1_000);
  }

  @inline
  public static fromEpochNanoseconds(nanos: i64): Instant {
    return new Instant(nanos);
  }

  constructor(public epochNanoseconds: i64) {}

  @inline
  get epochMicroseconds(): i64 {
    return this.epochNanoseconds / 1_000;
  }

  @inline
  get epochMilliseconds(): i64 {
    return this.epochNanoseconds / 1_000_000;
  }

  @inline
  get epochSeconds(): i64 {
    return this.epochNanoseconds / NANOS_PER_SECOND;
  }

  add<T = DurationLike>(durationToAdd: T): Instant {
    const duration = Duration.from(durationToAdd);
    if (
      duration.years != 0 ||
      duration.months != 0 ||
      duration.weeks != 0 ||
      duration.days != 0
    ) {
      throw new RangeError("invalid duration field");
    }
    return new Instant(this.epochNanoseconds + durationToNanos(duration));
  }

  subtract<T = DurationLike>(durationToAdd: T): Instant {
    const duration = Duration.from(durationToAdd);
    if (
      duration.years != 0 ||
      duration.months != 0 ||
      duration.weeks != 0 ||
      duration.days != 0
    ) {
      throw new RangeError("invalid duration field");
    }
    return new Instant(this.epochNanoseconds - durationToNanos(duration));
  }

  since(
    instant: Instant,
    largestUnit: TimeComponent = TimeComponent.Seconds
  ): Duration {
    if (largestUnit <= TimeComponent.Days) {
      throw new RangeError("Largest unit must be smaller than days");
    }
    const diffNanos = this.epochNanoseconds - instant.epochNanoseconds;
    return balancedDuration(0, 0, 0, 0, 0, 0, diffNanos, largestUnit);
  }

  until(
    instant: Instant,
    largestUnit: TimeComponent = TimeComponent.Seconds
  ): Duration {
    if (largestUnit <= TimeComponent.Days) {
      throw new RangeError("Largest unit must be smaller than days");
    }
    const diffNanos = instant.epochNanoseconds - this.epochNanoseconds;
    return balancedDuration(0, 0, 0, 0, 0, 0, diffNanos, largestUnit);
  }

  equals<T>(other: T): boolean {
    const otherInstant = other instanceof Instant ? other : Instant.from(other);
    return this.epochNanoseconds == otherInstant.epochNanoseconds;
  }

  @inline
  toString(): string {
    const quotient = this.epochNanoseconds / 1_000_000;
    const remainder = this.epochNanoseconds % 1_000_000;
    let epochMilliseconds = +quotient;
    let nanos = +remainder;
    if (nanos < 0) {
      nanos += 1_000_000;
      epochMilliseconds -= 1;
    }
    const microsecond = i32((nanos / 1_000) % 1_000);
    const nanosecond = i32(nanos % 1_000);

    const item = new Date(epochMilliseconds);
    const year = item.getUTCFullYear();
    const month = item.getUTCMonth() + 1;
    const day = item.getUTCDate();
    const hour = item.getUTCHours();
    const minute = item.getUTCMinutes();
    const second = item.getUTCSeconds();
    const millisecond = item.getUTCMilliseconds();

    return (
      formatISOString(
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond
      ) + "Z"
    );
  }
}

function durationToNanos(duration: Duration): i64 {
  return (
    i64(duration.nanoseconds) +
    i64(duration.microseconds) * 1_000 +
    i64(duration.milliseconds) * 1_000_000 +
    i64(duration.seconds) * NANOS_PER_SECOND +
    i64(duration.minutes) * 60 * NANOS_PER_SECOND +
    i64(duration.hours) * 60 * 60 * NANOS_PER_SECOND
  );
}
