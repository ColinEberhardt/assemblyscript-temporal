import { Instant } from "./instant";
import { TimeZone } from "./timezone";

export class ZonedDateTime {
  constructor(public epochNanos: i64, public tz: TimeZone) {}

  toInstant(): Instant {
    return new Instant(this.epochNanos);
  }

  get year(): i32 {
    return this.tz.getPlainDateTimeFor(this.toInstant()).year;
  }

  get month(): i32 {
    return this.tz.getPlainDateTimeFor(this.toInstant()).month;
  }

  get day(): i32 {
    return this.tz.getPlainDateTimeFor(this.toInstant()).day;
  }
}
