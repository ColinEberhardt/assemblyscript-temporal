// for the proposal-temporal implementation, most of the business logic
// sits within the ecmascript.mjs file:
//
// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs
//
// here we use the same structure to make it easier to audit this implementation
// to ensure correctess

import { RegExp } from "assemblyscript-regex";

import { TimeComponent } from "./enums";
import { MICROS_PER_SECOND, MILLIS_PER_SECOND, NANOS_PER_SECOND } from "./constants";
import { PlainTime } from "./plaintime";

// @ts-ignore
@lazy
const YEAR_MIN = -271821;

// @ts-ignore
@lazy
const YEAR_MAX =  275760;

// @ts-ignore
@lazy
let __null = false;

// value objects - used in place of object literals

export class DT {
  year: i32;
  month: i32;
  day: i32;
  hour: i32;
  minute: i32;
  second: i32;
  millisecond: i32;
  microsecond: i32;
  nanosecond: i32;
}

export class DTZ extends DT {
  timezone: string;
}

export class NanoDays {
  days: i32;
  nanoseconds: i64;
  dayLengthNs: i64;
}

// @ts-ignore: decorator
@inline
export function sign<T extends number>(x: T): i32 {
  // optimized variant of x < 0 ? -1 : 1
  // i32: x >> 31 | 1
  // i64: x >> 63 | 1
  // @ts-ignore
  return ((x >> (sizeof<T>() * 8 - 1)) | 1) as i32;
}

// @ts-ignore: decorator
@inline
export function ord<T extends number>(x: T, y: T): i32 {
  return i32(x > y) - i32(x < y);
}

// @ts-ignore: decorator
@inline
export function floorDiv<T extends number>(a: T, b: T): T {
  return (a >= 0 ? a : a - b + 1) / b as T;
}

// @ts-ignore: decorator
@inline
export function nonNegativeModulo<T extends number>(x: T, y: T): T {
  x = x % y as T;
  return (x < 0 ? x + y : x) as T;
}

