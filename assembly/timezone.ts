import { Instant } from "./instant";
import { PlainDateTime } from "./plaindatetime";
import { getPartsFromEpoch } from "./utils";

export class TimeZone {
  constructor(public timezone: string) {}

  getPlainDateTimeFor(instant: Instant): PlainDateTime {
    const ns = instant.epochNanoseconds;
    // const offsetNs = ES.GetOffsetNanosecondsFor(this, instant);
    let parts = getPartsFromEpoch(ns);

    // ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceDateTime(
    //   year,
    //   month,
    //   day,
    //   hour,
    //   minute,
    //   second,
    //   millisecond,
    //   microsecond,
    //   nanosecond + offsetNs
    // ));

    return new PlainDateTime(
      parts.year,
      parts.month,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
      parts.millisecond,
      parts.microsecond,
      parts.nanosecond
    );
  }
}
