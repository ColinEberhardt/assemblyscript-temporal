import { Instant } from "./instant";
import { PlainDateTime } from "./plaindatetime";
import { getPartsFromEpoch, balanceDateTime, formatTimeZoneOffsetString } from "./utils";
import { offsetForTimezone } from "./tz/index";

export class TimeZone {
  constructor(public timezone: string) {}

  getPlainDateTimeFor(instant: Instant): PlainDateTime {
    const offsetNs: i64 =
      this.timezone == "UTC"
        ? 0
        : i64(offsetForTimezone(this.timezone, instant.epochMilliseconds)) * 1_000_000;
    const parts = getPartsFromEpoch(instant.epochNanoseconds);

    const balancedDateTime = balanceDateTime(
      parts.year,
      parts.month,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
      parts.millisecond,
      parts.microsecond,
      i64(parts.nanosecond) + offsetNs
    );

    return new PlainDateTime(
      balancedDateTime.year,
      balancedDateTime.month,
      balancedDateTime.day,
      balancedDateTime.hour,
      balancedDateTime.minute,
      balancedDateTime.second,
      balancedDateTime.millisecond,
      balancedDateTime.microsecond,
      balancedDateTime.nanosecond
    );
  }

  getOffsetStringFor(instant: Instant): string {
    const offsetNs: i64 = this.timezone == "UTC"
      ? 0
      : i64(offsetForTimezone(this.timezone, instant.epochMilliseconds)) * 1_000_000;
    return formatTimeZoneOffsetString(offsetNs);
  }
}