// modified of
// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2157
// @ts-ignore: decorator
@inline
export function leapYear(year: i32): bool {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

// modified of
// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2188
export function dayOfYear(year: i32, month: i32, day: i32): i32 {
  const cumsumMonthDays = memory.data<u16>([
    0,
    31, // Jan
    31 + 28, // Feb
    31 + 28 + 31, // Mar
    31 + 28 + 31 + 30, // Apr
    31 + 28 + 31 + 30 + 31, // May
    31 + 28 + 31 + 30 + 31 + 30, // Jun
    31 + 28 + 31 + 30 + 31 + 30 + 31, // Jul
    31 + 28 + 31 + 30 + 31 + 30 + 31 + 31, // Aug
    31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30, // Sep
    31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31, // Oct
    31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30, // Nov
  ]);
  return (
    day +
    i32(load<u16>(cumsumMonthDays + ((month - 1) << 1))) +
    i32(month >= 3 && leapYear(year))
  );
}

// modified of
// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2164
export function daysInMonth(year: i32, month: i32): i32 {
  return month == 2
    ? 28 + i32(leapYear(year))
    : 30 + ((month + i32(month >= 8)) & 1);
}

// @ts-ignore: decorator
@inline
export function daysInYear(year: i32): i32 {
  return 365 + i32(leapYear(year));
}

// Original: Disparate variation
// Modified: TomohikoSakamoto algorithm from https://en.wikipedia.org/wiki/Determination_of_the_day_of_the_week
// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2171
// returns day of week in range [1,7], where 7 = Sunday
export function dayOfWeek(year: i32, month: i32, day: i32): i32 {
  const tab = memory.data<u8>([0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4]);

  year -= i32(month < 3);
  year += year / 4 - year / 100 + year / 400;
  month = <i32>load<u8>(tab + month - 1);
  const w = (year + month + day) % 7;
  // Use ISO 8601 which has [1, 7] range to represent Monday-Sunday
  return w + (w <= 0 ? 7 : 0);
}

// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2616
// @ts-ignore: decorator
@inline
export function clamp(value: i32, lo: i32, hi: i32): i32 {
  return min(max(value, lo), hi);
}

// https://github.com/tc39/proposal-temporal/blob/51c6c5138b5b73817f5e0ff2694fe0134f09b0a7/polyfill/lib/ecmascript.mjs#L2704
// @ts-ignore: decorator
@inline
export function checkRange(value: i32, lo: i32, hi: i32): bool {
  return u32(value - lo) <= u32(hi - lo);
}

// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2667
export function checkDateTimeRange(
  year: i32,
  month: i32,
  day: i32,
  hour: i32 = 0,
  minute: i32 = 0,
  second: i32 = 0,
  millisecond: i32 = 0,
  microsecond: i32 = 0,
  nanosecond: i32 = 0
): bool {
  if (!checkRange(year, YEAR_MIN, YEAR_MAX)) {
    return false;
  }
  // reject any DateTime 24 hours or more outside the Instant range
  if ((year == YEAR_MIN && (epochFromParts(
    year, month, day + 1, hour, minute, second,
    millisecond, microsecond, nanosecond - 1
  ), __null))) return false;

  if ((year == YEAR_MAX && (epochFromParts(
    year, month, day - 1, hour, minute, second,
    millisecond, microsecond, nanosecond + 1
  ), __null))) return false;

  return true;
}

// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2135
export function weekOfYear(year: i32, month: i32, day: i32): i32 {
  let doy = dayOfYear(year, month, day);
  let dow = dayOfWeek(year, month, day) || 7;
  let doj = dayOfWeek(year, 1, 1);

  const week = floorDiv(doy - dow + 10, 7);

  if (week < 1) {
    return doj === 5 || (doj === 6 && leapYear(year - 1)) ? 53 : 52;
  }

  if (week === 53) {
    if (daysInYear(year) - doy < 4 - dow) {
      return 1;
    }
  }

  return week;
}

export function compare<T extends number>(a: Array<T>, b: Array<T>): i32 {
  for (let i = 0; i < a.length; i++) {
    let res = a[i] - b[i];
    if (res) return sign(res);
  }
  return 0;
}

export function arraySign(values: Array<i32>): i32 {
  for (let i = 0; i < values.length; i++) {
    if (values[i]) return sign(values[i]);
  }
  return 0;
}

export function epochFromParts(
  year: i32,
  month: i32,
  day: i32,
  hour: i32,
  minute: i32,
  second: i32,
  millisecond: i32,
  microsecond: i32,
  nanosecond: i32
): i64 {
  const millis = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
  return millis * 1_000_000 + microsecond * 1_000 + nanosecond;
}

// @ts-ignore: decorator
@inline
export function toPaddedString(number: i32, length: i32 = 2): string {
  return number.toString().padStart(length, "0");
}

// @ts-ignore: decorator
@inline
// @ts-ignore: default value
export function coalesce<T extends number>(a: T, b: T, nill: T = -1):T {
  return a == nill ? b : a;
}

export function isoYearString(year: i32): string {
  if (year < 1000 || year > 9999) {
    let sign = year < 0 ? '-' : '+';
    return sign + `000000${abs(year)}`.slice(-6);
  } else {
    return year.toString();
  }
}

export function formatTimeZoneOffsetString(offsetNanoseconds: i64): string {
  const sign = offsetNanoseconds < 0 ? '-' : '+';
  const balanced = PlainTime.balanced(0, 0, 0, 0, 0, abs(offsetNanoseconds));
  return sign + toPaddedString(balanced.hour) + ":" + toPaddedString(balanced.minute);
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

export function largerTimeComponent(t1: TimeComponent, t2: TimeComponent): TimeComponent {
  return min(t1, t2) as TimeComponent
}
