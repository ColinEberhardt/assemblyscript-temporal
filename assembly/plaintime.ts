import {
  sign,
  ord,
  checkRange,
  balanceDuration,
  addTime,
  toPaddedString,
  coalesce,
} from "./utils";
import { DurationLike } from "./duration";
import { TimeComponent } from "./enums";
import { RegExp } from "../node_modules/assemblyscript-regex/assembly/index";
import { PlainDateTime } from "./plaindatetime";
export class TimeLike {
  hour: i32 = -1;
  minute: i32 = -1;
  second: i32 = -1;
  millisecond: i32 = -1;
  microsecond: i32 = -1;
  nanosecond: i32 = -1;
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
  static fromPlainDateTime(date: PlainDateTime): PlainTime {
    return new PlainTime(
      date.hour,
      date.minute,
      date.second,
      date.millisecond,
      date.microsecond,
      date.nanosecond
    );
  }

  @inline
  static fromTimeLike(time: TimeLike): PlainTime {
    return new PlainTime(
      coalesce(time.hour, 0),
      coalesce(time.minute, 0),
      coalesce(time.second, 0),
      coalesce(time.millisecond, 0),
      coalesce(time.microsecond, 0),
      coalesce(time.nanosecond, 0)
    );
  }

  static fromString(time: string): PlainTime {
    const timeRegex = new RegExp(
      "^(\\d{2})(?::(\\d{2})(?::(\\d{2})(?:[.,](\\d{1,9}))?)?|(\\d{2})(?:(\\d{2})(?:[.,](\\d{1,9}))?)?)?(?:(?:([zZ])|(?:([+\u2212-])([01][0-9]|2[0-3])(?::?([0-5][0-9])(?::?([0-5][0-9])(?:[.,](\\d{1,9}))?)?)?)?)(?:\\[((?:(?:\\.[-A-Za-z_]|\\.\\.[-A-Za-z._]{1,12}|\\.[-A-Za-z_][-A-Za-z._]{0,12}|[A-Za-z_][-A-Za-z._]{0,13})(?:\\/(?:\\.[-A-Za-z_]|\\.\\.[-A-Za-z._]{1,12}|\\.[-A-Za-z_][-A-Za-z._]{0,12}|[A-Za-z_][-A-Za-z._]{0,13}))*|Etc\\/GMT[-+]\\d{1,2}|(?:[+\\u2212-][0-2][0-9](?::?[0-5][0-9](?::?[0-5][0-9](?:[.,]\\d{1,9})?)?)?)))\\])?)?(?:\\[u-ca=((?:[A-Za-z0-9]{3,8}(?:-[A-Za-z0-9]{3,8})*))\\])?$",
      "i"
    );
    const match = timeRegex.exec(time);
    let hour: i32,
      minute: i32,
      second: i32,
      millisecond: i32,
      microsecond: i32,
      nanosecond: i32;
    if (match != null) {
      hour = I32.parseInt(match.matches[1]);
      // see https://github.com/ColinEberhardt/assemblyscript-regex/issues/38
      minute = I32.parseInt(
        match.matches[2] != ""
          ? match.matches[2]
          : match.matches[5] != ""
          ? match.matches[5]
          : match.matches[13]
      );
      second = I32.parseInt(
        match.matches[3] != ""
          ? match.matches[3]
          : match.matches[6] != ""
          ? match.matches[6]
          : match.matches[14]
      );

      if (second === 60) second = 59;
      const fraction =
        (match.matches[4] != ""
          ? match.matches[4]
          : match.matches[7] != ""
          ? match.matches[7]
          : match.matches[15]) +
        "000000000";
      millisecond = I32.parseInt(fraction.substring(0, 3));
      microsecond = I32.parseInt(fraction.substring(3, 6));
      nanosecond = I32.parseInt(fraction.substring(6, 9));
      return new PlainTime(
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond
      );
    } else {
      const dateTime = PlainDateTime.fromString(time);
      return new PlainTime(
        dateTime.hour,
        dateTime.minute,
        dateTime.second,
        dateTime.millisecond,
        dateTime.microsecond,
        dateTime.nanosecond
      );
    }
  }

