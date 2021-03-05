import { checkRange } from "./es";

export class PlainTime {
  constructor(
    readonly hour: i32   = 0,
    readonly minute: i32 = 0,
    readonly second: i32 = 0,
    readonly millisecond: i32 = 0,
    readonly microsecond: i32 = 0,
    readonly nanosecond: i32  = 0
  ) {
    this.validate(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond
    );
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

  @inline
  private validate(
    hour: i32,
    minute: i32,
    second: i32,
    millisecond: i32,
    microsecond: i32,
    nanosecond: i32
  ): void {
    checkRange(hour,   0, 23);
    checkRange(minute, 0, 59);
    checkRange(second, 0, 59);

    checkRange(millisecond, 0, 999);
    checkRange(microsecond, 0, 999);
    checkRange(nanosecond,  0, 999);
  }
}
