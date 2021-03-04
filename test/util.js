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
const WasmPlainDate = wasmModule.exports.PlainDate;
const WasmDuration = wasmModule.exports.Duration;

const Temporal = {
  Calendar: {
    from: () => {},
  },

  PlainTime: {
    from: () => {},
  },
};

const orZero = (val) => (val ? val : 0);

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
    return new PlainDate(WasmPlainDate.wrap(this.wasmPlainDate.add(duration)));
  }

  static from(date) {
    if (typeof date === "string") {
      try {
        const datePtr = __pin(__newString(date));
        const wasmDate = WasmPlainDate.wrap(WasmPlainDate.fromString(datePtr));
        __unpin(datePtr);
        return new PlainDate(wasmDate);
      } catch (e) {
        throw new RangeError(e.message);
      }
    }
    if (date instanceof PlainDate) {
      return WasmPlainDate.wrap(
        WasmPlainDate.fromPlainDate(this.wasmPlainDate)
      );
    }
  }
}

// https://github.com/facebook/jest/issues/7280
if (global.test) {
  test.skip("skip", () => {});
}

module.exports = { Temporal, PlainDate };
