import { Duration, DurationLike } from "./duration";
import { Overflow, TimeComponent } from "./enums";
import { RegExp } from "assemblyscript-regex";
import { PlainDateTime } from "./plaindatetime";
import { DateLike } from "./plaindate";
import {
  sign,
  ord,
  toPaddedString,
  coalesce,
  clamp,
  arraySign,
  floorDiv,
  checkRange
} from "./utils";

export class TimeLike {
  hour: i32 = -1;
  minute: i32 = -1;
  second: i32 = -1;
  millisecond: i32 = -1;
  microsecond: i32 = -1;
  nanosecond: i32 = -1;
}

export class BalancedTime {
  deltaDays: i32;
  hour: i32;
  minute: i32;
  second: i32;
  millisecond: i32;
  microsecond: i32;
  nanosecond: i32;
}

export class PlainTime {
  @inline
  static from<T = TimeLike>(time: T): PlainTime {
    if (isString<T>()) {
      // @ts-ignore: cast
      return PlainTime.fromString(<string>time);
    } else {
      if (isReference<T>()) {
        if (time instanceof PlainTime) {
          return PlainTime.fromPlainTime(time);
        } else if (time instanceof TimeLike) {
          return PlainTime.fromTimeLike(time);
        } else if (time instanceof PlainDateTime) {
          return PlainTime.fromPlainDateTime(time);
        }
      }
      throw new TypeError("invalid time type");
    }
  }

  static balanced(
    hour: i64,
    minute: i64,
    second: i64,
    millisecond: i64,
    microsecond: i64,
    nanosecond: i64
  ): BalancedTime {
  
    let quotient = floorDiv(nanosecond, 1000);
    microsecond += quotient;
    nanosecond  -= quotient * 1000;
  
    quotient = floorDiv(microsecond, 1000);
    millisecond += quotient;
    microsecond -= quotient * 1000;
  
    quotient = floorDiv(millisecond, 1000);
    second      += quotient;
    millisecond -= quotient * 1000;
  
    quotient = floorDiv(second, 60);
    minute += quotient;
    second -= quotient * 60;
  
    quotient = floorDiv(minute, 60);
    hour   += quotient;
    minute -= quotient * 60;
  
    let deltaDays = floorDiv(hour, 24);
    hour -= deltaDays * 24;
  
    return {
      deltaDays: i32(deltaDays),
      hour: i32(hour),
      minute: i32(minute),
      second: i32(second),
      millisecond: i32(millisecond),
      microsecond: i32(microsecond),
      nanosecond: i32(nanosecond)
    };
  }

