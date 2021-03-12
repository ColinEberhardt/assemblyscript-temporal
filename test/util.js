global.TextDecoder = require("text-encoding").TextDecoder;
const fs = require("fs");
const loader = require("@assemblyscript/loader/umd/index");

const wasmModule = loader.instantiateSync(
  fs.readFileSync("./build/untouched.wasm"),
  {
    env: {
      log: (strPtr) => {
        const { __getString } = wasmModule.exports;
        console.log(__getString(strPtr));
      },
    },
  }
);

const { __getString, __newString, __pin, __unpin } = wasmModule.exports;

const WasmPlainTime = wasmModule.exports.WasmPlainTime;
const WasmPlainDate = wasmModule.exports.PlainDate;
const WasmDuration = wasmModule.exports.Duration;
const WasmDateLike = wasmModule.exports.DateLike;

const orZero = (val) => (val ? val : 0);

// takes an AS plain date, first wraps it using the AS loader, than wraps it in the
// PlainDate adapter
const wrap = (Ctr, value) => new PlainDate(Ctr.wrap(value));

const toWasmDateLike = (date) => {
  const datelike = new WasmDateLike();
  datelike.year = date.year || -1;
  datelike.month = date.month || -1;
  datelike.day = date.day || -1;
  return datelike;
};

const toWasmTimeComponents = (options) =>
  options && options.largestUnit
    ? [
        "years",
        "months",
        "weeks",
        "days",
        "hours",
        "minutes",
        "seconds",
        "milliseconds",
        "microseconds",
        "nanoseconds",
      ].indexOf(options.largestUnit)
    : 3;

// adapts an AS PlainDate to more closely  match the JS API for the purposes of testing
class PlainDate {
  constructor(...args) {
    this.wasmPlainDate =
      args.length == 1 ? args[0] : new WasmPlainDate(...args);
    __pin(this.wasmPlainDate);
  }

  get year() {
    return this.wasmPlainDate.year;
  }
  get month() {
    return this.wasmPlainDate.month;
  }
  get day() {
    return this.wasmPlainDate.day;
  }
  get monthCode() {
    return __getString(this.wasmPlainDate.monthCode);
  }
  get dayOfYear() {
    return this.wasmPlainDate.dayOfYear;
  }
  get dayOfWeek() {
    return this.wasmPlainDate.dayOfWeek;
  }
  get weekOfYear() {
    return this.wasmPlainDate.weekOfYear;
  }
  get monthsInYear() {
    return this.wasmPlainDate.monthsInYear;
  }
  get daysInWeek() {
    return this.wasmPlainDate.daysInWeek;
  }
  get daysInMonth() {
    return this.wasmPlainDate.daysInMonth;
  }
  get daysInYear() {
    return this.wasmPlainDate.daysInYear;
  }
  get isLeapYear() {
    return this.wasmPlainDate.isLeapYear;
  }

  equals(date) {
    return this.wasmPlainDate.equals(date.wasmPlainDate);
  }
  toString() {
    return __getString(this.wasmPlainDate.toString());
  }
  add(addValue) {
    const duration = new WasmDuration(
      orZero(addValue.years),
      orZero(addValue.months),
      orZero(addValue.weeks),
      orZero(addValue.days),
      orZero(addValue.hours),
      orZero(addValue.minutes),
      orZero(addValue.seconds),
      orZero(addValue.milliseconds),
      orZero(addValue.microseconds)
      // orZero(addValue.nanoseconds)
    );
    return wrap(WasmPlainDate, this.wasmPlainDate.add(duration));
  }
  subtract(addValue) {
    const duration = new WasmDuration(
      orZero(addValue.years),
      orZero(addValue.months),
      orZero(addValue.weeks),
      orZero(addValue.days),
      orZero(addValue.hours),
      orZero(addValue.minutes),
      orZero(addValue.seconds),
      orZero(addValue.milliseconds),
      orZero(addValue.microseconds)
      // orZero(addValue.nanoseconds)
    );
    return wrap(WasmPlainDate, this.wasmPlainDate.subtract(duration));
  }
  with(date) {
    const datelike = toWasmDateLike(date);
    return wrap(WasmPlainDate, this.wasmPlainDate.with(datelike));
  }
  until(date, options) {
    const datelike = toWasmDateLike(date);
    const largestUnitId = toWasmTimeComponents(options);
    return WasmDuration.wrap(this.wasmPlainDate.until(datelike, largestUnitId));
  }
  since(date, options) {
    const datelike = toWasmDateLike(date);
    const largestUnitId = toWasmTimeComponents(options);
    return WasmDuration.wrap(this.wasmPlainDate.since(datelike, largestUnitId));
  }

  static compare(a, b) {
    return WasmPlainDate.compare(a.wasmPlainDate, b.wasmPlainDate);
  }

  static from(date) {
    if (typeof date === "string") {
      try {
        const datePtr = __pin(__newString(date));
        const wasmDate = wrap(WasmPlainDate, WasmPlainDate.fromString(datePtr));
        __unpin(datePtr);
        return new PlainDate(wasmDate);
      } catch (e) {
        throw new RangeError(e.message);
      }
    } else if (date instanceof PlainDate) {
      return wrap(
        WasmPlainDate,
        WasmPlainDate.fromPlainDate(date.wasmPlainDate)
      );
    } else {
      try {
        const datelike = new WasmDateLike();
        datelike.year = date.year || -1;
        datelike.month = date.month || -1;
        datelike.day = date.day || -1;
        return wrap(WasmPlainDate, WasmPlainDate.fromDateLike(datelike));
      } catch (e) {
        throw new TypeError(e.message);
      }
    }
  }
}

class PlainTime {
  static from(time) {
    return wrap(WasmPlainDate, WasmPlainTime.fromPlainTime(time.wasmPlainTime));
  }

  constructor(...args) {
    this.wasmPlainTime =
      args.length == 1 ? args[0] : new WasmPlainTime(...args);
    __pin(this.wasmPlainTime);
  }

  get hour() {
    return this.wasmPlainTime.hour;
  }
  get minute() {
    return this.wasmPlainTime.minute;
  }
  get second() {
    return this.wasmPlainTime.second;
  }
  get millisecond() {
    return this.wasmPlainTime.millisecond;
  }
  get microsecond() {
    return this.wasmPlainTime.microsecond;
  }
  get nanosecond() {
    return this.wasmPlainTime.nanosecond;
  }

  equals(time) {
    return this.wasmPlainTime.equals(time.wasmPlainTime);
  }

  static compare(a, b) {
    return WasmPlainTime.compare(a.wasmPlainTime, b.wasmPlainTime);
  }
}

const Temporal = {
  PlainTime,
  PlainDate,

  Calendar: {
    from: () => {},
  },
};

// https://github.com/facebook/jest/issues/7280
if (global.test) {
  test.skip("skip", () => {});
}

module.exports = { Temporal, PlainDate, PlainTime };
