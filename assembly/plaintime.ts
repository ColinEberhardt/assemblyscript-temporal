import { sign, ord, checkRange, balanceDuration, addTime } from "./utils";
import { DurationLike } from "./duration"
import { TimeComponent } from "./enums";


export class TimeLike {
  hour: i32 = 0;
  minute: i32 = 0;
  second: i32 = 0;
  millisecond: i32 = 0;
  microsecond: i32 = 0;
  nanosecond: i32 = 0;
}

export class PlainTime {

  @inline
  static fromPlainTime(time: PlainTime): PlainTime {
    return new PlainTime(
      time.hour,
      time.minute,
      time.second,
      time.millisecond,
      time.microsecond,
      time.nanosecond
    );
  }

  @inline
  static fromTimeLike(time: TimeLike): PlainTime {
    return new PlainTime(
      time.hour,
      time.minute,
      time.second,
      time.millisecond,
      time.microsecond,
      time.nanosecond
    );
  }

  constructor(
    readonly hour: i32        = 0,
    readonly minute: i32      = 0,
    readonly second: i32      = 0,
    readonly millisecond: i32 = 0,
    readonly microsecond: i32 = 0,
    readonly nanosecond: i32  = 0
  ) {
    if (!(
      checkRange(hour,        0,  23) &&
      checkRange(minute,      0,  59) &&
      checkRange(second,      0,  59) &&
      checkRange(millisecond, 0, 999) &&
      checkRange(microsecond, 0, 999) &&
      checkRange(nanosecond,  0, 999)
    )) throw new RangeError("invalid plain time");
  }

  equals(other: PlainTime): bool {
    if (this === other) return true;
    return (
      this.nanosecond  == other.nanosecond  &&
      this.microsecond == other.microsecond &&
      this.millisecond == other.millisecond &&
      this.second == other.second &&
      this.minute == other.minute &&
      this.hour   == other.hour
    );
  }

  static compare(a: PlainTime, b: PlainTime): i32 {
    if (a === b) return 0;

    let res = a.hour - b.hour;
    if (res) return sign(res);

    res = a.minute - b.minute;
    if (res) return sign(res);

    res = a.second - b.second;
    if (res) return sign(res);

    res = a.millisecond - b.millisecond;
    if (res) return sign(res);

    res = a.microsecond - b.microsecond;
    if (res) return sign(res);

    return ord(a.nanosecond, b.nanosecond);
  }

  add<T>(durationToAdd: T): PlainTime {
    const duration =
      durationToAdd instanceof DurationLike
        ? durationToAdd.toDuration()
        : // @ts-ignore TS2352
          (durationToAdd as Duration);

    const balancedDuration = balanceDuration(
      duration.days,
      duration.hours,
      duration.minutes,
      duration.seconds,
      duration.milliseconds,
      duration.microseconds,
      duration.nanoseconds,
      TimeComponent.nanoseconds
    )
    const newTime = addTime(
      this.hour,
      this.minute,
      this.second,
      this.millisecond,
      this.microsecond,
      this.nanosecond,
      duration.hours,
      duration.minutes,
      duration.seconds,
      duration.milliseconds,
      duration.microseconds,
      balancedDuration.nanoseconds
    )
    return new PlainTime(
      newTime.hour,
      newTime.minute,
      newTime.second,
      newTime.millisecond,
      newTime.microsecond,
      newTime.nanosecond
    )
  }

  subtract<T>(durationToSubtract: T): PlainTime {
    const duration =
    durationToSubtract instanceof DurationLike
        ? durationToSubtract.toDuration()
        : // @ts-ignore TS2352
          (durationToSubtract as Duration);

    const balancedDuration = balanceDuration(
      duration.days,
      duration.hours,
      duration.minutes,
      duration.seconds,
      duration.milliseconds,
      duration.microseconds,
      duration.nanoseconds,
      TimeComponent.nanoseconds
    )
    const newTime = addTime(
      this.hour,
      this.minute,
      this.second,
      this.millisecond,
      this.microsecond,
      this.nanosecond,
      -duration.hours,
      -duration.minutes,
      -duration.seconds,
      -duration.milliseconds,
      -duration.microseconds,
      -balancedDuration.nanoseconds
    )
    return new PlainTime(
      newTime.hour,
      newTime.minute,
      newTime.second,
      newTime.millisecond,
      newTime.microsecond,
      newTime.nanosecond
    )
  }

}