  @inline
  private static fromPlainTime(time: PlainTime): PlainTime {
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
  private static fromPlainDateTime(date: PlainDateTime): PlainTime {
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
  private static fromTimeLike(time: TimeLike): PlainTime {
    return new PlainTime(
      coalesce(time.hour, 0),
      coalesce(time.minute, 0),
      coalesce(time.second, 0),
      coalesce(time.millisecond, 0),
      coalesce(time.microsecond, 0),
      coalesce(time.nanosecond, 0)
    );
  }

  private static fromString(time: string): PlainTime {
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
          : match.matches[15]) + "000000000";
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
      const dateTime = PlainDateTime.from(time);
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

  constructor(
    readonly hour: i32 = 0,
    readonly minute: i32 = 0,
    readonly second: i32 = 0,
    readonly millisecond: i32 = 0,
    readonly microsecond: i32 = 0,
    readonly nanosecond: i32 = 0
  ) {
    rejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
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

  toPlainDateTime(dateLike: DateLike | null = null): PlainDateTime {
    let year = 0, month = 0, day = 0;
    if (dateLike !== null) {
       year  = coalesce(dateLike.year, 0);
       month = coalesce(dateLike.month, 0);
       day   = coalesce(dateLike.day, 0);
    }
    return new PlainDateTime(
      year,
      month,
      day,
      this.hour,
      this.minute,
      this.second,
      this.millisecond,
      this.microsecond,
      this.nanosecond
    );
  }

  until<T = TimeLike>(
    otherLike: T,
    largestUnit: TimeComponent = TimeComponent.Hours
  ): Duration {
    if (largestUnit >= TimeComponent.Years && largestUnit <= TimeComponent.Days) {
      throw new RangeError("higher units are not allowed");
    }

    const other = PlainTime.from(otherLike);

    let diffTime = differenceTime(
      this.hour,
      this.minute,
      this.second,
      this.millisecond,
      this.microsecond,
      this.nanosecond,
      other.hour,
      other.minute,
      other.second,
      other.millisecond,
      other.microsecond,
      other.nanosecond,
    )
    return Duration.balanced(
      // diffTime.days,
      0,
      diffTime.hours,
      diffTime.minutes,
      diffTime.seconds,
      diffTime.milliseconds,
      diffTime.microseconds,
      diffTime.nanoseconds,
      largestUnit
    );
  }

  since<T = TimeLike>(
    otherLike: T,
    largestUnit: TimeComponent = TimeComponent.Hours
  ): Duration {
    if (largestUnit >= TimeComponent.Years && largestUnit <= TimeComponent.Days) {
      throw new RangeError("higher units are not allowed");
    }

    const other = PlainTime.from(otherLike);

    let diffTime = differenceTime(
      this.hour,
      this.minute,
      this.second,
      this.millisecond,
      this.microsecond,
      this.nanosecond,
      other.hour,
      other.minute,
      other.second,
      other.millisecond,
      other.microsecond,
      other.nanosecond,
    )
    return Duration.balanced(
      // diffTime.days,
      0,
      -diffTime.hours,
      -diffTime.minutes,
      -diffTime.seconds,
      -diffTime.milliseconds,
      -diffTime.microseconds,
      -diffTime.nanoseconds,
      largestUnit
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

  add<T = DurationLike>(durationToAdd: T): PlainTime {
    const duration = Duration.from(durationToAdd);

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
      duration.nanoseconds
    );

    return regulateTime(
      newTime.hour,
      newTime.minute,
      newTime.second,
      newTime.millisecond,
      newTime.microsecond,
      newTime.nanosecond,
      Overflow.Reject
    )
  }

  subtract<T = DurationLike>(durationToSubtract: T): PlainTime {
    const duration = Duration.from(durationToSubtract);

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
      -duration.nanoseconds
    );

    return regulateTime(
      newTime.hour,
      newTime.minute,
      newTime.second,
      newTime.millisecond,
      newTime.microsecond,
      newTime.nanosecond,
      Overflow.Reject
    );
  }
}

// https://github.com/tc39/proposal-temporal/blob/515ee6e339bb4a1d3d6b5a42158f4de49f9ed953/polyfill/lib/ecmascript.mjs#L2874-L2910
export function differenceTime(
  h1: i32, m1: i32, s1: i32, ms1: i32, µs1: i32, ns1: i32,
  h2: i32, m2: i32, s2: i32, ms2: i32, µs2: i32, ns2: i32
): Duration {
  let hours = h2 - h1;
  let minutes = m2 - m1;
  let seconds = s2 - s1;
  let milliseconds = ms2 - ms1;
  let microseconds = µs2 - µs1;
  let nanoseconds = ns2 - ns1;

  const sign = arraySign([
    hours,
    minutes,
    seconds,
    milliseconds,
    microseconds,
    nanoseconds
  ]);

  const balancedTime = PlainTime.balanced(
    hours * sign,
    minutes * sign,
    seconds * sign,
    milliseconds * sign,
    microseconds * sign,
    nanoseconds * sign
  );

  return new Duration(
    0,
    0,
    0,
    balancedTime.deltaDays * sign,
    balancedTime.hour * sign,
    balancedTime.minute * sign,
    balancedTime.second * sign,
    balancedTime.millisecond * sign,
    balancedTime.microsecond * sign,
    balancedTime.nanosecond * sign
  );
}

function addTime(
  hour: i32,
  minute: i32,
  second: i32,
  millisecond: i32,
  microsecond: i32,
  nanosecond: i32,
  hours: i32,
  minutes: i32,
  seconds: i32,
  milliseconds: i64,
  microseconds: i64,
  nanoseconds: i64
): BalancedTime {

  hours += hour;
  minutes += minute;
  seconds += second;
  milliseconds += millisecond;
  microseconds += microsecond;
  nanoseconds += nanosecond;

  return PlainTime.balanced(hours, minutes, seconds, milliseconds,
    microseconds, nanoseconds);
}

// https://github.com/tc39/proposal-temporal/blob/515ee6e339bb4a1d3d6b5a42158f4de49f9ed953/polyfill/lib/ecmascript.mjs#L2676-L2684
function constrainTime(
  hour: i32,
  minute: i32,
  second: i32,
  millisecond: i32,
  microsecond: i32,
  nanosecond: i32,
): PlainTime {
  hour = clamp(hour, 0, 23);
  minute = clamp(minute, 0, 59);
  second = clamp(second, 0, 59);
  millisecond = clamp(millisecond, 0, 999);
  microsecond = clamp(microsecond, 0, 999);
  nanosecond = clamp(nanosecond, 0, 999);
  return new PlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
}

// https://github.com/tc39/proposal-temporal/blob/515ee6e339bb4a1d3d6b5a42158f4de49f9ed953/polyfill/lib/ecmascript.mjs#L407-L422
function regulateTime(
  hour: i32,
  minute: i32,
  second: i32,
  millisecond: i32,
  microsecond: i32,
  nanosecond: i32,
  overflow: Overflow
): PlainTime {
  switch (overflow) {
    case Overflow.Reject:
      rejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
      break;

    case Overflow.Constrain:
      const time = constrainTime(
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond
      );
      hour = time.hour;
      minute = time.minute;
      second = time.second;
      millisecond = time.millisecond;
      microsecond = time.microsecond;
      nanosecond = time.nanosecond;
      break;
  }

  return new PlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
}

function rejectTime(
  hour: i32,
  minute: i32,
  second: i32,
  millisecond: i32,
  microsecond: i32,
  nanosecond: i32
): void {
  if (!(
    checkRange(hour, 0, 23) &&
    checkRange(minute, 0, 59) &&
    checkRange(second, 0, 59) &&
    checkRange(millisecond, 0, 999) &&
    checkRange(microsecond, 0, 999) &&
    checkRange(nanosecond, 0, 999)
  )) throw new RangeError("time out of range");
}