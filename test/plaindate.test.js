#! /usr/bin/env -S node --experimental-modules

/*
 ** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
 ** This code is governed by the license found in the LICENSE file.
 */

// import { strict as assert } from 'assert';
const assert = require('assert').strict;
const { equal, notEqual, throws } = assert;

const { Temporal, PlainDate } = require("./util");


describe('Date', () => {
  describe('Structure', () => {
    it('Date is a Function', () => {
      equal(typeof PlainDate, 'function');
    });
    it('Date has a prototype', () => {
      assert(PlainDate.prototype);
      equal(typeof PlainDate.prototype, 'object');
    });
    describe('Date.prototype', () => {
      it('Date.prototype has year', () => {
        assert('year' in PlainDate.prototype);
      });
      it('Date.prototype has month', () => {
        assert('month' in PlainDate.prototype);
      });
      it('Date.prototype has monthCode', () => {
        assert('monthCode' in PlainDate.prototype);
      });
      it('Date.prototype has day', () => {
        assert('day' in PlainDate.prototype);
      });
      it('Date.prototype has dayOfWeek', () => {
        assert('dayOfWeek' in PlainDate.prototype);
      });
      it('Date.prototype has dayOfYear', () => {
        assert('dayOfYear' in PlainDate.prototype);
      });
      it('Date.prototype has weekOfYear', () => {
        assert('weekOfYear' in PlainDate.prototype);
      });
      it('Date.prototype has daysInWeek', () => {
        assert('daysInWeek' in PlainDate.prototype);
      });
      it('Date.prototype has monthsInYear', () => {
        assert('monthsInYear' in PlainDate.prototype);
      });
      it('Date.prototype.with is a Function', () => {
        equal(typeof PlainDate.prototype.with, 'function');
      });
      it('Date.prototype.add is a Function', () => {
        equal(typeof PlainDate.prototype.add, 'function');
      });
      it('Date.prototype.subtract is a Function', () => {
        equal(typeof PlainDate.prototype.subtract, 'function');
      });
      it('Date.prototype.until is a Function', () => {
        equal(typeof PlainDate.prototype.until, 'function');
      });
      it('Date.prototype.since is a Function', () => {
        equal(typeof PlainDate.prototype.since, 'function');
      });
      it('Date.prototype.equals is a Function', () => {
        equal(typeof PlainDate.prototype.equals, 'function');
      });
      it('Date.prototype.toPlainDateTime is a Function', () => {
        equal(typeof PlainDate.prototype.toPlainDateTime, 'function');
      });
      it('Date.prototype.toZonedDateTime is a Function', () => {
        equal(typeof PlainDate.prototype.toZonedDateTime, 'function');
      });
      it('Date.prototype.toPlainYearMonth is a Function', () => {
        equal(typeof PlainDate.prototype.toPlainYearMonth, 'function');
      });
      it('Date.prototype.toPlainMonthDay is a Function', () => {
        equal(typeof PlainDate.prototype.toPlainMonthDay, 'function');
      });
      it('Date.prototype.getISOFields is a Function', () => {
        equal(typeof PlainDate.prototype.getISOFields, 'function');
      });
      it('Date.prototype.toString is a Function', () => {
        equal(typeof PlainDate.prototype.toString, 'function');
      });
      it('Date.prototype.toJSON is a Function', () => {
        equal(typeof PlainDate.prototype.toJSON, 'function');
      });
    });
    it('Date.from is a Function', () => {
      equal(typeof PlainDate.from, 'function');
    });
    it('Date.compare is a Function', () => {
      equal(typeof PlainDate.compare, 'function');
    });
  });
  describe('Construction', () => {
    let date;
    const calendar = Temporal.Calendar.from('iso8601');
    it('date can be constructed', () => {
      date = new PlainDate(1976, 11, 18, calendar);
      assert(date);
      equal(typeof date, 'object');
    });
    it('date.year is 1976', () => equal(date.year, 1976));
    it('date.month is 11', () => equal(date.month, 11));
    it('date.monthCode is "M11"', () => equal(date.monthCode, 'M11'));
    it('date.day is 18', () => equal(date.day, 18));
    it('date.calendar is the object', () => equal(date.calendar, calendar));
    it('date.dayOfWeek is 4', () => equal(date.dayOfWeek, 4));
    it('date.dayOfYear is 323', () => equal(date.dayOfYear, 323));
    it('date.weekOfYear is 47', () => equal(date.weekOfYear, 47));
    it('date.daysInWeek is 7', () => equal(date.daysInWeek, 7));
    it('date.monthsInYear is 12', () => equal(date.monthsInYear, 12));
    it('`${date}` is 1976-11-18', () => equal(`${date}`, '1976-11-18'));
  });
  describe('date fields', () => {
    const date = new PlainDate(2019, 10, 6);
    const datetime = { year: 2019, month: 10, monthCode: 'M10', day: 1, hour: 14, minute: 20, second: 36 };
    const fromed = new PlainDate(2019, 10, 1);
    it(`(${date}).dayOfWeek === 7`, () => equal(date.dayOfWeek, 7));
    it(`Temporal.PlainDate.from(${date}) is not the same object)`, () => notEqual(PlainDate.from(date), date));
    it(`Temporal.PlainDate.from(${JSON.stringify(datetime)}) instanceof Temporal.date`, () =>
      assert(PlainDate.from(datetime) instanceof PlainDate));
    it(`Temporal.PlainDate.from(${JSON.stringify(datetime)}) === (${fromed})`, () =>
      assert(PlainDate.from(datetime).equals(fromed)));
  });
  describe('.with manipulation', () => {
    const original = new PlainDate(1976, 11, 18);
    it('date.with({ year: 2019 } works', () => {
      const date = original.with({ year: 2019 });
      equal(`${date}`, '2019-11-18');
    });
    it('date.with({ month: 5 } works', () => {
      const date = original.with({ month: 5 });
      equal(`${date}`, '1976-05-18');
    });
    it('date.with({ monthCode: "M05" }) works', () => {
      equal(`${original.with({ monthCode: 'M05' })}`, '1976-05-18');
    });
    it('month and monthCode must agree', () => {
      throws(() => original.with({ month: 5, monthCode: 'M06' }), RangeError);
    });
    it('date.with({ day: 17 } works', () => {
      const date = original.with({ day: 17 });
      equal(`${date}`, '1976-11-17');
    });
    it('invalid overflow', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        throws(() => original.with({ day: 17 }, { overflow }), RangeError)
      );
    });
    it.skip('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => original.with({ day: 17 }, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${original.with({ day: 17 }, options)}`, '1976-11-17'));
    });
    it.skip('object must contain at least one correctly-spelled property', () => {
      throws(() => original.with({}), TypeError);
      throws(() => original.with({ months: 12 }), TypeError);
    });
    it.skip('incorrectly-spelled properties are ignored', () => {
      equal(`${original.with({ months: 12, day: 15 })}`, '1976-11-15');
    });
    it.skip('date.with(string) throws', () => {
      throws(() => original.with('2019-05-17'), TypeError);
      throws(() => original.with('2019-05-17T12:34'), TypeError);
      throws(() => original.with('2019-05-17T12:34Z'), TypeError);
      throws(() => original.with('18:05:42.577'), TypeError);
      throws(() => original.with('42'), TypeError);
    });
    it.skip('throws with calendar property', () => {
      throws(() => original.with({ year: 2021, calendar: 'iso8601' }), TypeError);
    });
    it.skip('throws with timeZone property', () => {
      throws(() => original.with({ year: 2021, timeZone: 'UTC' }), TypeError);
    });
  });
  describe('Date.toPlainDateTime() works', () => {
    const date = PlainDate.from('1976-11-18');
    const dt = date.toPlainDateTime(Temporal.PlainTime.from('11:30:23'));
    it('returns a Temporal.PlainDateTime', () => assert(dt instanceof Temporal.PlainDateTime));
    it('combines the date and time', () => equal(`${dt}`, '1976-11-18T11:30:23'));
    it('casts argument', () => {
      equal(`${date.toPlainDateTime({ hour: 11, minute: 30, second: 23 })}`, '1976-11-18T11:30:23');
      equal(`${date.toPlainDateTime('11:30:23')}`, '1976-11-18T11:30:23');
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => date.toPlainDateTime({}), TypeError);
      throws(() => date.toPlainDateTime({ minutes: 30 }), TypeError);
    });
    it('optional argument defaults to midnight', () => {
      equal(`${date.toPlainDateTime()}`, '1976-11-18T00:00:00');
    });
  });
  describe('Date.toZonedDateTime()', function () {
    it('works', () => {
      const date = PlainDate.from('2020-01-01');
      const time = Temporal.PlainTime.from('12:00');
      const tz = Temporal.TimeZone.from('America/Los_Angeles');
      const zdt = date.toZonedDateTime({ timeZone: tz, plainTime: time });
      equal(`${zdt}`, '2020-01-01T12:00:00-08:00[America/Los_Angeles]');
    });
    it('works with time omitted (timeZone argument)', () => {
      const date = PlainDate.from('2020-01-01');
      const tz = Temporal.TimeZone.from('America/Los_Angeles');
      const zdt = date.toZonedDateTime(tz);
      equal(`${zdt}`, '2020-01-01T00:00:00-08:00[America/Los_Angeles]');
    });
    it('works with time omitted (timeZone property)', () => {
      const date = PlainDate.from('2020-01-01');
      const tz = Temporal.TimeZone.from('America/Los_Angeles');
      const zdt = date.toZonedDateTime({ timeZone: tz });
      equal(`${zdt}`, '2020-01-01T00:00:00-08:00[America/Los_Angeles]');
    });
    it('casts timeZone property', () => {
      const date = PlainDate.from('2020-07-08');
      const time = Temporal.PlainTime.from('12:00');
      const zdt = date.toZonedDateTime({ timeZone: 'America/Los_Angeles', plainTime: time });
      equal(`${zdt}`, '2020-07-08T12:00:00-07:00[America/Los_Angeles]');
    });
    it('casts time property', () => {
      const date = PlainDate.from('2020-07-08');
      const tz = Temporal.TimeZone.from('America/Los_Angeles');
      const zdt = date.toZonedDateTime({ timeZone: tz, plainTime: '12:00' });
      equal(`${zdt}`, '2020-07-08T12:00:00-07:00[America/Los_Angeles]');
    });
  });
  describe('date.until() works', () => {
    const date = new PlainDate(1969, 7, 24);
    it('date.until({ year: 1969, month: 7, day: 24 })', () => {
      const duration = date.until(PlainDate.from({ year: 1969, month: 10, day: 5 }));

      equal(duration.years, 0);
      equal(duration.months, 0);
      equal(duration.weeks, 0);
      equal(duration.days, 73);
      equal(duration.hours, 0);
      equal(duration.minutes, 0);
      equal(duration.seconds, 0);
      equal(duration.milliseconds, 0);
      equal(duration.microseconds, 0);
      equal(duration.nanoseconds, 0);
    });
    it('date.until(later) === later.since(date)', () => {
      const later = PlainDate.from({ year: 1996, month: 3, day: 3 });
      equal(`${date.until(later)}`, `${later.since(date)}`);
    });
    it('date.until({ year: 2019, month: 7, day: 24 }, { largestUnit: "years" })', () => {
      const later = PlainDate.from({ year: 2019, month: 7, day: 24 });
      const duration = date.until(later, { largestUnit: 'years' });
      equal(duration.years, 50);
      equal(duration.months, 0);
      equal(duration.weeks, 0);
      equal(duration.days, 0);
      equal(duration.hours, 0);
      equal(duration.minutes, 0);
      equal(duration.seconds, 0);
      equal(duration.milliseconds, 0);
      equal(duration.microseconds, 0);
      equal(duration.nanoseconds, 0);
    });
    it('casts argument', () => {
      equal(`${date.until({ year: 2019, month: 7, day: 24 })}`, 'P18262D');
      equal(`${date.until('2019-07-24')}`, 'P18262D');
    });
    it('takes days per month into account', () => {
      const date1 = PlainDate.from('2019-01-01');
      const date2 = PlainDate.from('2019-02-01');
      const date3 = PlainDate.from('2019-03-01');
      equal(`${date1.until(date2)}`, 'P31D');
      equal(`${date2.until(date3)}`, 'P28D');

      const date4 = PlainDate.from('2020-02-01');
      const date5 = PlainDate.from('2020-03-01');
      equal(`${date4.until(date5)}`, 'P29D');
    });
    it('takes days per year into account', () => {
      const date1 = PlainDate.from('2019-01-01');
      const date2 = PlainDate.from('2019-06-01');
      const date3 = PlainDate.from('2020-01-01');
      const date4 = PlainDate.from('2020-06-01');
      const date5 = PlainDate.from('2021-01-01');
      const date6 = PlainDate.from('2021-06-01');
      equal(`${date1.until(date3)}`, 'P365D');
      equal(`${date3.until(date5)}`, 'P366D');
      equal(`${date2.until(date4)}`, 'P366D');
      equal(`${date4.until(date6)}`, 'P365D');
    });
    const feb20 = PlainDate.from('2020-02-01');
    const feb21 = PlainDate.from('2021-02-01');
    it('defaults to returning days', () => {
      equal(`${feb20.until(feb21)}`, 'P366D');
      equal(`${feb20.until(feb21, { largestUnit: 'auto' })}`, 'P366D');
      equal(`${feb20.until(feb21, { largestUnit: 'days' })}`, 'P366D');
    });
    it('can return higher units', () => {
      equal(`${feb20.until(feb21, { largestUnit: 'years' })}`, 'P1Y');
      equal(`${feb20.until(feb21, { largestUnit: 'months' })}`, 'P12M');
      equal(`${feb20.until(feb21, { largestUnit: 'weeks' })}`, 'P52W2D');
    });
    it('cannot return lower units', () => {
      ['hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'].forEach((largestUnit) =>
        throws(() => feb20.until(feb21, { largestUnit }), RangeError)
      );
    });
    it('does not include higher units than necessary', () => {
      const lastFeb20 = PlainDate.from('2020-02-29');
      const lastFeb21 = PlainDate.from('2021-02-28');
      equal(`${lastFeb20.until(lastFeb21)}`, 'P365D');
      equal(`${lastFeb20.until(lastFeb21, { largestUnit: 'months' })}`, 'P12M');
      equal(`${lastFeb20.until(lastFeb21, { largestUnit: 'years' })}`, 'P1Y');
    });
    it('weeks and months are mutually exclusive', () => {
      const laterDate = date.add({ days: 42 });
      const weeksDifference = date.until(laterDate, { largestUnit: 'weeks' });
      notEqual(weeksDifference.weeks, 0);
      equal(weeksDifference.months, 0);
      const monthsDifference = date.until(laterDate, { largestUnit: 'months' });
      equal(monthsDifference.weeks, 0);
      notEqual(monthsDifference.months, 0);
    });
    it('no two different calendars', () => {
      const date1 = new PlainDate(2000, 1, 1);
      const date2 = new PlainDate(2000, 1, 1, Temporal.Calendar.from('japanese'));
      throws(() => date1.until(date2), RangeError);
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => feb20.until(feb21, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${feb20.until(feb21, options)}`, 'P366D'));
    });
    const earlier = PlainDate.from('2019-01-08');
    const later = PlainDate.from('2021-09-07');
    it('throws on disallowed or invalid smallestUnit', () => {
      ['era', 'hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds', 'nonsense'].forEach(
        (smallestUnit) => {
          throws(() => earlier.until(later, { smallestUnit }), RangeError);
        }
      );
    });
    it('throws if smallestUnit is larger than largestUnit', () => {
      const units = ['years', 'months', 'weeks', 'days'];
      for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
        for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
          const largestUnit = units[largestIdx];
          const smallestUnit = units[smallestIdx];
          throws(() => earlier.until(later, { largestUnit, smallestUnit }), RangeError);
        }
      }
    });
    it('assumes a different default for largestUnit if smallestUnit is larger than days', () => {
      equal(`${earlier.until(later, { smallestUnit: 'years', roundingMode: 'nearest' })}`, 'P3Y');
      equal(`${earlier.until(later, { smallestUnit: 'months', roundingMode: 'nearest' })}`, 'P32M');
      equal(`${earlier.until(later, { smallestUnit: 'weeks', roundingMode: 'nearest' })}`, 'P139W');
    });
    it('throws on invalid roundingMode', () => {
      throws(() => earlier.until(later, { roundingMode: 'cile' }), RangeError);
    });
    const incrementOneNearest = [
      ['years', 'P3Y'],
      ['months', 'P32M'],
      ['weeks', 'P139W'],
      ['days', 'P973D']
    ];
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'nearest';
      it(`rounds to nearest ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expected);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    const incrementOneCeil = [
      ['years', 'P3Y', '-P2Y'],
      ['months', 'P32M', '-P31M'],
      ['weeks', 'P139W', '-P139W'],
      ['days', 'P973D', '-P973D']
    ];
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil';
      it(`rounds up to ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneFloor = [
      ['years', 'P2Y', '-P3Y'],
      ['months', 'P31M', '-P32M'],
      ['weeks', 'P139W', '-P139W'],
      ['days', 'P973D', '-P973D']
    ];
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor';
      it(`rounds down to ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneTrunc = [
      ['years', 'P2Y'],
      ['months', 'P31M'],
      ['weeks', 'P139W'],
      ['days', 'P973D']
    ];
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc';
      it(`truncates to ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expected);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    it('trunc is the default', () => {
      equal(`${earlier.until(later, { smallestUnit: 'years' })}`, 'P2Y');
      equal(`${later.until(earlier, { smallestUnit: 'years' })}`, '-P2Y');
    });
    it('rounds to an increment of years', () => {
      equal(`${earlier.until(later, { smallestUnit: 'years', roundingIncrement: 4, roundingMode: 'nearest' })}`, 'P4Y');
    });
    it('rounds to an increment of months', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'months', roundingIncrement: 10, roundingMode: 'nearest' })}`,
        'P30M'
      );
    });
    it('rounds to an increment of weeks', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'weeks', roundingIncrement: 12, roundingMode: 'nearest' })}`,
        'P144W'
      );
    });
    it('rounds to an increment of days', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'days', roundingIncrement: 100, roundingMode: 'nearest' })}`,
        'P1000D'
      );
    });
    it('accepts singular units', () => {
      equal(`${earlier.until(later, { largestUnit: 'year' })}`, `${earlier.until(later, { largestUnit: 'years' })}`);
      equal(`${earlier.until(later, { smallestUnit: 'year' })}`, `${earlier.until(later, { smallestUnit: 'years' })}`);
      equal(`${earlier.until(later, { largestUnit: 'month' })}`, `${earlier.until(later, { largestUnit: 'months' })}`);
      equal(
        `${earlier.until(later, { smallestUnit: 'month' })}`,
        `${earlier.until(later, { smallestUnit: 'months' })}`
      );
      equal(`${earlier.until(later, { largestUnit: 'day' })}`, `${earlier.until(later, { largestUnit: 'days' })}`);
      equal(`${earlier.until(later, { smallestUnit: 'day' })}`, `${earlier.until(later, { smallestUnit: 'days' })}`);
    });
    it('rounds relative to the receiver', () => {
      const date1 = Temporal.PlainDate.from('2019-01-01');
      const date2 = Temporal.PlainDate.from('2019-02-15');
      equal(`${date1.until(date2, { smallestUnit: 'months', roundingMode: 'nearest' })}`, 'P2M');
      equal(`${date2.until(date1, { smallestUnit: 'months', roundingMode: 'nearest' })}`, '-P1M');
    });
  });
  describe('order of operations in until - TODO: add since', () => {
    const cases = [
      ['2019-03-01', '2019-01-29', 'P1M1D'],
      ['2019-01-29', '2019-03-01', '-P1M3D'],
      ['2019-03-29', '2019-01-30', 'P1M29D'],
      ['2019-01-30', '2019-03-29', '-P1M29D'],
      ['2019-03-30', '2019-01-31', 'P1M30D'],
      ['2019-01-31', '2019-03-30', '-P1M28D'],
      ['2019-03-31', '2019-01-31', 'P2M'],
      ['2019-01-31', '2019-03-31', '-P2M']
    ];
    for (const [end, start, expected] of cases) {
      it(`${start} until ${end} => ${expected}`, () => {
        const result = PlainDate.from(start).until(end, { largestUnit: 'months' });
        equal(result.toString(), expected);
      });
    }
  });
  describe('date.since() works', () => {
    const date = new PlainDate(1976, 11, 18);
    it('date.since({ year: 1976, month: 10, day: 5 })', () => {
      const duration = date.since(PlainDate.from({ year: 1976, month: 10, day: 5 }));

      equal(duration.years, 0);
      equal(duration.months, 0);
      equal(duration.weeks, 0);
      equal(duration.days, 44);
      equal(duration.hours, 0);
      equal(duration.minutes, 0);
      equal(duration.seconds, 0);
      equal(duration.milliseconds, 0);
      equal(duration.microseconds, 0);
      equal(duration.nanoseconds, 0);
    });
    it('date.since(earlier) === earlier.until(date)', () => {
      const earlier = PlainDate.from({ year: 1966, month: 3, day: 3 });
      equal(`${date.since(earlier)}`, `${earlier.until(date)}`);
    });
    it('date.since({ year: 2019, month: 11, day: 18 }, { largestUnit: "years" })', () => {
      const later = PlainDate.from({ year: 2019, month: 11, day: 18 });
      const duration = later.since(date, { largestUnit: 'years' });
      equal(duration.years, 43);
      equal(duration.months, 0);
      equal(duration.weeks, 0);
      equal(duration.days, 0);
      equal(duration.hours, 0);
      equal(duration.minutes, 0);
      equal(duration.seconds, 0);
      equal(duration.milliseconds, 0);
      equal(duration.microseconds, 0);
      equal(duration.nanoseconds, 0);
    });
    it('casts argument', () => {
      equal(`${date.since({ year: 2019, month: 11, day: 5 })}`, '-P15692D');
      equal(`${date.since('2019-11-05')}`, '-P15692D');
    });
    it('takes days per month into account', () => {
      const date1 = PlainDate.from('2019-01-01');
      const date2 = PlainDate.from('2019-02-01');
      const date3 = PlainDate.from('2019-03-01');
      equal(`${date2.since(date1)}`, 'P31D');
      equal(`${date3.since(date2)}`, 'P28D');

      const date4 = PlainDate.from('2020-02-01');
      const date5 = PlainDate.from('2020-03-01');
      equal(`${date5.since(date4)}`, 'P29D');
    });
    it('takes days per year into account', () => {
      const date1 = PlainDate.from('2019-01-01');
      const date2 = PlainDate.from('2019-06-01');
      const date3 = PlainDate.from('2020-01-01');
      const date4 = PlainDate.from('2020-06-01');
      const date5 = PlainDate.from('2021-01-01');
      const date6 = PlainDate.from('2021-06-01');
      equal(`${date3.since(date1)}`, 'P365D');
      equal(`${date5.since(date3)}`, 'P366D');
      equal(`${date4.since(date2)}`, 'P366D');
      equal(`${date6.since(date4)}`, 'P365D');
    });
    const feb20 = PlainDate.from('2020-02-01');
    const feb21 = PlainDate.from('2021-02-01');
    it('defaults to returning days', () => {
      equal(`${feb21.since(feb20)}`, 'P366D');
      equal(`${feb21.since(feb20, { largestUnit: 'auto' })}`, 'P366D');
      equal(`${feb21.since(feb20, { largestUnit: 'days' })}`, 'P366D');
    });
    it('can return higher units', () => {
      equal(`${feb21.since(feb20, { largestUnit: 'years' })}`, 'P1Y');
      equal(`${feb21.since(feb20, { largestUnit: 'months' })}`, 'P12M');
      equal(`${feb21.since(feb20, { largestUnit: 'weeks' })}`, 'P52W2D');
    });
    it('cannot return lower units', () => {
      throws(() => feb21.since(feb20, { largestUnit: 'hours' }), RangeError);
      throws(() => feb21.since(feb20, { largestUnit: 'minutes' }), RangeError);
      throws(() => feb21.since(feb20, { largestUnit: 'seconds' }), RangeError);
      throws(() => feb21.since(feb20, { largestUnit: 'milliseconds' }), RangeError);
      throws(() => feb21.since(feb20, { largestUnit: 'microseconds' }), RangeError);
      throws(() => feb21.since(feb20, { largestUnit: 'nanoseconds' }), RangeError);
    });
    it('does not include higher units than necessary', () => {
      const lastFeb20 = PlainDate.from('2020-02-29');
      const lastFeb21 = PlainDate.from('2021-02-28');
      equal(`${lastFeb21.since(lastFeb20)}`, 'P365D');
      equal(`${lastFeb21.since(lastFeb20, { largestUnit: 'months' })}`, 'P11M28D');
      equal(`${lastFeb21.since(lastFeb20, { largestUnit: 'years' })}`, 'P11M28D');
    });
    it('weeks and months are mutually exclusive', () => {
      const laterDate = date.add({ days: 42 });
      const weeksDifference = laterDate.since(date, { largestUnit: 'weeks' });
      notEqual(weeksDifference.weeks, 0);
      equal(weeksDifference.months, 0);
      const monthsDifference = laterDate.since(date, { largestUnit: 'months' });
      equal(monthsDifference.weeks, 0);
      notEqual(monthsDifference.months, 0);
    });
    it('no two different calendars', () => {
      const date1 = new PlainDate(2000, 1, 1);
      const date2 = new PlainDate(2000, 1, 1, Temporal.Calendar.from('japanese'));
      throws(() => date1.since(date2), RangeError);
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => feb21.since(feb20, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${feb21.since(feb20, options)}`, 'P366D'));
    });
    const earlier = PlainDate.from('2019-01-08');
    const later = PlainDate.from('2021-09-07');
    it('throws on disallowed or invalid smallestUnit', () => {
      ['era', 'hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds', 'nonsense'].forEach(
        (smallestUnit) => {
          throws(() => later.since(earlier, { smallestUnit }), RangeError);
        }
      );
    });
    it('throws if smallestUnit is larger than largestUnit', () => {
      const units = ['years', 'months', 'weeks', 'days'];
      for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
        for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
          const largestUnit = units[largestIdx];
          const smallestUnit = units[smallestIdx];
          throws(() => later.since(earlier, { largestUnit, smallestUnit }), RangeError);
        }
      }
    });
    it('assumes a different default for largestUnit if smallestUnit is larger than days', () => {
      equal(`${later.since(earlier, { smallestUnit: 'years', roundingMode: 'nearest' })}`, 'P3Y');
      equal(`${later.since(earlier, { smallestUnit: 'months', roundingMode: 'nearest' })}`, 'P32M');
      equal(`${later.since(earlier, { smallestUnit: 'weeks', roundingMode: 'nearest' })}`, 'P139W');
    });
    it('throws on invalid roundingMode', () => {
      throws(() => later.since(earlier, { roundingMode: 'cile' }), RangeError);
    });
    const incrementOneNearest = [
      ['years', 'P3Y'],
      ['months', 'P32M'],
      ['weeks', 'P139W'],
      ['days', 'P973D']
    ];
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'nearest';
      it(`rounds to nearest ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expected);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    const incrementOneCeil = [
      ['years', 'P3Y', '-P2Y'],
      ['months', 'P32M', '-P31M'],
      ['weeks', 'P139W', '-P139W'],
      ['days', 'P973D', '-P973D']
    ];
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil';
      it(`rounds up to ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneFloor = [
      ['years', 'P2Y', '-P3Y'],
      ['months', 'P31M', '-P32M'],
      ['weeks', 'P139W', '-P139W'],
      ['days', 'P973D', '-P973D']
    ];
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor';
      it(`rounds down to ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneTrunc = [
      ['years', 'P2Y'],
      ['months', 'P31M'],
      ['weeks', 'P139W'],
      ['days', 'P973D']
    ];
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc';
      it(`truncates to ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expected);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    it('trunc is the default', () => {
      equal(`${later.since(earlier, { smallestUnit: 'years' })}`, 'P2Y');
      equal(`${earlier.since(later, { smallestUnit: 'years' })}`, '-P2Y');
    });
    it('rounds to an increment of years', () => {
      equal(`${later.since(earlier, { smallestUnit: 'years', roundingIncrement: 4, roundingMode: 'nearest' })}`, 'P4Y');
    });
    it('rounds to an increment of months', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'months', roundingIncrement: 10, roundingMode: 'nearest' })}`,
        'P30M'
      );
    });
    it('rounds to an increment of weeks', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'weeks', roundingIncrement: 12, roundingMode: 'nearest' })}`,
        'P144W'
      );
    });
    it('rounds to an increment of days', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'days', roundingIncrement: 100, roundingMode: 'nearest' })}`,
        'P1000D'
      );
    });
    it('accepts singular units', () => {
      equal(`${later.since(earlier, { largestUnit: 'year' })}`, `${later.since(earlier, { largestUnit: 'years' })}`);
      equal(`${later.since(earlier, { smallestUnit: 'year' })}`, `${later.since(earlier, { smallestUnit: 'years' })}`);
      equal(`${later.since(earlier, { largestUnit: 'month' })}`, `${later.since(earlier, { largestUnit: 'months' })}`);
      equal(
        `${later.since(earlier, { smallestUnit: 'month' })}`,
        `${later.since(earlier, { smallestUnit: 'months' })}`
      );
      equal(`${later.since(earlier, { largestUnit: 'day' })}`, `${later.since(earlier, { largestUnit: 'days' })}`);
      equal(`${later.since(earlier, { smallestUnit: 'day' })}`, `${later.since(earlier, { smallestUnit: 'days' })}`);
    });
    it('rounds relative to the receiver', () => {
      const date1 = PlainDate.from('2019-01-01');
      const date2 = PlainDate.from('2019-02-15');
      equal(`${date2.since(date1, { smallestUnit: 'months', roundingMode: 'nearest' })}`, 'P1M');
      equal(`${date1.since(date2, { smallestUnit: 'months', roundingMode: 'nearest' })}`, '-P2M');
    });
  });
  describe('date.add() works', () => {
    let date = new PlainDate(1976, 11, 18);
    it('date.add({ years: 43 })', () => {
      equal(`${date.add({ years: 43 })}`, '2019-11-18');
    });
    it('date.add({ months: 3 })', () => {
      equal(`${date.add({ months: 3 })}`, '1977-02-18');
    });
    it('date.add({ days: 20 })', () => {
      equal(`${date.add({ days: 20 })}`, '1976-12-08');
    });
    it('new Date(2019, 1, 31).add({ months: 1 })', () => {
      equal(`${new PlainDate(2019, 1, 31).add({ months: 1 })}`, '2019-02-28');
    });
    it('date.add(durationObj)', () => {
      equal(`${date.add(Temporal.Duration.from('P43Y'))}`, '2019-11-18');
    });
    it('casts argument', () => {
      equal(`${date.add('P43Y')}`, '2019-11-18');
    });
    it('constrain when overflowing result', () => {
      const jan31 = PlainDate.from('2020-01-31');
      equal(`${jan31.add({ months: 1 })}`, '2020-02-29');
      equal(`${jan31.add({ months: 1 }, { overflow: 'constrain' })}`, '2020-02-29');
    });
    it('throw when overflowing result with reject', () => {
      const jan31 = PlainDate.from('2020-01-31');
      throws(() => jan31.add({ months: 1 }, { overflow: 'reject' }), RangeError);
    });
    it('symmetrical with regard to negative durations', () => {
      equal(`${PlainDate.from('2019-11-18').add({ years: -43 })}`, '1976-11-18');
      equal(`${PlainDate.from('1977-02-18').add({ months: -3 })}`, '1976-11-18');
      equal(`${PlainDate.from('1976-12-08').add({ days: -20 })}`, '1976-11-18');
      equal(`${PlainDate.from('2019-02-28').add({ months: -1 })}`, '2019-01-28');
    });
    it("ignores lower units that don't balance up to a day", () => {
      equal(`${date.add({ hours: 1 })}`, '1976-11-18');
      equal(`${date.add({ minutes: 1 })}`, '1976-11-18');
      equal(`${date.add({ seconds: 1 })}`, '1976-11-18');
      equal(`${date.add({ milliseconds: 1 })}`, '1976-11-18');
      equal(`${date.add({ microseconds: 1 })}`, '1976-11-18');
      equal(`${date.add({ nanoseconds: 1 })}`, '1976-11-18');
    });
    it('adds lower units that balance up to a day or more', () => {
      equal(`${date.add({ hours: 24 })}`, '1976-11-19');
      equal(`${date.add({ hours: 36 })}`, '1976-11-19');
      equal(`${date.add({ hours: 48 })}`, '1976-11-20');
      equal(`${date.add({ minutes: 1440 })}`, '1976-11-19');
      equal(`${date.add({ seconds: 86400 })}`, '1976-11-19');
      equal(`${date.add({ milliseconds: 86400_000 })}`, '1976-11-19');
      equal(`${date.add({ microseconds: 86400_000_000 })}`, '1976-11-19');
      equal(`${date.add({ nanoseconds: 86400_000_000_000 })}`, '1976-11-19');
    });
    it('invalid overflow', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        throws(() => date.add({ months: 1 }, { overflow }), RangeError)
      );
    });
    it('mixed positive and negative values always throw', () => {
      ['constrain', 'reject'].forEach((overflow) =>
        throws(() => date.add({ months: 1, days: -30 }, { overflow }), RangeError)
      );
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => date.add({ months: 1 }, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${date.add({ months: 1 }, options)}`, '1976-12-18'));
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => date.add({}), TypeError);
      throws(() => date.add({ month: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${date.add({ month: 1, days: 1 })}`, '1976-11-19');
    });
  });
  describe('date.subtract() works', () => {
    const date = PlainDate.from('2019-11-18');
    it('date.subtract({ years: 43 })', () => {
      equal(`${date.subtract({ years: 43 })}`, '1976-11-18');
    });
    it('date.subtract({ months: 11 })', () => {
      equal(`${date.subtract({ months: 11 })}`, '2018-12-18');
    });
    it('date.subtract({ days: 20 })', () => {
      equal(`${date.subtract({ days: 20 })}`, '2019-10-29');
    });
    it('Date.from("2019-02-28").subtract({ months: 1 })', () => {
      equal(`${PlainDate.from('2019-02-28').subtract({ months: 1 })}`, '2019-01-28');
    });
    it('Date.subtract(durationObj)', () => {
      equal(`${date.subtract(Temporal.Duration.from('P43Y'))}`, '1976-11-18');
    });
    it('casts argument', () => {
      equal(`${date.subtract('P43Y')}`, '1976-11-18');
    });
    it('constrain when overflowing result', () => {
      const mar31 = PlainDate.from('2020-03-31');
      equal(`${mar31.subtract({ months: 1 })}`, '2020-02-29');
      equal(`${mar31.subtract({ months: 1 }, { overflow: 'constrain' })}`, '2020-02-29');
    });
    it('throw when overflowing result with reject', () => {
      const mar31 = PlainDate.from('2020-03-31');
      throws(() => mar31.subtract({ months: 1 }, { overflow: 'reject' }), RangeError);
    });
    it('symmetrical with regard to negative durations', () => {
      equal(`${PlainDate.from('1976-11-18').subtract({ years: -43 })}`, '2019-11-18');
      equal(`${PlainDate.from('2018-12-18').subtract({ months: -11 })}`, '2019-11-18');
      equal(`${PlainDate.from('2019-10-29').subtract({ days: -20 })}`, '2019-11-18');
      equal(`${PlainDate.from('2019-01-28').subtract({ months: -1 })}`, '2019-02-28');
    });
    it("ignores lower units that don't balance up to a day", () => {
      equal(`${date.subtract({ hours: 1 })}`, '2019-11-18');
      equal(`${date.subtract({ minutes: 1 })}`, '2019-11-18');
      equal(`${date.subtract({ seconds: 1 })}`, '2019-11-18');
      equal(`${date.subtract({ milliseconds: 1 })}`, '2019-11-18');
      equal(`${date.subtract({ microseconds: 1 })}`, '2019-11-18');
      equal(`${date.subtract({ nanoseconds: 1 })}`, '2019-11-18');
    });
    it('subtracts lower units that balance up to a day or more', () => {
      equal(`${date.subtract({ hours: 24 })}`, '2019-11-17');
      equal(`${date.subtract({ hours: 36 })}`, '2019-11-17');
      equal(`${date.subtract({ hours: 48 })}`, '2019-11-16');
      equal(`${date.subtract({ minutes: 1440 })}`, '2019-11-17');
      equal(`${date.subtract({ seconds: 86400 })}`, '2019-11-17');
      equal(`${date.subtract({ milliseconds: 86400_000 })}`, '2019-11-17');
      equal(`${date.subtract({ microseconds: 86400_000_000 })}`, '2019-11-17');
      equal(`${date.subtract({ nanoseconds: 86400_000_000_000 })}`, '2019-11-17');
    });
    it('invalid overflow', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        throws(() => date.subtract({ months: 1 }, { overflow }), RangeError)
      );
    });
    it('mixed positive and negative values always throw', () => {
      ['constrain', 'reject'].forEach((overflow) =>
        throws(() => date.subtract({ months: 1, days: -30 }, { overflow }), RangeError)
      );
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => date.subtract({ months: 1 }, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${date.subtract({ months: 1 }, options)}`, '2019-10-18'));
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => date.subtract({}), TypeError);
      throws(() => date.subtract({ month: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${date.subtract({ month: 1, days: 1 })}`, '2019-11-17');
    });
  });
  describe('date.toString() works', () => {
    it('new Date(1976, 11, 18).toString()', () => {
      equal(new PlainDate(1976, 11, 18).toString(), '1976-11-18');
    });
    it('new Date(1914, 2, 23).toString()', () => {
      equal(new PlainDate(1914, 2, 23).toString(), '1914-02-23');
    });
    const d = new PlainDate(1976, 11, 18);
    it.skip('shows only non-ISO calendar if calendarName = auto', () => {
      equal(d.toString({ calendarName: 'auto' }), '1976-11-18');
      equal(d.withCalendar('gregory').toString({ calendarName: 'auto' }), '1976-11-18[u-ca-gregory]');
    });
    it.skip('shows ISO calendar if calendarName = always', () => {
      equal(d.toString({ calendarName: 'always' }), '1976-11-18[u-ca-iso8601]');
    });
    it.skip('omits non-ISO calendar if calendarName = never', () => {
      equal(d.withCalendar('gregory').toString({ calendarName: 'never' }), '1976-11-18');
    });
    it.skip('default is calendar = auto', () => {
      equal(d.toString(), '1976-11-18');
      equal(d.withCalendar('gregory').toString(), '1976-11-18[u-ca-gregory]');
    });
    it.skip('throws on invalid calendar', () => {
      ['ALWAYS', 'sometimes', false, 3, null].forEach((calendarName) => {
        throws(() => d.toString({ calendarName }), RangeError);
      });
    });
  });
  describe('Date.from() works', () => {
    it('Date.from("1976-11-18")', () => {
      const date = PlainDate.from('1976-11-18');
      equal(date.year, 1976);
      equal(date.month, 11);
      equal(date.day, 18);
    });
    it('Date.from("2019-06-30")', () => {
      const date = PlainDate.from('2019-06-30');
      equal(date.year, 2019);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('Date.from("+000050-06-30")', () => {
      const date = PlainDate.from('+000050-06-30');
      equal(date.year, 50);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('Date.from("+010583-06-30")', () => {
      const date = PlainDate.from('+010583-06-30');
      equal(date.year, 10583);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('Date.from("-010583-06-30")', () => {
      const date = PlainDate.from('-010583-06-30');
      equal(date.year, -10583);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('Date.from("-000333-06-30")', () => {
      const date = PlainDate.from('-000333-06-30');
      equal(date.year, -333);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('Date.from(1976-11-18) is not the same object', () => {
      const orig = new PlainDate(1976, 11, 18);
      const actual = PlainDate.from(orig);
      notEqual(actual, orig);
    });
    it('Date.from({ year: 1976, month: 11, day: 18 }) == 1976-11-18', () =>
      equal(`${PlainDate.from({ year: 1976, month: 11, day: 18 })}`, '1976-11-18'));
    it('can be constructed with month and without monthCode', () =>
      equal(`${PlainDate.from({ year: 1976, month: 11, day: 18 })}`, '1976-11-18'));
    it.skip('can be constructed with monthCode and without month', () =>
      equal(`${PlainDate.from({ year: 1976, monthCode: 'M11', day: 18 })}`, '1976-11-18'));
    it.skip('month and monthCode must agree', () =>
      throws(() => PlainDate.from({ year: 1976, month: 11, monthCode: 'M12', day: 18 }), RangeError));
    it('Date.from({ year: 2019, day: 15 }) throws', () =>
      throws(() => PlainDate.from({ year: 2019, day: 15 }), TypeError));
    it('Date.from({ month: 12 }) throws', () => throws(() => PlainDate.from({ month: 12 }), TypeError));
    it.skip('object must contain at least the required correctly-spelled properties', () => {
      throws(() => PlainDate.from({}), TypeError);
      throws(() => PlainDate.from({ year: 1976, months: 11, day: 18 }), TypeError);
    });
    it.skip('incorrectly-spelled properties are ignored', () => {
      equal(`${PlainDate.from({ year: 1976, month: 11, day: 18, days: 15 })}`, '1976-11-18');
    });
    it.skip('Date.from(required prop undefined) throws', () =>
      throws(() => PlainDate.from({ year: undefined, month: 11, day: 18 }), TypeError));
    it.skip('Date.from(number) is converted to string', () => PlainDate.from(19761118).equals(PlainDate.from('19761118')));
    it('basic format', () => {
      equal(`${PlainDate.from('19761118')}`, '1976-11-18');
      equal(`${PlainDate.from('+0019761118')}`, '1976-11-18');
    });
    it('mixture of basic and extended format', () => {
      equal(`${PlainDate.from('1976-11-18T152330.1+00:00')}`, '1976-11-18');
      equal(`${PlainDate.from('19761118T15:23:30.1+00:00')}`, '1976-11-18');
      equal(`${PlainDate.from('1976-11-18T15:23:30.1+0000')}`, '1976-11-18');
      equal(`${PlainDate.from('1976-11-18T152330.1+0000')}`, '1976-11-18');
      equal(`${PlainDate.from('19761118T15:23:30.1+0000')}`, '1976-11-18');
      equal(`${PlainDate.from('19761118T152330.1+00:00')}`, '1976-11-18');
      equal(`${PlainDate.from('19761118T152330.1+0000')}`, '1976-11-18');
      equal(`${PlainDate.from('+001976-11-18T152330.1+00:00')}`, '1976-11-18');
      equal(`${PlainDate.from('+0019761118T15:23:30.1+00:00')}`, '1976-11-18');
      equal(`${PlainDate.from('+001976-11-18T15:23:30.1+0000')}`, '1976-11-18');
      equal(`${PlainDate.from('+001976-11-18T152330.1+0000')}`, '1976-11-18');
      equal(`${PlainDate.from('+0019761118T15:23:30.1+0000')}`, '1976-11-18');
      equal(`${PlainDate.from('+0019761118T152330.1+00:00')}`, '1976-11-18');
      equal(`${PlainDate.from('+0019761118T152330.1+0000')}`, '1976-11-18');
    });
    it('no junk at end of string', () => throws(() => PlainDate.from('1976-11-18junk'), RangeError));
    it('ignores if a timezone is specified', () =>
      equal(`${PlainDate.from('2020-01-01[Asia/Kolkata]')}`, '2020-01-01'));
    it.skip('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => PlainDate.from({ year: 1976, month: 11, day: 18 }, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) =>
        equal(`${PlainDate.from({ year: 1976, month: 11, day: 18 }, options)}`, '1976-11-18')
      );
    });
    describe('Overflow', () => {
      const bad = { year: 2019, month: 1, day: 32 };
      it('reject', () => throws(() => PlainDate.from(bad, { overflow: 'reject' }), RangeError));
      it('constrain', () => {
        equal(`${PlainDate.from(bad)}`, '2019-01-31');
        equal(`${PlainDate.from(bad, { overflow: 'constrain' })}`, '2019-01-31');
      });
      it('throw when bad overflow', () => {
        [new PlainDate(1976, 11, 18), { year: 2019, month: 1, day: 1 }, '2019-01-31'].forEach((input) => {
          ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
            throws(() => PlainDate.from(input, { overflow }), RangeError)
          );
        });
      });
      it('constrain has no effect on invalid ISO string', () => {
        throws(() => PlainDate.from('2020-13-34', { overflow: 'constrain' }), RangeError);
      });
    });
  });
  describe('Date.compare works', () => {
    const d1 = PlainDate.from('1976-11-18');
    const d2 = PlainDate.from('2019-06-30');
    it('equal', () => equal(PlainDate.compare(d1, d1), 0));
    it('smaller/larger', () => equal(PlainDate.compare(d1, d2), -1));
    it('larger/smaller', () => equal(PlainDate.compare(d2, d1), 1));
    it('casts first argument', () => {
      equal(PlainDate.compare({ year: 1976, month: 11, day: 18 }, d2), -1);
      equal(PlainDate.compare('1976-11-18', d2), -1);
    });
    it.skip('casts second argument', () => {
      equal(PlainDate.compare(d1, { year: 2019, month: 6, day: 30 }), -1);
      equal(PlainDate.compare(d1, '2019-06-30'), -1);
    });
    it.skip('object must contain at least the required properties', () => {
      throws(() => PlainDate.compare({ year: 1976 }, d2), TypeError);
      throws(() => PlainDate.compare(d1, { year: 2019 }), TypeError);
    });
  });
  describe('Date.equal works', () => {
    const d1 = PlainDate.from('1976-11-18');
    const d2 = PlainDate.from('2019-06-30');
    it('equal', () => assert(d1.equals(d1)));
    it('unequal', () => assert(!d1.equals(d2)));
    it('casts argument', () => {
      assert(!d2.equals({ year: 1976, month: 11, day: 18 }));
      assert(!d2.equals('1976-11-18'));
    });
    it.skip('object must contain at least the required properties', () => {
      throws(() => d2.equals({ year: 1976 }), TypeError);
    });
  });
  describe.skip("Comparison operators don't work", () => {
    const d1 = PlainDate.from('1963-02-13');
    const d1again = PlainDate.from('1963-02-13');
    const d2 = PlainDate.from('1976-11-18');
    it('=== is object equality', () => equal(d1, d1));
    it('!== is object equality', () => notEqual(d1, d1again));
    it('<', () => throws(() => d1 < d2));
    it('>', () => throws(() => d1 > d2));
    it('<=', () => throws(() => d1 <= d2));
    it('>=', () => throws(() => d1 >= d2));
  });
  describe('Min/max range', () => {
    it('constructing from numbers', () => {
      throws(() => new PlainDate(-271821, 4, 18), RangeError);
      throws(() => new PlainDate(275760, 9, 14), RangeError);
      equal(`${new PlainDate(-271821, 4, 19)}`, '-271821-04-19');
      equal(`${new PlainDate(275760, 9, 13)}`, '+275760-09-13');
    });
    it('constructing from property bag', () => {
      const tooEarly = { year: -271821, month: 4, day: 18 };
      const tooLate = { year: 275760, month: 9, day: 14 };
      ['reject', 'constrain'].forEach((overflow) => {
        [tooEarly, tooLate].forEach((props) => {
          throws(() => PlainDate.from(props, { overflow }), RangeError);
        });
      });
      equal(`${PlainDate.from({ year: -271821, month: 4, day: 19 })}`, '-271821-04-19');
      equal(`${PlainDate.from({ year: 275760, month: 9, day: 13 })}`, '+275760-09-13');
    });
    it('constructing from ISO string', () => {
      ['reject', 'constrain'].forEach((overflow) => {
        ['-271821-04-18', '+275760-09-14'].forEach((str) => {
          throws(() => PlainDate.from(str, { overflow }), RangeError);
        });
      });
      equal(`${PlainDate.from('-271821-04-19')}`, '-271821-04-19');
      equal(`${PlainDate.from('+275760-09-13')}`, '+275760-09-13');
    });
    it('converting from DateTime', () => {
      const min = Temporal.PlainDateTime.from('-271821-04-19T00:00:00.000000001');
      const max = Temporal.PlainDateTime.from('+275760-09-13T23:59:59.999999999');
      equal(`${min.toPlainDate()}`, '-271821-04-19');
      equal(`${max.toPlainDate()}`, '+275760-09-13');
    });
    it('converting from YearMonth', () => {
      const min = Temporal.PlainYearMonth.from('-271821-04');
      const max = Temporal.PlainYearMonth.from('+275760-09');
      throws(() => min.toPlainDate({ day: 1 }), RangeError);
      throws(() => max.toPlainDate({ day: 30 }), RangeError);
      equal(`${min.toPlainDate({ day: 19 })}`, '-271821-04-19');
      equal(`${max.toPlainDate({ day: 13 })}`, '+275760-09-13');
    });
    it('converting from MonthDay', () => {
      const jan1 = Temporal.PlainMonthDay.from('01-01');
      const dec31 = Temporal.PlainMonthDay.from('12-31');
      const minYear = -271821;
      const maxYear = 275760;
      throws(() => jan1.toPlainDate({ year: minYear }), RangeError);
      throws(() => dec31.toPlainDate({ year: maxYear }), RangeError);
      equal(`${jan1.toPlainDate({ year: minYear + 1 })}`, '-271820-01-01');
      equal(`${dec31.toPlainDate({ year: maxYear - 1 })}`, '+275759-12-31');
    });
    it('adding and subtracting beyond limit', () => {
      const min = PlainDate.from('-271821-04-19');
      const max = PlainDate.from('+275760-09-13');
      ['reject', 'constrain'].forEach((overflow) => {
        throws(() => min.subtract({ days: 1 }, { overflow }), RangeError);
        throws(() => max.add({ days: 1 }, { overflow }), RangeError);
      });
    });
  });
  describe('date.getISOFields() works', () => {
    const d1 = PlainDate.from('1976-11-18');
    const fields = d1.getISOFields();
    it('fields', () => {
      equal(fields.isoYear, 1976);
      equal(fields.isoMonth, 11);
      equal(fields.isoDay, 18);
      equal(fields.calendar.id, 'iso8601');
    });
    it('enumerable', () => {
      const fields2 = { ...fields };
      equal(fields2.isoYear, 1976);
      equal(fields2.isoMonth, 11);
      equal(fields2.isoDay, 18);
      equal(fields2.calendar, fields.calendar);
    });
    it('as input to constructor', () => {
      const d2 = new PlainDate(fields.isoYear, fields.isoMonth, fields.isoDay, fields.calendar);
      assert(d2.equals(d1));
    });
  });
  describe('date.withCalendar()', () => {
    const d1 = PlainDate.from('1976-11-18');
    it('works', () => {
      const calendar = Temporal.Calendar.from('iso8601');
      equal(`${d1.withCalendar(calendar)}`, '1976-11-18');
    });
    it('casts its argument', () => {
      equal(`${d1.withCalendar('iso8601')}`, '1976-11-18');
    });
  });
});

// import { normalize } from 'path';
// if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
//   report(reporter).then((failed) => process.exit(failed ? 1 : 0));
// }
