// for the proposal-temporal implementation, most of the business logic
// sits within the ecmascript.mjs file:
//
// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs
//
// here we use the same structure to make it easier to audit this implementation
// to ensure correctess

import { Duration } from "./duration";
import { log } from "./env";

// value objects - used in place of object literals
export class YMD {
  constructor(public year: i32, public month: i32, public day: i32) {}
}

export class YM {
  constructor(public year: i32, public month: i32) {}
}

export class NanoDays {
  constructor(
    public days: i32,
    public nanoseconds: i32,
    public dayLengthNs: i64
  ) {}
}

export const enum Overflow {
  Reject,
  Constrain,
}

export const enum TimeComponent {
  years,
  months,
  weeks,
  days,
  hours,
  minutes,
  seconds,
  milliseconds,
  microseconds,
  nanoseconds,
}

// modified of
// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2157
export function leapYear(year: i32): bool {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2188
export function dayOfYear(year: i32, month: i32, day: i32): i32 {
  let days = day;
  for (let m = month - 1; m > 0; m--) {
    days += daysInMonth(year, m);
  }
  return days;
}

// modified of
// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2164
export function daysInMonth(year: i32, month: i32): i32 {
  return month == 2
    ? 28 + i32(leapYear(year))
    : 30 + ((month + i32(month >= 6)) & 1);
}

// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2171
export function dayOfWeek(year: i32, month: i32, day: i32): i32 {
  const m = month + (month < 3 ? 10 : -2);
  const Y = year - i32(month < 3);
  const c = Y / 100;
  const y = Y - c * 100;
  const d = day;
  const pD = d;
  const pM = i32(2.6 * f32(m) - 0.2);
  const pY = y + y / 4;
  const pC = c / 4 - 2 * c;
  const dow = (pD + pM + pY + pC) % 7;
  return dow + (dow <= 0 ? 7 : 0);
}

// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2164
function balanceYearMonth(year: i32, month: i32): YM {
  month -= 1;
  year  += month / 12;
  month %= 12;
  month += month < 0 ? 13 : 1;
  return new YM(year, month);
}

// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2173
function balanceDate(year: i32, month: i32, day: i32): YMD {
  const _ES$BalanceYearMonth = balanceYearMonth(year, month);

  year  = _ES$BalanceYearMonth.year;
  month = _ES$BalanceYearMonth.month;

  let daysInYear = 0;
  let testYear = month > 2 ? year : year - 1;

  while (((daysInYear = 365 + i32(leapYear(testYear))), day < -daysInYear)) {
    year -= 1;
    testYear -= 1;
    day += daysInYear;
  }

  testYear += 1;

  while (((daysInYear = 365 + i32(leapYear(testYear))), day > daysInYear)) {
    year += 1;
    testYear += 1;
    day -= daysInYear;
  }

  while (day < 1) {
    const _ES$BalanceYearMonth2 = balanceYearMonth(year, month - 1);

    year  = _ES$BalanceYearMonth2.year;
    month = _ES$BalanceYearMonth2.month;
    day   += daysInMonth(year, month);
  }

  let monthDays = 0;
  while (monthDays = daysInMonth(year, month), day > monthDays) {
    const _ES$BalanceYearMonth3 = balanceYearMonth(year, month + 1);

    year  = _ES$BalanceYearMonth3.year;
    month = _ES$BalanceYearMonth3.month;
    day   -= monthDays;
  }

  return new YMD(year, month, day);
}

export function sign<T extends number>(x: T): T {
  // x < 0 ? -1 : 1   ->   x >> 31 | 1
  // @ts-ignore
  return (x >> (sizeof<T>() * 4 - 1)) | 1;
}

// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2616
export function clamp(value: i32, lo: i32, hi: i32): i32 {
  return min(max(value, lo), hi);
}

// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2617
export function constrainDate(year: i32, month: i32, day: i32): YMD {
  month = clamp(month, 1, 12);
  day   = clamp(day, 1, daysInMonth(year, month));
  return new YMD(year, month, day);
}

// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2617
export function regulateDate(
  year: i32,
  month: i32,
  day: i32,
  overflow: Overflow
): YMD {
  switch (overflow) {
    case Overflow.Reject:
      // rejectDate(year, month, day);
      break;

    case Overflow.Constrain:
      const _ES$ConstrainDate = constrainDate(year, month, day);

      year  = _ES$ConstrainDate.year;
      month = _ES$ConstrainDate.month;
      day   = _ES$ConstrainDate.day;
      break;
  }

  return new YMD(year, month, day);
}

// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2984
export function addDate(
  year: i32,
  month: i32,
  day: i32,
  years: i32,
  months: i32,
  weeks: i32,
  days: i32,
  overflow: Overflow
): YMD {
  year  += years;
  month += months;

  const _ES$BalanceYearMonth4 = balanceYearMonth(year, month);

  year  = _ES$BalanceYearMonth4.year;
  month = _ES$BalanceYearMonth4.month;

  const _ES$RegulateDate = regulateDate(year, month, day, overflow);

  year  = _ES$RegulateDate.year;
  month = _ES$RegulateDate.month;
  day   = _ES$RegulateDate.day;
  days += 7 * weeks;
  day  += days;

  const _ES$BalanceDate3 = balanceDate(year, month, day);

  year  = _ES$BalanceDate3.year;
  month = _ES$BalanceDate3.month;
  day   = _ES$BalanceDate3.day;

  return new YMD(year, month, day);
}

// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2135
export function weekOfYear(year: i32, month: i32, day: i32): i32 {
  let doy = dayOfYear(year, month, day);
  let dow = dayOfWeek(year, month, day) || 7;
  let doj = dayOfWeek(year, 1, 1);

  const week = (doy - dow + 10) / 7;

  if (week < 1) {
    return doj === 5 || (doj === 6 && leapYear(year - 1)) ? 53 : 52;
  }

  if (week === 53) {
    if (365 + i32(leapYear(year)) - doy < 4 - dow) {
      return 1;
    }
  }

  return week;
}

// https://github.com/tc39/proposal-temporal/blob/main/polyfill/lib/ecmascript.mjs#L2217
export function durationSign(
  years: i32,
  months: i32,
  weeks: i32,
  days: i32,
  hours: i32,
  minutes: i32,
  seconds: i32,
  milliseconds: i32,
  microseconds: i32,
  nanoseconds: i32
): i32 {
  if (years) return sign(years);
  if (months) return sign(months);
  if (weeks) return sign(weeks);
  if (days) return sign(days);
  if (hours) return sign(hours);
  if (minutes) return sign(minutes);
  if (seconds) return sign(seconds);
  if (milliseconds) return sign(milliseconds);
  if (microseconds) return sign(microseconds);
  if (nanoseconds) return sign(nanoseconds);
  return 0;
}

function totalDurationNanoseconds(
  days: i64,
  hours: i64,
  minutes: i64,
  seconds: i64,
  milliseconds: i64,
  microseconds: i64,
  nanoseconds: i64
): i64 {
  hours += days * 24;
  minutes += hours * 60;
  seconds += minutes * 60;
  milliseconds += seconds * 1000;
  microseconds += milliseconds * 1000;
  return nanoseconds + microseconds * 1000;
}

function nanosecondsToDays(ns: i64): NanoDays {
  const oneDayNs: i64 = 24 * 60 * 60 * 1_000_000_000;
  return ns == 0
    ? new NanoDays(0, 0, oneDayNs)
    : new NanoDays(i32(ns / oneDayNs), i32(ns % oneDayNs), oneDayNs * sign(ns));
}

export function balanceDuration(
  days: i32,
  hours: i32,
  minutes: i32,
  seconds: i32,
  milliseconds: i32,
  microseconds: i32,
  nanoseconds: i32,
  largestUnit: TimeComponent
): Duration {
  const durationNs = totalDurationNanoseconds(
    days as i64,
    hours as i64,
    minutes as i64,
    seconds as i64,
    milliseconds as i64,
    microseconds as i64,
    nanoseconds as i64
  );

  log(durationNs.toString());

  if (
    largestUnit >= TimeComponent.years &&
    largestUnit <= TimeComponent.days
  ) {
    const _ES$NanosecondsToDays = nanosecondsToDays(durationNs);
    days        = _ES$NanosecondsToDays.days;
    nanoseconds = _ES$NanosecondsToDays.nanoseconds;
    log(days.toString());
  } else {
    days = 0;
  }

  const sig = sign(nanoseconds);
  nanoseconds = abs(nanoseconds);
  microseconds = milliseconds = seconds = minutes = hours = 0;

  switch (largestUnit) {
    case TimeComponent.years:
    case TimeComponent.months:
    case TimeComponent.weeks:
    case TimeComponent.days:
    case TimeComponent.hours:
      microseconds = nanoseconds / 1000;
      nanoseconds  = nanoseconds % 1000;

      milliseconds = microseconds / 1000;
      microseconds = microseconds % 1000;

      seconds      = milliseconds / 1000;
      milliseconds = milliseconds % 1000;

      minutes = seconds / 60;
      seconds = seconds % 60;

      hours   = minutes / 60;
      minutes = minutes % 60;
      break;

    case TimeComponent.minutes:
      microseconds = nanoseconds / 1000;
      nanoseconds  = nanoseconds % 1000;

      milliseconds = microseconds / 1000;
      microseconds = microseconds % 1000;

      seconds      = milliseconds / 1000;
      milliseconds = milliseconds % 1000;

      minutes = seconds / 60;
      seconds = seconds % 60;
      break;

    case TimeComponent.seconds:
      microseconds = nanoseconds / 1000;
      nanoseconds  = nanoseconds % 1000;

      milliseconds = microseconds / 1000;
      microseconds = microseconds % 1000;

      seconds      = milliseconds / 1000;
      milliseconds = milliseconds % 1000;
      break;

    case TimeComponent.milliseconds:
      microseconds = nanoseconds / 1000;
      nanoseconds  = nanoseconds % 1000;

      milliseconds = microseconds / 1000;
      microseconds = microseconds % 1000;
      break;

    case TimeComponent.microseconds:
      microseconds = nanoseconds / 1000;
      nanoseconds  = nanoseconds % 1000;
      break;

    case TimeComponent.nanoseconds:
      break;
  }

  return new Duration(
    0,
    0,
    0,
    days,
    hours * sig,
    minutes * sig,
    seconds * sig,
    milliseconds * sig,
    microseconds * sig,
    nanoseconds * sig
  );
}
