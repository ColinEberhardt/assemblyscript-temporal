import { RegExp } from "assemblyscript-regex";

import { MICROS_PER_SECOND, MILLIS_PER_SECOND, NANOS_PER_SECOND } from "./constants";
import { toPaddedString } from ".";

export class DTZ {
  year: i32;
  month: i32;
  day: i32;
  hour: i32;
  minute: i32;
  second: i32;
  millisecond: i32;
  microsecond: i32;
  nanosecond: i32;
  timezone: string;
}

export function isoYearString(year: i32): string {
  if (year < 1000 || year > 9999) {
    let sign = year < 0 ? '-' : '+';
    return sign + `000000${abs(year)}`.slice(-6);
  } else {
    return year.toString();
  }
}

export function parseISOString(date: string): DTZ {
  const dateRegex = new RegExp(
    "^((?:[+\u2212-]\\d{6}|\\d{4}))(?:-(\\d{2})-(\\d{2})|(\\d{2})(\\d{2}))(?:(?:T|\\s+)(\\d{2})(?::(\\d{2})(?::(\\d{2})(?:[.,](\\d{1,9}))?)?|(\\d{2})(?:(\\d{2})(?:[.,](\\d{1,9}))?)?)?)?(?:(?:([zZ])|(?:([+\u2212-])([01][0-9]|2[0-3])(?::?([0-5][0-9])(?::?([0-5][0-9])(?:[.,](\\d{1,9}))?)?)?)?)(?:\\[((?:(?:\\.[-A-Za-z_]|\\.\\.[-A-Za-z._]{1,12}|\\.[-A-Za-z_][-A-Za-z._]{0,12}|[A-Za-z_][-A-Za-z._]{0,13})(?:\\/(?:\\.[-A-Za-z_]|\\.\\.[-A-Za-z._]{1,12}|\\.[-A-Za-z_][-A-Za-z._]{0,12}|[A-Za-z_][-A-Za-z._]{0,13}))*|Etc\\/GMT[-+]\\d{1,2}|(?:[+\u2212-][0-2][0-9](?::?[0-5][0-9](?::?[0-5][0-9](?:[.,]\\d{1,9})?)?)?)))\\])?)?(?:\\[u-ca=((?:[A-Za-z0-9]{3,8}(?:-[A-Za-z0-9]{3,8})*))\\])?$",
    "i"
  );
  const match = dateRegex.exec(date);
  if (match == null) {
    throw new RangeError("invalid ISO 8601 string: " + date);
  }
  // see https://github.com/ColinEberhardt/assemblyscript-regex/issues/38
  const fraction = (
    match.matches[7] != "" ? match.matches[7] : match.matches[18]
  ) + "000000000";

  return {
    year: I32.parseInt(match.matches[1]),
    month: I32.parseInt(
      match.matches[2] != "" ? match.matches[2] : match.matches[19]
    ),
    day: I32.parseInt(
      match.matches[3] != "" ? match.matches[3] : match.matches[20]
    ),
    hour: I32.parseInt(match.matches[4]),
    minute: I32.parseInt(match.matches[5] != "" ? match.matches[5] : match.matches[16]),
    second: I32.parseInt(match.matches[6] != "" ? match.matches[6] : match.matches[17]),
    millisecond: I32.parseInt(fraction.substring(0, 3)),
    microsecond: I32.parseInt(fraction.substring(3, 6)),
    nanosecond: I32.parseInt(fraction.substring(6, 9)),
    timezone: match.matches[9]
  }
}

export function formatISOString(year: i32, month: i32, day: i32, hour: i32, minute: i32,
   second: i32, millisecond: i32, microsecond: i32, nanosecond: i32): string {
  return (
    year.toString() +
    "-" +
    toPaddedString(month) +
    "-" +
    toPaddedString(day) +
    "T" +
    toPaddedString(hour) +
    ":" +
    toPaddedString(minute) +
    ":" +
    toPaddedString(second) +
    (nanosecond != 0 || microsecond != 0 || millisecond != 0
      ? (
          f64(nanosecond) / NANOS_PER_SECOND +
          f64(microsecond) / MICROS_PER_SECOND +
          f64(millisecond) / MILLIS_PER_SECOND
        )
          .toString()
          .substring(1)
      : "")
  );
}