import { checkRange } from "./utils";

export class PlainTime {
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

    if (a.hour < b.hour) return -1;
    if (a.hour > b.hour) return  1;

    if (a.minute < b.minute) return -1;
    if (a.minute > b.minute) return  1;

    if (a.second < b.second) return -1;
    if (a.second > b.second) return  1;

    if (a.millisecond < b.millisecond) return -1;
    if (a.millisecond > b.millisecond) return  1;

    if (a.microsecond < b.microsecond) return -1;
    if (a.microsecond > b.microsecond) return  1;

    if (a.nanosecond < b.nanosecond) return -1;
    if (a.nanosecond > b.nanosecond) return  1;

    return 0;
  }
}
