// for the proposal-temporal implementation, most of the business logic
// sits within the ecmascript.mjs file:
//
// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs
//
// here we use the same structure to make it easier to audit this implementation
// to ensure correctess

import { RegExp } from "assemblyscript-regex";

import { Duration } from "./duration";
import { Overflow, TimeComponent } from "./enums";
import { MICROS_PER_SECOND, MILLIS_PER_SECOND, NANOS_PER_SECOND } from "./constants";
import { PlainDateTime } from "./plaindatetime";
import { PlainYearMonth } from "./plainyearmonth";
import { PlainDate } from "./plaindate";

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
export class YMD {
  year: i32;
  month: i32;
  day: i32;
}

export class YM {
  year: i32;
  month: i32;
}

export class PT {
  hour: i32;
  minute: i32;
  second: i32;
  millisecond: i32;
  microsecond: i32;
  nanosecond: i32;
}

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

export class BalancedTime {
  deltaDays: i32;
  hour: i32;
  minute: i32;
  second: i32;
  millisecond: i32;
  microsecond: i32;
  nanosecond: i32;
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

export function balanceDateTime(year: i32, month: i32, day: i32, hour: i32,
  minute: i32,
  second: i32,
  millisecond: i32,
  microsecond: i32,
  nanosecond: i64): DT {

  const balancedTime = balanceTime(hour, minute, second, millisecond, microsecond, nanosecond);
  const balancedDate = PlainDate.balanced(year, month, day + balancedTime.deltaDays);

  return {
    year: balancedDate.year,
    month: balancedDate.month,
    day: balancedDate.day,
    hour: balancedTime.hour,
    minute: balancedTime.minute,
    second: balancedTime.second,
    millisecond: balancedTime.millisecond,
    microsecond: balancedTime.microsecond,
    nanosecond: balancedTime.nanosecond
  };
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

export function rejectTime(
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

export function differenceDateTime (y1: i32, mon1: i32, d1: i32, h1: i32, min1: i32, s1: i32, ms1: i32, µs1: i32, ns1: i32,
  y2: i32, mon2: i32, d2: i32, h2: i32, min2: i32, s2: i32, ms2: i32, µs2: i32, ns2: i32, largestUnit: TimeComponent = TimeComponent.Days): Duration  {
  
  const diffTime = differenceTime(
    h1,
    min1,
    s1,
    ms1,
    µs1,
    ns1,
    h2,
    min2,
    s2,
    ms2,
    µs2,
    ns2
  );
  const balancedDate = PlainDate.balanced(y1, mon1, d1 + diffTime.days);
  const diffDate = balancedDate.until(new PlainDate(y2, mon2, d2),
    largerTimeComponent(largestUnit, TimeComponent.Days));

  // Signs of date part and time part may not agree; balance them together
  const balancedBoth = Duration.balanced(
    diffDate.days,
    diffTime.hours,
    diffTime.minutes,
    diffTime.seconds,
    diffTime.milliseconds,
    diffTime.microseconds,
    diffTime.nanoseconds,
    largestUnit
  );
  return new Duration(
    diffDate.years,
    diffDate.months,
    diffDate.weeks,
    balancedBoth.days,
    balancedBoth.hours,
    balancedBoth.minutes,
    balancedBoth.seconds,
    balancedBoth.milliseconds,
    balancedBoth.microseconds,
    balancedBoth.nanoseconds
  );
}

export function arraySign(values: Array<i32>): i32 {
  for (let i = 0; i < values.length; i++) {
    if (values[i]) return sign(values[i]);
  }
  return 0;
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

  const balancedTime = balanceTime(
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

export function addDateTime(
  year: i32,
  month: i32,
  day: i32,
  hour: i32,
  minute: i32,
  second: i32,
  millisecond: i32,
  microsecond: i32,
  nanosecond: i32,
  years: i32,
  months: i32,
  weeks: i32,
  days: i32,
  hours: i32,
  minutes: i32,
  seconds: i32,
  milliseconds: i64,
  microseconds: i64,
  nanoseconds: i64,
  overflow: Overflow
): DT {
  const addedTime = addTime(
    hour, minute, second, millisecond, microsecond, nanosecond,
    hours, minutes, seconds, milliseconds, microseconds, nanoseconds
  );

  hour = addedTime.hour;
  minute = addedTime.minute;
  second = addedTime.second;
  millisecond = addedTime.millisecond;
  microsecond = addedTime.microsecond;
  nanosecond = addedTime.nanosecond;
  days += addedTime.deltaDays; // Delegate the date part addition to the calendar

  const addedDate = new PlainDate(year, month, day)
    .add(new Duration(years, months, weeks, days), overflow);

  return {
    year: addedDate.year,
    month: addedDate.month,
    day: addedDate.day,
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond
  };
}

// https://github.com/tc39/proposal-temporal/blob/515ee6e339bb4a1d3d6b5a42158f4de49f9ed953/polyfill/lib/ecmascript.mjs#L2676-L2684
export function constrainTime(
  hour: i32,
  minute: i32,
  second: i32,
  millisecond: i32,
  microsecond: i32,
  nanosecond: i32,
): PT {
  hour = clamp(hour, 0, 23);
  minute = clamp(minute, 0, 59);
  second = clamp(second, 0, 59);
  millisecond = clamp(millisecond, 0, 999);
  microsecond = clamp(microsecond, 0, 999);
  nanosecond = clamp(nanosecond, 0, 999);
  return { hour, minute, second, millisecond, microsecond, nanosecond };
}

// https://github.com/tc39/proposal-temporal/blob/515ee6e339bb4a1d3d6b5a42158f4de49f9ed953/polyfill/lib/ecmascript.mjs#L407-L422
export function regulateTime(
  hour: i32,
  minute: i32,
  second: i32,
  millisecond: i32,
  microsecond: i32,
  nanosecond: i32,
  overflow: Overflow
): PT {
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

  return { hour, minute, second, millisecond, microsecond, nanosecond };
}

export function addTime(
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

  return balanceTime(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
}

function balanceTime(
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
  const balanced = balanceTime(0, 0, 0, 0, 0, abs(offsetNanoseconds));
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
