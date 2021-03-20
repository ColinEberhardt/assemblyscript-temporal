import { DurationLike } from "./duration";
import { addInstant } from "./utils";

export class Instant {
  constructor(public epochNanoSeconds: i32) {}

  @inline
  get epochSeconds(): i32 {
    return i32(this.epochNanoSeconds / 1_000_000_000);
  }

  @inline
  get epochMillisconds(): i32 {
    return i32(this.epochNanoSeconds / 1_000_000);
  }

  @inline
  get epochMicroseconds(): i32 {
    return i32(this.epochNanoSeconds / 1_000);
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
