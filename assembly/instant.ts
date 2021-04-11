import { NANOS_PER_SECOND } from "./constants";
import { Duration, DurationLike } from "./duration";
import { addInstant, rejectInstant, sign } from "./utils";

export class Instant {
  // https://tc39.es/proposal-temporal/#sec-temporal.instant.from
  @inline
  static from<T = Instant>(item: T): Instant {
    if (item instanceof Instant) {
      return new Instant(item.epochNanoSeconds);
    }

    if (isString<T>()) {
      // TODO
      unreachable();
    }

    unreachable();
  }

  // https://tc39.es/proposal-temporal/#sec-temporal.instant.fromepochseconds
  @inline
  static fromEpochSeconds(epochSeconds: i32): Instant {
    const epochNanoSeconds = epochSeconds * NANOS_PER_SECOND;
    rejectInstant(epochNanoSeconds);
    return new Instant(epochNanoSeconds);
  }

  // https://tc39.es/proposal-temporal/#sec-temporal.instant.fromepochmilliseconds
  @inline
  static fromEpochMilliseconds(epochMilliseconds: i32): Instant {
    const epochNanoSeconds = epochMilliseconds * 1_000_000;
    rejectInstant(epochNanoSeconds);
    return new Instant(epochNanoSeconds);
  }

  // https://tc39.es/proposal-temporal/#sec-temporal.instant.fromepochmicroseconds
  @inline
  static fromEpochMicroseconds(epochMicroseconds: i32): Instant {
    const epochNanoSeconds = epochMicroseconds * 1000;
    rejectInstant(epochNanoSeconds);
    return new Instant(epochNanoSeconds);
  }

  // https://tc39.es/proposal-temporal/#sec-temporal.instant.fromepochnanoseconds
  @inline
  static fromEpochNanoseconds(epochNanoSeconds: i32): Instant {
    rejectInstant(epochNanoSeconds);
    return new Instant(epochNanoSeconds);
  }

  // https://tc39.es/proposal-temporal/#sec-temporal.instant.compare
  // https://tc39.es/proposal-temporal/#sec-temporal-compareepochnanoseconds
  // TODO: should be able to take strings
  @inline
  static compare(one: Instant, two: Instant): i32 {
    if (one === two) return 0;

    return sign(one.epochNanoSeconds - two.epochNanoSeconds);
  }

  // https://tc39.es/proposal-temporal/#sec-properties-of-temporal-instant-instances
  public epochNanoSeconds: i64;

  // https://tc39.es/proposal-temporal/#sec-temporal.instant
  constructor(epochNanoSeconds: i64) {
    this.epochNanoSeconds = epochNanoSeconds;
  }

  @inline
  get epochSeconds(): i32 {
    return this.epochNanoSeconds / NANOS_PER_SECOND;
  }

  @inline
  get epochMilliseconds(): i32 {
    return this.epochNanoSeconds / 1_000_000;
  }

  @inline
  get epochMicroseconds(): i32 {
    return this.epochNanoSeconds / 1_000;
  }
  // https://github.com/tc39/proposal-temporal/blob/3fe5d062f58e2aa01e016b14c34bf0881ba2fb31/polyfill/lib/instant.mjs#L54
  add(durationLike: DurationLike): Instant {
    const ns = addInstant(
      this.epochNanoSeconds,
      durationLike.hours,
      durationLike.minutes,
      durationLike.seconds,
      durationLike.milliseconds,
      durationLike.microseconds,
      durationLike.nanoseconds
    );
    return new Instant(ns);
  }

  // https://github.com/tc39/proposal-temporal/blob/3fe5d062f58e2aa01e016b14c34bf0881ba2fb31/polyfill/lib/instant.mjs#L79
  subtract(durationLike: DurationLike): Instant {
    const ns = addInstant(
      this.epochNanoSeconds,
      -durationLike.hours,
      -durationLike.minutes,
      -durationLike.seconds,
      -durationLike.milliseconds,
      -durationLike.microseconds,
      -durationLike.nanoseconds
    );
    return new Instant(ns);
  }
}
