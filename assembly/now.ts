import { PlainDateTime } from "./plaindatetime";
import { PlainDate } from "./plaindate";
import { PlainTime } from "./plaintime";
import { Instant } from "./instant";

export class now {
  static plainDateTimeISO(): PlainDateTime {
    const epochMillis = Date.now();
    const date = new Date(epochMillis);
    return new PlainDateTime(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    );
  }

  static plainDateISO(): PlainDate {
    const epochMillis = Date.now();
    const date = new Date(epochMillis);
    return new PlainDate(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate()
    );
  }

  static plainTimeISO(): PlainTime {
    const epochMillis = Date.now();
    const date = new Date(epochMillis);
    return new PlainTime(
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    );
  }

  static instant(): Instant {
    const epochMillis = Date.now();
    return Instant.fromEpochMilliseconds(epochMillis);
  }
}