  @inline
  static from<T = TimeLike>(time: T): PlainTime {
    if (isString<T>()) {
      // @ts-ignore: cast
      return this.fromString(<string>time);
    } else {
      if (isReference<T>()) {
        if (time instanceof PlainTime) {
          return this.fromPlainTime(time);
        } else if (time instanceof TimeLike) {
          return this.fromTimeLike(time);
        } else if (time instanceof PlainDateTime) {
          return this.fromPlainDateTime(time)
        }
      }
      throw new TypeError("invalid time type");
    }
  }

  constructor(
    readonly hour: i32 = 0,
    readonly minute: i32 = 0,
    readonly second: i32 = 0,
    readonly millisecond: i32 = 0,
    readonly microsecond: i32 = 0,
    readonly nanosecond: i32 = 0
  ) {
    if (
      !(
        checkRange(hour, 0, 23) &&
        checkRange(minute, 0, 59) &&
        checkRange(second, 0, 59) &&
        checkRange(millisecond, 0, 999) &&
        checkRange(microsecond, 0, 999) &&
        checkRange(nanosecond, 0, 999)
      )
    )
      throw new RangeError("invalid plain time");
  }

  with(timeLike: TimeLike): PlainTime {
    return new PlainTime(
      coalesce(timeLike.hour, this.hour),
      coalesce(timeLike.minute, this.minute),
      coalesce(timeLike.second, this.second),
      coalesce(timeLike.millisecond, this.millisecond),
      coalesce(timeLike.microsecond, this.microsecond),
      coalesce(timeLike.nanosecond, this.nanosecond)
    );
  }

  toString(): string {
    // 22:54:31
    return (
      toPaddedString(this.hour) +
      ":" +
      toPaddedString(this.minute) +
      ":" +
      toPaddedString(this.second) +
      ((this.nanosecond | this.microsecond | this.millisecond) != 0
        ? (
            f64(this.nanosecond) / 1_000_000_000.0 +
            f64(this.microsecond) / 1_000_000.0 +
            f64(this.millisecond) / 1_000.0
          )
            .toString()
            .substring(1)
        : "")
    );
  }

  equals(other: PlainTime): bool {
    if (this === other) return true;
    return (
      this.nanosecond == other.nanosecond &&
      this.microsecond == other.microsecond &&
      this.millisecond == other.millisecond &&
      this.second == other.second &&
      this.minute == other.minute &&
      this.hour == other.hour
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
        // @ts-ignore TS2352
        : (durationToAdd as Duration);

    const balancedDuration = balanceDuration(
      duration.days,
      duration.hours,
      duration.minutes,
      duration.seconds,
      duration.milliseconds,
      duration.microseconds,
      duration.nanoseconds,
      TimeComponent.nanoseconds
    );
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
    );
    return new PlainTime(
      newTime.hour,
      newTime.minute,
      newTime.second,
      newTime.millisecond,
      newTime.microsecond,
      newTime.nanosecond
    );
  }

  subtract<T>(durationToSubtract: T): PlainTime {
    const duration =
      durationToSubtract instanceof DurationLike
        ? durationToSubtract.toDuration()
        // @ts-ignore TS2352
        : (durationToSubtract as Duration);

    const balancedDuration = balanceDuration(
      duration.days,
      duration.hours,
      duration.minutes,
      duration.seconds,
      duration.milliseconds,
      duration.microseconds,
      duration.nanoseconds,
      TimeComponent.nanoseconds
    );
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
    );
    return new PlainTime(
      newTime.hour,
      newTime.minute,
      newTime.second,
      newTime.millisecond,
      newTime.microsecond,
      newTime.nanosecond
    );
  }
}
