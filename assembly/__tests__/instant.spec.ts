import { Duration, DurationLike } from "../duration";
import { TimeComponent } from "../enums";
import { Instant } from "../instant";

describe("Construction", () => {
  it("can construct", () => {
    const epochMillis = i64(Date.UTC(1976, 10, 18, 14, 23, 30, 123));
    const epochNanos = epochMillis * 1_000_000 + 456789;
    const instant = new Instant(epochNanos);

    expect(instant.epochSeconds).toBe(
      i64(Date.UTC(1976, 10, 18, 14, 23, 30, 123)) / 1_000
    );
    expect(instant.epochMilliseconds).toBe(
      Date.UTC(1976, 10, 18, 14, 23, 30, 123)
    );
  });
  //  it('constructs from string', () => expect(`${new Instant('0')}`).toBe('1970-01-01T00:00:00Z'))
});

let i1: Instant, i2: Instant, i3: Instant;
describe("instant.toString() works", () => {
  it("`1976-11-18T14:23:30.123456789Z`.toString()", () => {
    const iso = "1976-11-18T14:23:30.123456789Z";
    const instant = Instant.from(iso);
    expect(`${instant}`).toBe(iso);
  });
  xit("`1963-02-13T09:36:29.123456789Z`.toString()", () => {
    const iso = "1963-02-13T09:36:29.123456789Z";
    const instant = Instant.from(iso);
    expect(`${instant}`).toBe(iso);
  });

  i1 = Instant.from("1976-11-18T15:23Z");
  i2 = Instant.from("1976-11-18T15:23:30Z");
  i3 = Instant.from("1976-11-18T15:23:30.1234Z");
  it("default is to emit seconds and drop trailing zeros after the decimal", () => {
    expect(i1.toString()).toBe("1976-11-18T15:23:00Z");
    expect(i2.toString()).toBe("1976-11-18T15:23:30Z");
    expect(i3.toString()).toBe("1976-11-18T15:23:30.1234Z");
  });
});
//      it('optional time zone parameter UTC', () => {
//        const inst = Instant.from('1976-11-18T14:23:30.123456789Z');
//        const timeZone = Temporal.TimeZone.from('UTC');
//        expect(inst.toString({ timeZone })).toBe('1976-11-18T14:23:30.123456789+00:00')
//      });
//      it('optional time zone parameter non-UTC', () => {
//        const inst = Instant.from('1976-11-18T14:23:30.123456789Z');
//        const timeZone = Temporal.TimeZone.from('America/New_York');
//        expect(inst.toString({ timeZone })).toBe('1976-11-18T09:23:30.123456789-05:00')
//      });
//      it('sub-minute offset', () => {
//        const inst = Instant.from('1900-01-01T12:00Z');
//        const timeZone = Temporal.TimeZone.from('Europe/Amsterdam');
//        expect(inst.toString({ timeZone })).toBe('1900-01-01T12:19:32+00:19:32')
//      });
//      const i1 = Instant.from('1976-11-18T15:23Z');
//      const i2 = Instant.from('1976-11-18T15:23:30Z');
//      const i3 = Instant.from('1976-11-18T15:23:30.1234Z');
//      it('default is to emit seconds and drop trailing zeros after the decimal', () => {
//        expect(i1.toString()).toBe('1976-11-18T15:23:00Z')
//        expect(i2.toString()).toBe('1976-11-18T15:23:30Z')
//        expect(i3.toString()).toBe('1976-11-18T15:23:30.1234Z')
//      });
//      it('truncates to minute', () => {
//        [i1, i2, i3].forEach((i) => expect(i.toString({ smallestUnit: 'minute' })).toBe('1976-11-18T15:23Z'))
//      });
//      it('other smallestUnits are aliases for fractional digits', () => {
//        expect(i3.toString({ smallestUnit: 'second' })).toBe(i3.toString({ fractionalSecondDigits: 0 }))
//        expect(i3.toString({ smallestUnit: 'millisecond' })).toBe(i3.toString({ fractionalSecondDigits: 3 }))
//        expect(i3.toString({ smallestUnit: 'microsecond' })).toBe(i3.toString({ fractionalSecondDigits: 6 }))
//        expect(i3.toString({ smallestUnit: 'nanosecond' })).toBe(i3.toString({ fractionalSecondDigits: 9 }))
//      });
//      it('throws on invalid or disallowed smallestUnit', () => {
//        ['era', 'year', 'month', 'day', 'hour', 'nonsense'].forEach((smallestUnit) =>
//          throws(() => i1.toString({ smallestUnit }), RangeError)
//        );
//      });
//      it('accepts plural units', () => {
//        expect(i3.toString({ smallestUnit: 'minutes' })).toBe(i3.toString({ smallestUnit: 'minute' }))
//        expect(i3.toString({ smallestUnit: 'seconds' })).toBe(i3.toString({ smallestUnit: 'second' }))
//        expect(i3.toString({ smallestUnit: 'milliseconds' })).toBe(i3.toString({ smallestUnit: 'millisecond' }))
//        expect(i3.toString({ smallestUnit: 'microseconds' })).toBe(i3.toString({ smallestUnit: 'microsecond' }))
//        expect(i3.toString({ smallestUnit: 'nanoseconds' })).toBe(i3.toString({ smallestUnit: 'nanosecond' }))
//      });
//      it('truncates or pads to 2 places', () => {
//        const options = { fractionalSecondDigits: 2 };
//        expect(i1.toString(options)).toBe('1976-11-18T15:23:00.00Z')
//        expect(i2.toString(options)).toBe('1976-11-18T15:23:30.00Z')
//        expect(i3.toString(options)).toBe('1976-11-18T15:23:30.12Z')
//      });
//      it('pads to 7 places', () => {
//        const options = { fractionalSecondDigits: 7 };
//        expect(i1.toString(options)).toBe('1976-11-18T15:23:00.0000000Z')
//        expect(i2.toString(options)).toBe('1976-11-18T15:23:30.0000000Z')
//        expect(i3.toString(options)).toBe('1976-11-18T15:23:30.1234000Z')
//      });
//      it('auto is the default', () => {
//        [i1, i2, i3].forEach((i) => expect(i.toString({ fractionalSecondDigits: 'auto' })).toBe(i.toString()))
//      });
//      it('throws on out of range or invalid fractionalSecondDigits', () => {
//        [-1, 10, Infinity, NaN, 'not-auto'].forEach((fractionalSecondDigits) =>
//          throws(() => i1.toString({ fractionalSecondDigits }), RangeError)
//        );
//      });
//      it('accepts and truncates fractional fractionalSecondDigits', () => {
//        expect(i3.toString({ fractionalSecondDigits: 5.5 })).toBe('1976-11-18T15:23:30.12340Z')
//      });
//      it('smallestUnit overrides fractionalSecondDigits', () => {
//        expect(i3.toString({ smallestUnit: 'minute', fractionalSecondDigits: 9 })).toBe('1976-11-18T15:23Z')
//      });
//      it('throws on invalid roundingMode', () => {
//        throws(() => i1.toString({ roundingMode: 'cile' }), RangeError);
//      });
//      it('rounds to nearest', () => {
//        expect(i2.toString({ smallestUnit: 'minute', roundingMode: 'halfExpand' })).toBe('1976-11-18T15:24Z')
//        expect(i3.toString({ fractionalSecondDigits: 3, roundingMode: 'halfExpand' })).toBe('1976-11-18T15:23:30.123Z')
//      });
//      it('rounds up', () => {
//        expect(i2.toString({ smallestUnit: 'minute', roundingMode: 'ceil' })).toBe('1976-11-18T15:24Z')
//        expect(i3.toString({ fractionalSecondDigits: 3, roundingMode: 'ceil' })).toBe('1976-11-18T15:23:30.124Z')
//      });
//      it('rounds down', () => {
//        ['floor', 'trunc'].forEach((roundingMode) => {
//          expect(i2.toString({ smallestUnit: 'minute', roundingMode })).toBe('1976-11-18T15:23Z')
//          expect(i3.toString({ fractionalSecondDigits: 3, roundingMode })).toBe('1976-11-18T15:23:30.123Z')
//        });
//      });
//      it('rounding down is towards the Big Bang, not towards 1 BCE', () => {
//        const i4 = Instant.from('-000099-12-15T12:00:00.5Z');
//        expect(i4.toString({ smallestUnit: 'second', roundingMode: 'floor' })).toBe('-000099-12-15T12:00:00Z')
//      });
//      it('rounding can affect all units', () => {
//        const i5 = Instant.from('1999-12-31T23:59:59.999999999Z');
//        expect(i5.toString({ fractionalSecondDigits: 8, roundingMode: 'halfExpand' })).toBe('2000-01-01T00:00:00.00000000Z')
//      });
//      it('options may only be an object or undefined', () => {
//        [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
//          throws(() => i1.toString(badOptions), TypeError)
//        );
//        [{}, () => {}, undefined].forEach((options) => expect(i1.toString(options)).toBe('1976-11-18T15:23:00Z'))
//      });
//    });
//    describe('Instant.toJSON() works', () => {
//      it('`1976-11-18T15:23:30.123456789+01:00`.toJSON()', () => {
//        const inst = Instant.from('1976-11-18T15:23:30.123456789+01:00');
//        assert(inst);
//        expect(inst.toJSON()).toBe('1976-11-18T14:23:30.123456789Z')
//      });
//      it('`1963-02-13T10:36:29.123456789+01:00`.toJSON()', () => {
//        const inst = Instant.from('1963-02-13T10:36:29.123456789+01:00');
//        assert(inst);
//        expect(inst.toJSON()).toBe('1963-02-13T09:36:29.123456789Z')
//      });
//      it('argument is ignored', () => {
//        const inst = Instant.from('1976-11-18T15:23:30.123456789+01:00');
//        expect(inst.toJSON('+01:00')).toBe(inst.toJSON())
//      });
//    });

describe("Instant.epochSeconds works", () => {
  it("post-epoch", () => {
    const epochMs = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
    const epochNs = epochMs * 1_000_000;
    const inst = new Instant(epochNs);
    expect(inst.epochSeconds).toBe(epochMs / 1_000);
  });
  it("pre-epoch", () => {
    const epochMs = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
    const epochNs = epochMs * 1_000_000;
    const inst = new Instant(epochNs);
    expect(inst.epochSeconds).toBe(epochMs / 1_000);
  });
});
describe("Instant.fromEpochSeconds() works", () => {
  it("1976-11-18T15:23:30", () => {
    const epochSeconds = Date.UTC(1976, 10, 18, 15, 23, 30, 123) / 1_000;
    const instant = Instant.fromEpochSeconds(epochSeconds);
    expect(instant.epochSeconds).toBe(epochSeconds);
  });
  it("1963-02-13T09:36:29", () => {
    const epochSeconds = Date.UTC(1963, 1, 13, 9, 36, 29, 123) / 1_000;
    const instant = Instant.fromEpochSeconds(epochSeconds);
    expect(instant.epochSeconds).toBe(epochSeconds);
  });
});
describe("Instant.epochMilliseconds() works", () => {
  it("post-epoch", () => {
    const epochMs = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
    const epochNs = epochMs * 1_000_000;
    const inst = new Instant(epochNs);
    expect(inst.epochMilliseconds).toBe(epochMs);
  });
  it("pre-epoch", () => {
    const epochMs = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
    const epochNs = epochMs * 1_000_000;
    const inst = new Instant(epochNs);
    expect(inst.epochMilliseconds).toBe(epochMs);
  });
});
describe("Instant.fromEpochMilliseconds() works", () => {
  it("1976-11-18T15:23:30.123", () => {
    const epochMilliseconds = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
    const instant = Instant.fromEpochMilliseconds(epochMilliseconds);
    expect(instant.epochMilliseconds).toBe(epochMilliseconds);
  });
  it("1963-02-13T09:36:29.123", () => {
    const epochMilliseconds = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
    const instant = Instant.fromEpochMilliseconds(epochMilliseconds);
    expect(instant.epochMilliseconds).toBe(epochMilliseconds);
  });
});
describe("Instant.epochMicroseconds works", () => {
  it("post-epoch", () => {
    const epochMs = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
    const epochNs = epochMs * 1_000_000;
    const inst = new Instant(epochNs);
    expect(inst.epochMicroseconds).toBe(epochMs * 1_000);
  });
  it("pre-epoch", () => {
    const epochMs = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
    const epochNs = epochMs * 1_000_000;
    const inst = new Instant(epochNs);
    expect(inst.epochMicroseconds).toBe(epochMs * 1_000);
  });
});
describe("Instant.fromEpochMicroseconds() works", () => {
  it("1976-11-18T15:23:30.123456", () => {
    const epochMicroseconds =
      Date.UTC(1976, 10, 18, 15, 23, 30, 123) * 1_000 + 456;
    const instant = Instant.fromEpochMicroseconds(epochMicroseconds);
    expect(instant.epochMicroseconds).toBe(epochMicroseconds);
  });
  it("1963-02-13T09:36:29.123456", () => {
    const epochMicroseconds =
      Date.UTC(1963, 1, 13, 9, 36, 29, 123) * 1_000 + 456;
    const instant = Instant.fromEpochMicroseconds(epochMicroseconds);
    expect(instant.epochMicroseconds).toBe(epochMicroseconds);
  });
});
describe("Instant.epochNanoseconds works", () => {
  it("post-epoch", () => {
    const epochMs = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
    const epochNs = epochMs * 1_000_000;
    const inst = new Instant(epochNs);
    expect(inst.epochNanoseconds).toBe(epochNs);
  });
  it("pre-epoch", () => {
    const epochMs = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
    const epochNs = epochMs * 1_000_000;
    const inst = new Instant(epochNs);
    expect(inst.epochNanoseconds).toBe(epochNs);
  });
});
describe("Instant.fromEpochNanoseconds() works", () => {
  it("1976-11-18T15:23:30.123456789", () => {
    const epochNanoseconds =
      Date.UTC(1976, 10, 18, 15, 23, 30, 123) * 1_000_000 + 456789;
    const instant = Instant.fromEpochNanoseconds(epochNanoseconds);
    expect(instant.epochNanoseconds).toBe(epochNanoseconds);
  });
  it("1963-02-13T09:36:29.123456789", () => {
    const epochNanoseconds =
      Date.UTC(1963, 1, 13, 9, 36, 29, 123) * 1_000_000 + 456789;
    const instant = Instant.fromEpochNanoseconds(epochNanoseconds);
    expect(instant.epochNanoseconds).toBe(epochNanoseconds);
  });
  xit("-1n", () => {
    const instant = Instant.fromEpochNanoseconds(-1);
    expect(`${instant}`).toBe("1969-12-31T23:59:59.999999999Z");
  });
});
describe("Instant.from() works", () => {
  it("1976-11-18T15:23Z", () => {
    expect(Instant.from("1976-11-18T15:23Z").epochMilliseconds).toBe(
      Date.UTC(1976, 10, 18, 15, 23)
    );
  });
});
it("1976-11-18T15:23:30Z", () => {
  expect(Instant.from("1976-11-18T15:23:30Z").epochMilliseconds).toBe(
    Date.UTC(1976, 10, 18, 15, 23, 30)
  );
});
it("1976-11-18T15:23:30.123Z", () => {
  expect(Instant.from("1976-11-18T15:23:30.123Z").epochMilliseconds).toBe(
    Date.UTC(1976, 10, 18, 15, 23, 30, 123)
  );
});
it("1976-11-18T15:23:30.123456Z", () => {
  expect(Instant.from("1976-11-18T15:23:30.123456Z").epochMicroseconds).toBe(
    Date.UTC(1976, 10, 18, 15, 23, 30, 123) * 1_000 + 456
  );
});
it("1976-11-18T15:23:30.123456789Z", () => {
  expect(Instant.from("1976-11-18T15:23:30.123456789Z").epochNanoseconds).toBe(
    Date.UTC(1976, 10, 18, 15, 23, 30, 123) * 1_000_000 + 456789
  );
});

//  it('2020-02-12T11:42-08:00', () => {
//   expect(
//      Instant.from('2020-02-12T11:42-08:00').epochNanoseconds).toBe(
//      Date.UTC(2020, 1, 12, 19, 42) * 1_000_000
//    );
//  });
//  it('2020-02-12T11:42-08:00[America/Vancouver]', () => {
//   expect(
//      Instant.from('2020-02-12T11:42-08:00[America/Vancouver]').epochNanoseconds).toBe(
//      Date.UTC(2020, 1, 12, 19, 42) * 1_000_000
//    );
//  });
//  it('2020-02-12T11:42+01:00', () => {
//   expect(
//      Instant.from('2020-02-12T11:42+01:00').epochNanoseconds).toBe(
//      Date.UTC(2020, 1, 12, 10, 42) * 1_000_000
//    );
//  });
//  it('2020-02-12T11:42+01:00[Europe/Amsterdam]', () => {
//   expect(
//      Instant.from('2020-02-12T11:42+01:00[Europe/Amsterdam]').epochNanoseconds).toBe(
//      Date.UTC(2020, 1, 12, 10, 42) * 1_000_000
//    );
//  });
//  it('2019-02-16T23:45-02:00[America/Sao_Paulo]', () => {
//   expect(
//      Instant.from('2019-02-16T23:45-02:00[America/Sao_Paulo]').epochNanoseconds).toBe(
//      Date.UTC(2019, 1, 17, 1, 45) * 1_000_000
//    );
//  });
//  it('2019-02-16T23:45-03:00[America/Sao_Paulo]', () => {
//   expect(
//      Instant.from('2019-02-16T23:45-03:00[America/Sao_Paulo]').epochNanoseconds).toBe(
//      Date.UTC(2019, 1, 17, 2, 45) * 1_000_000
//    );
//  });
//      it('sub-minute offset', () => {
//        equal(
//          Instant.from('1900-01-01T12:19:32+00:19:32[Europe/Amsterdam]').epochNanoseconds,
//          Date.UTC(1900, 0, 1, 12) * 1_000_000
//        );
//      });
//      it('throws when offset not provided', () => {
//        throws(() => Instant.from('2019-02-16T23:45[America/Sao_Paulo]'), RangeError);
//      });
//      it('ignores the bracketed IANA time zone when the offset is incorrect', () => {
//        equal(
//          Instant.from('2019-02-16T23:45-04:00[America/Sao_Paulo]').epochNanoseconds,
//          Date.UTC(2019, 1, 17, 3, 45) * 1_000_000
//        );
//      });

//      it('Instant.from(1) throws', () => throws(() => Instant.from(1), RangeError));
//      it('Instant.from(-1) throws', () => throws(() => Instant.from(-1), RangeError));
//      it('Instant.from(1n) throws', () => throws(() => Instant.from(1n), RangeError));
//      it('Instant.from(-1n) throws', () => throws(() => Instant.from(-1n), RangeError));
//      it('Instant.from({}) throws', () => throws(() => Instant.from({}), RangeError));
//      it('Instant.from(instant) is not the same object', () => {
//        const inst = Instant.from('2020-02-12T11:42+01:00[Europe/Amsterdam]');
//        notexpect(Instant.from(inst)).toBe(inst)
//      });

//  it('Instant.from(ISO string leap second) is constrained', () => {
//    expect(`${Instant.from('2016-12-31T23:59:60Z')}`).toBe('2016-12-31T23:59:59Z')
//  });
it("variant time separators", () => {
  expect(`${Instant.from("1976-11-18t15:23Z")}`).toBe("1976-11-18T15:23:00Z");
  expect(`${Instant.from("1976-11-18 15:23Z")}`).toBe("1976-11-18T15:23:00Z");
});
it("variant UTC designator", () => {
  expect(`${Instant.from("1976-11-18T15:23z")}`).toBe("1976-11-18T15:23:00Z");
});
it("any number of decimal places", () => {
  expect(`${Instant.from("1976-11-18T15:23:30.1Z")}`).toBe(
    "1976-11-18T15:23:30.1Z"
  );
  expect(`${Instant.from("1976-11-18T15:23:30.12Z")}`).toBe(
    "1976-11-18T15:23:30.12Z"
  );
  expect(`${Instant.from("1976-11-18T15:23:30.123Z")}`).toBe(
    "1976-11-18T15:23:30.123Z"
  );
  expect(`${Instant.from("1976-11-18T15:23:30.1234Z")}`).toBe(
    "1976-11-18T15:23:30.1234Z"
  );
  expect(`${Instant.from("1976-11-18T15:23:30.12345Z")}`).toBe(
    "1976-11-18T15:23:30.12345Z"
  );
  expect(`${Instant.from("1976-11-18T15:23:30.123456Z")}`).toBe(
    "1976-11-18T15:23:30.123456Z"
  );
  expect(`${Instant.from("1976-11-18T15:23:30.1234567Z")}`).toBe(
    "1976-11-18T15:23:30.1234567Z"
  );
  expect(`${Instant.from("1976-11-18T15:23:30.12345678Z")}`).toBe(
    "1976-11-18T15:23:30.12345678Z"
  );
  expect(`${Instant.from("1976-11-18T15:23:30.123456789Z")}`).toBe(
    "1976-11-18T15:23:30.123456789Z"
  );
});
it("variant decimal separator", () => {
  expect(`${Instant.from("1976-11-18T15:23:30,12Z")}`).toBe(
    "1976-11-18T15:23:30.12Z"
  );
});
xit("variant minus sign", () => {
  expect(`${Instant.from("1976-11-18T15:23:30.12\u221202:00")}`).toBe(
    "1976-11-18T17:23:30.12Z"
  );
  expect(`${Instant.from("\u2212009999-11-18T15:23:30.12Z")}`).toBe(
    "-009999-11-18T15:23:30.12Z"
  );
});
it("mixture of basic and extended format", () => {
  expect(`${Instant.from("19761118T15:23:30.1+00:00")}`).toBe(
    "1976-11-18T15:23:30.1Z"
  );
  expect(`${Instant.from("1976-11-18T152330.1+00:00")}`).toBe(
    "1976-11-18T15:23:30.1Z"
  );
  expect(`${Instant.from("1976-11-18T15:23:30.1+0000")}`).toBe(
    "1976-11-18T15:23:30.1Z"
  );
  expect(`${Instant.from("1976-11-18T152330.1+0000")}`).toBe(
    "1976-11-18T15:23:30.1Z"
  );
  expect(`${Instant.from("19761118T15:23:30.1+0000")}`).toBe(
    "1976-11-18T15:23:30.1Z"
  );
  expect(`${Instant.from("19761118T152330.1+00:00")}`).toBe(
    "1976-11-18T15:23:30.1Z"
  );
  expect(`${Instant.from("+0019761118T15:23:30.1+00:00")}`).toBe(
    "1976-11-18T15:23:30.1Z"
  );
  expect(`${Instant.from("+001976-11-18T152330.1+00:00")}`).toBe(
    "1976-11-18T15:23:30.1Z"
  );
  expect(`${Instant.from("+001976-11-18T15:23:30.1+0000")}`).toBe(
    "1976-11-18T15:23:30.1Z"
  );
  expect(`${Instant.from("+001976-11-18T152330.1+0000")}`).toBe(
    "1976-11-18T15:23:30.1Z"
  );
  expect(`${Instant.from("+0019761118T15:23:30.1+0000")}`).toBe(
    "1976-11-18T15:23:30.1Z"
  );
  expect(`${Instant.from("+0019761118T152330.1+00:00")}`).toBe(
    "1976-11-18T15:23:30.1Z"
  );
  expect(`${Instant.from("+0019761118T152330.1+0000")}`).toBe(
    "1976-11-18T15:23:30.1Z"
  );
});
it("optional parts", () => {
  expect(`${Instant.from("1976-11-18T15:23:30+00")}`).toBe(
    "1976-11-18T15:23:30Z"
  );
  expect(`${Instant.from("1976-11-18T15Z")}`).toBe("1976-11-18T15:00:00Z");
});
//      it('ignores any specified calendar', () =>
//        expect(`${Instant.from('1976-11-18T15:23:30.123456789Z[u-ca=discord]')}`).toBe('1976-11-18T15:23:30.123456789Z'))
//      it('no junk at end of string', () => throws(() => Instant.from('1976-11-18T15:23:30.123456789Zjunk'), RangeError));
//    });

let inst: Instant, one: Instant, two: Instant, three: Instant, four: Instant;

describe("Instant.add works", () => {
  inst = Instant.from("1969-12-25T12:23:45.678901234Z");
  describe("cross epoch in ms", () => {
    // @ts-ignore
    one = inst.subtract<DurationLike>({ hours: 240, nanoseconds: 800 });
    // @ts-ignore
    two = inst.add<DurationLike>({ hours: 240, nanoseconds: 800 });
    // @ts-ignore
    three = two.subtract<DurationLike>({ hours: 480, nanoseconds: 1600 });
    // @ts-ignore
    four = one.add<DurationLike>({ hours: 480, nanoseconds: 1600 });
    it(`(${inst}).subtract({ hours: 240, nanoseconds: 800 }) = ${one}`, () => {
      expect(`${one}`).toBe("1969-12-15T12:23:45.678900434Z");
    });
    it(`(${inst}).add({ hours: 240, nanoseconds: 800 }) = ${two}`, () => {
      expect(`${two}`).toBe("1970-01-04T12:23:45.678902034Z");
    });
    it(`(${two}).subtract({ hours: 480, nanoseconds: 1600 }) = ${one}`, () => {
      expect(`${three}`).toBe(`${one}`);
    });
    it(`(${one}).add({ hours: 480, nanoseconds: 1600 }) = ${two}`, () => {
      expect(`${four}`).toBe(`${two}`);
    });
  });
  it("inst.add(durationObj)", () => {
    const later = inst.add(Duration.from("PT240H0.000000800S"));
    expect(`${later}`).toBe("1970-01-04T12:23:45.678902034Z");
  });
  it("casts argument", () => {
    expect(`${inst.add("PT240H0.000000800S")}`).toBe(
      "1970-01-04T12:23:45.678902034Z"
    );
  });

  it("invalid to add years, months, weeks, or days", () => {
    expect(() => {
      // @ts-ignore
      inst.add<DurationLike>({ years: 1 });
    }).toThrow();
    expect(() => {
      // @ts-ignore
      inst.add<DurationLike>({ months: 1 });
    }).toThrow();
    expect(() => {
      // @ts-ignore
      inst.add<DurationLike>({ weeks: 1 });
    }).toThrow();
    expect(() => {
      // @ts-ignore
      inst.add<DurationLike>({ days: 1 });
    }).toThrow();
  });
  it("mixed positive and negative values always throw", () => {
    expect(() => {
      inst.add({ hours: 1, minutes: -30 });
    }).toThrow();
  });
});

describe("Instant.subtract works", () => {
  const inst = Instant.from("1969-12-25T12:23:45.678901234Z");
  it("inst.subtract(durationObj)", () => {
    const earlier = inst.subtract(Duration.from("PT240H0.000000800S"));
    expect(`${earlier}`).toBe("1969-12-15T12:23:45.678900434Z");
  });
  it("casts argument", () => {
    expect(`${inst.subtract("PT240H0.000000800S")}`).toBe(
      "1969-12-15T12:23:45.678900434Z"
    );
  });
  it("invalid to subtract years, months, weeks, or days", () => {
    expect(() => {
      inst.subtract({ years: 1 });
    }).toThrow();
    expect(() => {
      inst.subtract({ months: 1 });
    }).toThrow();
    expect(() => {
      inst.subtract({ weeks: 1 });
    }).toThrow();
    expect(() => {
      inst.subtract({ days: 1 });
    }).toThrow();
  });
  it("mixed positive and negative values always throw", () => {
    expect(() => {
      inst.subtract({ hours: 1, minutes: -30 });
    }).toThrow();
  });
});

describe("Instant.compare works", () => {
  i1 = Instant.from("1963-02-13T09:36:29.123456789Z");
  i2 = Instant.from("1976-11-18T15:23:30.123456789Z");
  i3 = Instant.from("1981-12-15T14:34:31.987654321Z");
  it("pre epoch equal", () => {
    expect(Instant.compare(i1, Instant.from(i1))).toBe(0);
  });
  it("epoch equal", () => {
    expect(Instant.compare(i2, Instant.from(i2))).toBe(0);
  });
  it("cross epoch smaller/larger", () => {
    expect(Instant.compare(i1, i2)).toBe(-1);
  });
  it("cross epoch larger/smaller", () => {
    expect(Instant.compare(i2, i1)).toBe(1);
  });
  it("epoch smaller/larger", () => {
    expect(Instant.compare(i2, i3)).toBe(-1);
  });
  it("epoch larger/smaller", () => {
    expect(Instant.compare(i3, i2)).toBe(1);
  });
});

describe("Instant.equals works", () => {
  i1 = Instant.from("1963-02-13T09:36:29.123456789Z");
  i2 = Instant.from("1976-11-18T15:23:30.123456789Z");
  i3 = Instant.from("1981-12-15T14:34:31.987654321Z");
  it("pre epoch equal", () => {
    expect(i1.equals(i1)).toBeTruthy();
  });
  it("epoch equal", () => {
    expect(i2.equals(i2)).toBeTruthy();
  });
  it("cross epoch unequal", () => {
    expect(i1.equals(i2)).toBeFalsy();
  });
  it("epoch unequal", () => {
    expect(i2.equals(i3)).toBeFalsy();
  });
});

let earlier: Instant,
  later: Instant,
  diff: Duration,
  feb20: Instant,
  feb21: Instant;

describe("Instant.since() works", () => {
  earlier = Instant.from("1976-11-18T15:23:30.123456789Z");
  later = Instant.from("2019-10-29T10:46:38.271986102Z");
  diff = later.since(earlier);
  it(`(${earlier}).since(${later}) == (${later}).since(${earlier}).negated()`, () => {
    expect(`${earlier.since(later)}`).toBe(`${diff.negated()}`);
  });
  it(`(${later}).since(${earlier}) == (${earlier}).until(${later})`, () => {
    expect(`${earlier.until(later)}`).toBe(`${diff}`);
  });

  // xit(`(${earlier}).add(${diff}) == (${later})`, () => {
  //   expect(earlier.add(diff).equals(later)).toBeTruthy();
  // });
  // xit(`(${later}).subtract(${diff}) == (${earlier})`, () => {
  //   expect(later.subtract(diff).equals(earlier)).toBeTruthy();
  // });

  feb20 = Instant.from("2020-02-01T00:00Z");
  feb21 = Instant.from("2021-02-01T00:00Z");
  it("defaults to returning seconds", () => {
    expect(`${feb21.since(feb20)}`).toBe("PT31622400S");
    expect(`${feb21.since(feb20, TimeComponent.Seconds)}`).toBe("PT31622400S");
    // see: https://github.com/AssemblyScript/assemblyscript/issues/1850
    // expect(
    //   `${Instant.from("2021-02-01T00:00:00.000000001Z").since(feb20)}`
    // ).toBe("PT31622400.000000001S");
    // expect(
    //   `${feb21.since(Instant.from("2020-02-01T00:00:00.000000001Z"))}`
    // ).toBe("PT31622399.999999999S");
  });
  it("can return minutes and hours", () => {
    expect(`${feb21.since(feb20, TimeComponent.Hours)}`).toBe("PT8784H");
    expect(`${feb21.since(feb20, TimeComponent.Minutes)}`).toBe("PT527040M");
  });
  it("can return subseconds", () => {
    const later = feb20.add({
      hours: 24,
      milliseconds: 250,
      microseconds: 250,
      nanoseconds: 250,
    });

    const msDiff = later.since(feb20, TimeComponent.Milliseconds);
    expect(msDiff.seconds).toBe(0);
    expect(msDiff.milliseconds).toBe(86400250);
    expect(msDiff.microseconds).toBe(250);
    expect(msDiff.nanoseconds).toBe(250);

    // const µsDiff = later.since(feb20, TimeComponent.Microseconds);
    // expect(µsDiff.milliseconds).toBe(0);
    // expect(µsDiff.microseconds).toBe(86400250250);
    // expect(µsDiff.nanoseconds).toBe(250);

    // const nsDiff = later.since(feb20, TimeComponent.Nanoseconds);
    // expect(nsDiff.microseconds).toBe(0);
    // expect(nsDiff.nanoseconds).toBe(86400250250250);
  });

  it("cannot return days, weeks, months, and years", () => {
    expect(() => {
      feb21.since(feb20, TimeComponent.Days);
    }).toThrow();
    expect(() => {
      feb21.since(feb20, TimeComponent.Weeks);
    }).toThrow();
    expect(() => {
      feb21.since(feb20, TimeComponent.Months);
    }).toThrow();
    expect(() => {
      feb21.since(feb20, TimeComponent.Years);
    }).toThrow();
  });
});

//      it('throws on disallowed or invalid smallestUnit', () => {
//        ['era', 'year', 'month', 'week', 'day', 'years', 'months', 'weeks', 'days', 'nonsense'].forEach(
//          (smallestUnit) => {
//            throws(() => later.since(earlier, { smallestUnit }), RangeError);
//          }
//        );
//      });
//      it('throws if smallestUnit is larger than largestUnit', () => {
//        const units = ['hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];
//        for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
//          for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
//            const largestUnit = units[largestIdx];
//            const smallestUnit = units[smallestIdx];
//            throws(() => later.since(earlier, { largestUnit, smallestUnit }), RangeError);
//          }
//        }
//      });
//      it('assumes a different default for largestUnit if smallestUnit is larger than seconds', () => {
//        expect(`${later.since(earlier, { smallestUnit: 'hours', roundingMode: 'halfExpand' })}`).toBe('PT376435H')
//        expect(`${later.since(earlier, { smallestUnit: 'minutes', roundingMode: 'halfExpand' })}`).toBe('PT22586123M')
//      });
//      it('throws on invalid roundingMode', () => {
//        throws(() => later.since(earlier, { roundingMode: 'cile' }), RangeError);
//      });
//      const largestUnit = 'hours';
//      const incrementOneNearest = [
//        ['hours', 'PT376435H'],
//        ['minutes', 'PT376435H23M'],
//        ['seconds', 'PT376435H23M8S'],
//        ['milliseconds', 'PT376435H23M8.149S'],
//        ['microseconds', 'PT376435H23M8.148529S'],
//        ['nanoseconds', 'PT376435H23M8.148529313S']
//      ];
//      incrementOneNearest.forEach(([smallestUnit, expected]) => {
//        const roundingMode = 'halfExpand';
//        it(`rounds to nearest ${smallestUnit}`, () => {
//          expect(`${later.since(earlier, { largestUnit, smallestUnit, roundingMode })}`).toBe(expected)
//          expect(`${earlier.since(later, { largestUnit, smallestUnit, roundingMode })}`).toBe(`-${expected}`)
//        });
//      });
//      const incrementOneCeil = [
//        ['hours', 'PT376436H', '-PT376435H'],
//        ['minutes', 'PT376435H24M', '-PT376435H23M'],
//        ['seconds', 'PT376435H23M9S', '-PT376435H23M8S'],
//        ['milliseconds', 'PT376435H23M8.149S', '-PT376435H23M8.148S'],
//        ['microseconds', 'PT376435H23M8.14853S', '-PT376435H23M8.148529S'],
//        ['nanoseconds', 'PT376435H23M8.148529313S', '-PT376435H23M8.148529313S']
//      ];
//      incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
//        const roundingMode = 'ceil';
//        it(`rounds up to ${smallestUnit}`, () => {
//          expect(`${later.since(earlier, { largestUnit, smallestUnit, roundingMode })}`).toBe(expectedPositive)
//          expect(`${earlier.since(later, { largestUnit, smallestUnit, roundingMode })}`).toBe(expectedNegative)
//        });
//      });
//      const incrementOneFloor = [
//        ['hours', 'PT376435H', '-PT376436H'],
//        ['minutes', 'PT376435H23M', '-PT376435H24M'],
//        ['seconds', 'PT376435H23M8S', '-PT376435H23M9S'],
//        ['milliseconds', 'PT376435H23M8.148S', '-PT376435H23M8.149S'],
//        ['microseconds', 'PT376435H23M8.148529S', '-PT376435H23M8.14853S'],
//        ['nanoseconds', 'PT376435H23M8.148529313S', '-PT376435H23M8.148529313S']
//      ];
//      incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
//        const roundingMode = 'floor';
//        it(`rounds down to ${smallestUnit}`, () => {
//          expect(`${later.since(earlier, { largestUnit, smallestUnit, roundingMode })}`).toBe(expectedPositive)
//          expect(`${earlier.since(later, { largestUnit, smallestUnit, roundingMode })}`).toBe(expectedNegative)
//        });
//      });
//      const incrementOneTrunc = [
//        ['hours', 'PT376435H'],
//        ['minutes', 'PT376435H23M'],
//        ['seconds', 'PT376435H23M8S'],
//        ['milliseconds', 'PT376435H23M8.148S'],
//        ['microseconds', 'PT376435H23M8.148529S'],
//        ['nanoseconds', 'PT376435H23M8.148529313S']
//      ];
//      incrementOneTrunc.forEach(([smallestUnit, expected]) => {
//        const roundingMode = 'trunc';
//        it(`truncates to ${smallestUnit}`, () => {
//          expect(`${later.since(earlier, { largestUnit, smallestUnit, roundingMode })}`).toBe(expected)
//          expect(`${earlier.since(later, { largestUnit, smallestUnit, roundingMode })}`).toBe(`-${expected}`)
//        });
//      });
//      it('trunc is the default', () => {
//        expect(`${later.since(earlier, { largestUnit, smallestUnit: 'milliseconds' })}`).toBe('PT376435H23M8.148S')
//        expect(`${later.since(earlier, { largestUnit, smallestUnit: 'microseconds' })}`).toBe('PT376435H23M8.148529S')
//      });
//      it('rounds to an increment of hours', () => {
//        equal(
//          `${later.since(earlier, {
//            largestUnit,
//            smallestUnit: 'hours',
//            roundingIncrement: 3,
//            roundingMode: 'halfExpand'
//          })}`,
//          'PT376434H'
//        );
//      });
//      it('rounds to an increment of minutes', () => {
//        equal(
//          `${later.since(earlier, {
//            largestUnit,
//            smallestUnit: 'minutes',
//            roundingIncrement: 30,
//            roundingMode: 'halfExpand'
//          })}`,
//          'PT376435H30M'
//        );
//      });
//      it('rounds to an increment of seconds', () => {
//        equal(
//          `${later.since(earlier, {
//            largestUnit,
//            smallestUnit: 'seconds',
//            roundingIncrement: 15,
//            roundingMode: 'halfExpand'
//          })}`,
//          'PT376435H23M15S'
//        );
//      });
//      it('rounds to an increment of milliseconds', () => {
//        equal(
//          `${later.since(earlier, {
//            largestUnit,
//            smallestUnit: 'milliseconds',
//            roundingIncrement: 10,
//            roundingMode: 'halfExpand'
//          })}`,
//          'PT376435H23M8.15S'
//        );
//      });
//      it('rounds to an increment of microseconds', () => {
//        equal(
//          `${later.since(earlier, {
//            largestUnit,
//            smallestUnit: 'microseconds',
//            roundingIncrement: 10,
//            roundingMode: 'halfExpand'
//          })}`,
//          'PT376435H23M8.14853S'
//        );
//      });
//      it('rounds to an increment of nanoseconds', () => {
//        equal(
//          `${later.since(earlier, {
//            largestUnit,
//            smallestUnit: 'nanoseconds',
//            roundingIncrement: 10,
//            roundingMode: 'halfExpand'
//          })}`,
//          'PT376435H23M8.14852931S'
//        );
//      });
//      it('valid hour increments divide into 24', () => {
//        [1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
//          const options = { largestUnit, smallestUnit: 'hours', roundingIncrement };
//          assert(later.since(earlier, options) instanceof Temporal.Duration);
//        });
//      });
//      ['minutes', 'seconds'].forEach((smallestUnit) => {
//        it(`valid ${smallestUnit} increments divide into 60`, () => {
//          [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
//            const options = { largestUnit, smallestUnit, roundingIncrement };
//            assert(later.since(earlier, options) instanceof Temporal.Duration);
//          });
//        });
//      });
//      ['milliseconds', 'microseconds', 'nanoseconds'].forEach((smallestUnit) => {
//        it(`valid ${smallestUnit} increments divide into 1000`, () => {
//          [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
//            const options = { largestUnit, smallestUnit, roundingIncrement };
//            assert(later.since(earlier, options) instanceof Temporal.Duration);
//          });
//        });
//      });
//      it('throws on increments that do not divide evenly into the next highest', () => {
//        throws(() => later.since(earlier, { largestUnit, smallestUnit: 'hours', roundingIncrement: 11 }), RangeError);
//        throws(() => later.since(earlier, { largestUnit, smallestUnit: 'minutes', roundingIncrement: 29 }), RangeError);
//        throws(() => later.since(earlier, { largestUnit, smallestUnit: 'seconds', roundingIncrement: 29 }), RangeError);
//        throws(
//          () => later.since(earlier, { largestUnit, smallestUnit: 'milliseconds', roundingIncrement: 29 }),
//          RangeError
//        );
//        throws(
//          () => later.since(earlier, { largestUnit, smallestUnit: 'microseconds', roundingIncrement: 29 }),
//          RangeError
//        );
//        throws(
//          () => later.since(earlier, { largestUnit, smallestUnit: 'nanoseconds', roundingIncrement: 29 }),
//          RangeError
//        );
//      });
//      it('throws on increments that are equal to the next highest', () => {
//        throws(() => later.since(earlier, { largestUnit, smallestUnit: 'hours', roundingIncrement: 24 }), RangeError);
//        throws(() => later.since(earlier, { largestUnit, smallestUnit: 'minutes', roundingIncrement: 60 }), RangeError);
//        throws(() => later.since(earlier, { largestUnit, smallestUnit: 'seconds', roundingIncrement: 60 }), RangeError);
//        throws(
//          () => later.since(earlier, { largestUnit, smallestUnit: 'milliseconds', roundingIncrement: 1000 }),
//          RangeError
//        );
//        throws(
//          () => later.since(earlier, { largestUnit, smallestUnit: 'microseconds', roundingIncrement: 1000 }),
//          RangeError
//        );
//        throws(
//          () => later.since(earlier, { largestUnit, smallestUnit: 'nanoseconds', roundingIncrement: 1000 }),
//          RangeError
//        );
//      });
//      it('accepts singular units', () => {
//        expect(`${later.since(earlier, { largestUnit: 'hour' })}`, `${later.since(earlier).toBe({ largestUnit: 'hours' })}`)
//        equal(
//          `${later.since(earlier, { largestUnit, smallestUnit: 'hour' })}`,
//          `${later.since(earlier, { largestUnit, smallestUnit: 'hours' })}`
//        );
//        equal(
//          `${later.since(earlier, { largestUnit: 'minute' })}`,
//          `${later.since(earlier, { largestUnit: 'minutes' })}`
//        );
//        equal(
//          `${later.since(earlier, { largestUnit, smallestUnit: 'minute' })}`,
//          `${later.since(earlier, { largestUnit, smallestUnit: 'minutes' })}`
//        );
//        equal(
//          `${later.since(earlier, { largestUnit: 'second' })}`,
//          `${later.since(earlier, { largestUnit: 'seconds' })}`
//        );
//        equal(
//          `${later.since(earlier, { largestUnit, smallestUnit: 'second' })}`,
//          `${later.since(earlier, { largestUnit, smallestUnit: 'seconds' })}`
//        );
//        equal(
//          `${later.since(earlier, { largestUnit: 'millisecond' })}`,
//          `${later.since(earlier, { largestUnit: 'milliseconds' })}`
//        );
//        equal(
//          `${later.since(earlier, { largestUnit, smallestUnit: 'millisecond' })}`,
//          `${later.since(earlier, { largestUnit, smallestUnit: 'milliseconds' })}`
//        );
//        equal(
//          `${later.since(earlier, { largestUnit: 'microsecond' })}`,
//          `${later.since(earlier, { largestUnit: 'microseconds' })}`
//        );
//        equal(
//          `${later.since(earlier, { largestUnit, smallestUnit: 'microsecond' })}`,
//          `${later.since(earlier, { largestUnit, smallestUnit: 'microseconds' })}`
//        );
//        equal(
//          `${later.since(earlier, { largestUnit: 'nanosecond' })}`,
//          `${later.since(earlier, { largestUnit: 'nanoseconds' })}`
//        );
//        equal(
//          `${later.since(earlier, { largestUnit, smallestUnit: 'nanosecond' })}`,
//          `${later.since(earlier, { largestUnit, smallestUnit: 'nanoseconds' })}`
//        );
//      });
//    });


//    describe('Instant.until() works', () => {
//      const earlier = Instant.from('1969-07-24T16:50:35.123456789Z');
//      const later = Instant.from('2019-10-29T10:46:38.271986102Z');
//      const diff = earlier.until(later);
//      it(`(${later}).until(${earlier}) == (${earlier}).until(${later}).negated()`, () =>
//        expect(`${later.until(earlier)}`).toBe(`${diff.negated()}`))
//      it(`(${earlier}).until(${later}) == (${later}).since(${earlier})`, () =>
//        expect(`${later.since(earlier)}`).toBe(`${diff}`))
//      it(`(${earlier}).add(${diff}) == (${later})`, () => assert(earlier.add(diff).equals(later)));
//      it(`(${later}).subtract(${diff}) == (${earlier})`, () => assert(later.subtract(diff).equals(earlier)));
//      it('casts argument from string', () => {
//        expect(`${earlier.until(later.toString())}`).toBe(`${diff}`)
//      });
//      it('only casts from a string', () => {
//        throws(() => earlier.until(later.epochNanoseconds), RangeError);
//        throws(() => earlier.until({}), RangeError);
//      });
//      const feb20 = Instant.from('2020-02-01T00:00Z');
//      const feb21 = Instant.from('2021-02-01T00:00Z');
//      it('defaults to returning seconds', () => {
//        expect(`${feb20.until(feb21)}`).toBe('PT31622400S')
//        expect(`${feb20.until(feb21, { largestUnit: 'auto' })}`).toBe('PT31622400S')
//        expect(`${feb20.until(feb21, { largestUnit: 'seconds' })}`).toBe('PT31622400S')
//        expect(`${feb20.until(Instant.from('2021-02-01T00:00:00.000000001Z'))}`).toBe('PT31622400.000000001S')
//        expect(`${Instant.from('2020-02-01T00:00:00.000000001Z').until(feb21)}`).toBe('PT31622399.999999999S')
//      });
//      it('can return minutes and hours', () => {
//        expect(`${feb20.until(feb21, { largestUnit: 'hours' })}`).toBe('PT8784H')
//        expect(`${feb20.until(feb21, { largestUnit: 'minutes' })}`).toBe('PT527040M')
//      });
//      it('can return subseconds', () => {
//        const later = feb20.add({ hours: 24, milliseconds: 250, microseconds: 250, nanoseconds: 250 });

//        const msDiff = feb20.until(later, { largestUnit: 'milliseconds' });
//        expect(msDiff.seconds).toBe(0)
//        expect(msDiff.milliseconds).toBe(86400250)
//        expect(msDiff.microseconds).toBe(250)
//        expect(msDiff.nanoseconds).toBe(250)

//        const µsDiff = feb20.until(later, { largestUnit: 'microseconds' });
//        expect(µsDiff.milliseconds).toBe(0)
//        expect(µsDiff.microseconds).toBe(86400250250)
//        expect(µsDiff.nanoseconds).toBe(250)

//        const nsDiff = feb20.until(later, { largestUnit: 'nanoseconds' });
//        expect(nsDiff.microseconds).toBe(0)
//        expect(nsDiff.nanoseconds).toBe(86400250250250)
//      });
//      it('cannot return days, weeks, months, and years', () => {
//        throws(() => feb20.until(feb21, { largestUnit: 'days' }), RangeError);
//        throws(() => feb20.until(feb21, { largestUnit: 'weeks' }), RangeError);
//        throws(() => feb20.until(feb21, { largestUnit: 'months' }), RangeError);
//        throws(() => feb20.until(feb21, { largestUnit: 'years' }), RangeError);
//      });
//      it('options may only be an object or undefined', () => {
//        [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
//          throws(() => feb20.until(feb21, badOptions), TypeError)
//        );
//        [{}, () => {}, undefined].forEach((options) => expect(`${feb20.until(feb21, options)}`).toBe('PT31622400S'))
//      });
//      it('throws on disallowed or invalid smallestUnit', () => {
//        ['era', 'year', 'month', 'week', 'day', 'years', 'months', 'weeks', 'days', 'nonsense'].forEach(
//          (smallestUnit) => {
//            throws(() => earlier.until(later, { smallestUnit }), RangeError);
//          }
//        );
//      });
//      it('throws if smallestUnit is larger than largestUnit', () => {
//        const units = ['hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];
//        for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
//          for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
//            const largestUnit = units[largestIdx];
//            const smallestUnit = units[smallestIdx];
//            throws(() => earlier.until(later, { largestUnit, smallestUnit }), RangeError);
//          }
//        }
//      });
//      it('assumes a different default for largestUnit if smallestUnit is larger than seconds', () => {
//        expect(`${earlier.until(later, { smallestUnit: 'hours', roundingMode: 'halfExpand' })}`).toBe('PT440610H')
//        expect(`${earlier.until(later, { smallestUnit: 'minutes', roundingMode: 'halfExpand' })}`).toBe('PT26436596M')
//      });
//      it('throws on invalid roundingMode', () => {
//        throws(() => earlier.until(later, { roundingMode: 'cile' }), RangeError);
//      });
//      const largestUnit = 'hours';
//      const incrementOneNearest = [
//        ['hours', 'PT440610H'],
//        ['minutes', 'PT440609H56M'],
//        ['seconds', 'PT440609H56M3S'],
//        ['milliseconds', 'PT440609H56M3.149S'],
//        ['microseconds', 'PT440609H56M3.148529S'],
//        ['nanoseconds', 'PT440609H56M3.148529313S']
//      ];
//      incrementOneNearest.forEach(([smallestUnit, expected]) => {
//        const roundingMode = 'halfExpand';
//        it(`rounds to nearest ${smallestUnit}`, () => {
//          expect(`${earlier.until(later, { largestUnit, smallestUnit, roundingMode })}`).toBe(expected)
//          expect(`${later.until(earlier, { largestUnit, smallestUnit, roundingMode })}`).toBe(`-${expected}`)
//        });
//      });
//      const incrementOneCeil = [
//        ['hours', 'PT440610H', '-PT440609H'],
//        ['minutes', 'PT440609H57M', '-PT440609H56M'],
//        ['seconds', 'PT440609H56M4S', '-PT440609H56M3S'],
//        ['milliseconds', 'PT440609H56M3.149S', '-PT440609H56M3.148S'],
//        ['microseconds', 'PT440609H56M3.14853S', '-PT440609H56M3.148529S'],
//        ['nanoseconds', 'PT440609H56M3.148529313S', '-PT440609H56M3.148529313S']
//      ];
//      incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
//        const roundingMode = 'ceil';
//        it(`rounds up to ${smallestUnit}`, () => {
//          expect(`${earlier.until(later, { largestUnit, smallestUnit, roundingMode })}`).toBe(expectedPositive)
//          expect(`${later.until(earlier, { largestUnit, smallestUnit, roundingMode })}`).toBe(expectedNegative)
//        });
//      });
//      const incrementOneFloor = [
//        ['hours', 'PT440609H', '-PT440610H'],
//        ['minutes', 'PT440609H56M', '-PT440609H57M'],
//        ['seconds', 'PT440609H56M3S', '-PT440609H56M4S'],
//        ['milliseconds', 'PT440609H56M3.148S', '-PT440609H56M3.149S'],
//        ['microseconds', 'PT440609H56M3.148529S', '-PT440609H56M3.14853S'],
//        ['nanoseconds', 'PT440609H56M3.148529313S', '-PT440609H56M3.148529313S']
//      ];
//      incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
//        const roundingMode = 'floor';
//        it(`rounds down to ${smallestUnit}`, () => {
//          expect(`${earlier.until(later, { largestUnit, smallestUnit, roundingMode })}`).toBe(expectedPositive)
//          expect(`${later.until(earlier, { largestUnit, smallestUnit, roundingMode })}`).toBe(expectedNegative)
//        });
//      });
//      const incrementOneTrunc = [
//        ['hours', 'PT440609H'],
//        ['minutes', 'PT440609H56M'],
//        ['seconds', 'PT440609H56M3S'],
//        ['milliseconds', 'PT440609H56M3.148S'],
//        ['microseconds', 'PT440609H56M3.148529S'],
//        ['nanoseconds', 'PT440609H56M3.148529313S']
//      ];
//      incrementOneTrunc.forEach(([smallestUnit, expected]) => {
//        const roundingMode = 'trunc';
//        it(`truncates to ${smallestUnit}`, () => {
//          expect(`${earlier.until(later, { largestUnit, smallestUnit, roundingMode })}`).toBe(expected)
//          expect(`${later.until(earlier, { largestUnit, smallestUnit, roundingMode })}`).toBe(`-${expected}`)
//        });
//      });
//      it('trunc is the default', () => {
//        expect(`${earlier.until(later, { largestUnit, smallestUnit: 'milliseconds' })}`).toBe('PT440609H56M3.148S')
//        expect(`${earlier.until(later, { largestUnit, smallestUnit: 'microseconds' })}`).toBe('PT440609H56M3.148529S')
//      });
//      it('rounds to an increment of hours', () => {
//        equal(
//          `${earlier.until(later, {
//            largestUnit,
//            smallestUnit: 'hours',
//            roundingIncrement: 4,
//            roundingMode: 'halfExpand'
//          })}`,
//          'PT440608H'
//        );
//      });
//      it('rounds to an increment of minutes', () => {
//        equal(
//          `${earlier.until(later, {
//            largestUnit,
//            smallestUnit: 'minutes',
//            roundingIncrement: 30,
//            roundingMode: 'halfExpand'
//          })}`,
//          'PT440610H'
//        );
//      });
//      it('rounds to an increment of seconds', () => {
//        equal(
//          `${earlier.until(later, {
//            largestUnit,
//            smallestUnit: 'seconds',
//            roundingIncrement: 15,
//            roundingMode: 'halfExpand'
//          })}`,
//          'PT440609H56M'
//        );
//      });
//      it('rounds to an increment of milliseconds', () => {
//        equal(
//          `${earlier.until(later, {
//            largestUnit,
//            smallestUnit: 'milliseconds',
//            roundingIncrement: 10,
//            roundingMode: 'halfExpand'
//          })}`,
//          'PT440609H56M3.15S'
//        );
//      });
//      it('rounds to an increment of microseconds', () => {
//        equal(
//          `${earlier.until(later, {
//            largestUnit,
//            smallestUnit: 'microseconds',
//            roundingIncrement: 10,
//            roundingMode: 'halfExpand'
//          })}`,
//          'PT440609H56M3.14853S'
//        );
//      });
//      it('rounds to an increment of nanoseconds', () => {
//        equal(
//          `${earlier.until(later, {
//            largestUnit,
//            smallestUnit: 'nanoseconds',
//            roundingIncrement: 10,
//            roundingMode: 'halfExpand'
//          })}`,
//          'PT440609H56M3.14852931S'
//        );
//      });
//      it('valid hour increments divide into 24', () => {
//        [1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
//          const options = { largestUnit, smallestUnit: 'hours', roundingIncrement };
//          assert(earlier.until(later, options) instanceof Temporal.Duration);
//        });
//      });
//      ['minutes', 'seconds'].forEach((smallestUnit) => {
//        it(`valid ${smallestUnit} increments divide into 60`, () => {
//          [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
//            const options = { largestUnit, smallestUnit, roundingIncrement };
//            assert(earlier.until(later, options) instanceof Temporal.Duration);
//          });
//        });
//      });
//      ['milliseconds', 'microseconds', 'nanoseconds'].forEach((smallestUnit) => {
//        it(`valid ${smallestUnit} increments divide into 1000`, () => {
//          [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
//            const options = { largestUnit, smallestUnit, roundingIncrement };
//            assert(earlier.until(later, options) instanceof Temporal.Duration);
//          });
//        });
//      });
//      it('throws on increments that do not divide evenly into the next highest', () => {
//        throws(() => earlier.until(later, { largestUnit, smallestUnit: 'hours', roundingIncrement: 11 }), RangeError);
//        throws(() => earlier.until(later, { largestUnit, smallestUnit: 'minutes', roundingIncrement: 29 }), RangeError);
//        throws(() => earlier.until(later, { largestUnit, smallestUnit: 'seconds', roundingIncrement: 29 }), RangeError);
//        throws(
//          () => earlier.until(later, { largestUnit, smallestUnit: 'milliseconds', roundingIncrement: 29 }),
//          RangeError
//        );
//        throws(
//          () => earlier.until(later, { largestUnit, smallestUnit: 'microseconds', roundingIncrement: 29 }),
//          RangeError
//        );
//        throws(
//          () => earlier.until(later, { largestUnit, smallestUnit: 'nanoseconds', roundingIncrement: 29 }),
//          RangeError
//        );
//      });
//      it('throws on increments that are equal to the next highest', () => {
//        throws(() => earlier.until(later, { largestUnit, smallestUnit: 'hours', roundingIncrement: 24 }), RangeError);
//        throws(() => earlier.until(later, { largestUnit, smallestUnit: 'minutes', roundingIncrement: 60 }), RangeError);
//        throws(() => earlier.until(later, { largestUnit, smallestUnit: 'seconds', roundingIncrement: 60 }), RangeError);
//        throws(
//          () => earlier.until(later, { largestUnit, smallestUnit: 'milliseconds', roundingIncrement: 1000 }),
//          RangeError
//        );
//        throws(
//          () => earlier.until(later, { largestUnit, smallestUnit: 'microseconds', roundingIncrement: 1000 }),
//          RangeError
//        );
//        throws(
//          () => earlier.until(later, { largestUnit, smallestUnit: 'nanoseconds', roundingIncrement: 1000 }),
//          RangeError
//        );
//      });
//      it('accepts singular units', () => {
//        expect(`${earlier.until(later, { largestUnit: 'hour' })}`, `${earlier.until(later).toBe({ largestUnit: 'hours' })}`)
//        equal(
//          `${earlier.until(later, { largestUnit, smallestUnit: 'hour' })}`,
//          `${earlier.until(later, { largestUnit, smallestUnit: 'hours' })}`
//        );
//        equal(
//          `${earlier.until(later, { largestUnit: 'minute' })}`,
//          `${earlier.until(later, { largestUnit: 'minutes' })}`
//        );
//        equal(
//          `${earlier.until(later, { largestUnit, smallestUnit: 'minute' })}`,
//          `${earlier.until(later, { largestUnit, smallestUnit: 'minutes' })}`
//        );
//        equal(
//          `${earlier.until(later, { largestUnit: 'second' })}`,
//          `${earlier.until(later, { largestUnit: 'seconds' })}`
//        );
//        equal(
//          `${earlier.until(later, { largestUnit, smallestUnit: 'second' })}`,
//          `${earlier.until(later, { largestUnit, smallestUnit: 'seconds' })}`
//        );
//        equal(
//          `${earlier.until(later, { largestUnit: 'millisecond' })}`,
//          `${earlier.until(later, { largestUnit: 'milliseconds' })}`
//        );
//        equal(
//          `${earlier.until(later, { largestUnit, smallestUnit: 'millisecond' })}`,
//          `${earlier.until(later, { largestUnit, smallestUnit: 'milliseconds' })}`
//        );
//        equal(
//          `${earlier.until(later, { largestUnit: 'microsecond' })}`,
//          `${earlier.until(later, { largestUnit: 'microseconds' })}`
//        );
//        equal(
//          `${earlier.until(later, { largestUnit, smallestUnit: 'microsecond' })}`,
//          `${earlier.until(later, { largestUnit, smallestUnit: 'microseconds' })}`
//        );
//        equal(
//          `${earlier.until(later, { largestUnit: 'nanosecond' })}`,
//          `${earlier.until(later, { largestUnit: 'nanoseconds' })}`
//        );
//        equal(
//          `${earlier.until(later, { largestUnit, smallestUnit: 'nanosecond' })}`,
//          `${earlier.until(later, { largestUnit, smallestUnit: 'nanoseconds' })}`
//        );
//      });
//    });
//    describe('Instant.round works', () => {
//      const inst = Instant.from('1976-11-18T14:23:30.123456789Z');
//      it('throws without parameter', () => {
//        throws(() => inst.round(), TypeError);
//      });
//      it('throws without required smallestUnit parameter', () => {
//        throws(() => inst.round({}), RangeError);
//        throws(() => inst.round({ roundingIncrement: 1, roundingMode: 'ceil' }), RangeError);
//      });
//      it('throws on disallowed or invalid smallestUnit', () => {
//        ['era', 'year', 'month', 'week', 'day', 'years', 'months', 'weeks', 'days', 'nonsense'].forEach(
//          (smallestUnit) => {
//            throws(() => inst.round({ smallestUnit }), RangeError);
//          }
//        );
//      });
//      it('throws on invalid roundingMode', () => {
//        throws(() => inst.round({ smallestUnit: 'second', roundingMode: 'cile' }), RangeError);
//      });
//      const incrementOneNearest = [
//        ['hour', '1976-11-18T14:00:00Z'],
//        ['minute', '1976-11-18T14:24:00Z'],
//        ['second', '1976-11-18T14:23:30Z'],
//        ['millisecond', '1976-11-18T14:23:30.123Z'],
//        ['microsecond', '1976-11-18T14:23:30.123457Z'],
//        ['nanosecond', '1976-11-18T14:23:30.123456789Z']
//      ];
//      incrementOneNearest.forEach(([smallestUnit, expected]) => {
//        it(`rounds to nearest ${smallestUnit}`, () =>
//          expect(`${inst.round({ smallestUnit, roundingMode: 'halfExpand' })}`).toBe(expected))
//      });
//      const incrementOneCeil = [
//        ['hour', '1976-11-18T15:00:00Z'],
//        ['minute', '1976-11-18T14:24:00Z'],
//        ['second', '1976-11-18T14:23:31Z'],
//        ['millisecond', '1976-11-18T14:23:30.124Z'],
//        ['microsecond', '1976-11-18T14:23:30.123457Z'],
//        ['nanosecond', '1976-11-18T14:23:30.123456789Z']
//      ];
//      incrementOneCeil.forEach(([smallestUnit, expected]) => {
//        it(`rounds up to ${smallestUnit}`, () =>
//          expect(`${inst.round({ smallestUnit, roundingMode: 'ceil' })}`).toBe(expected))
//      });
//      const incrementOneFloor = [
//        ['hour', '1976-11-18T14:00:00Z'],
//        ['minute', '1976-11-18T14:23:00Z'],
//        ['second', '1976-11-18T14:23:30Z'],
//        ['millisecond', '1976-11-18T14:23:30.123Z'],
//        ['microsecond', '1976-11-18T14:23:30.123456Z'],
//        ['nanosecond', '1976-11-18T14:23:30.123456789Z']
//      ];
//      incrementOneFloor.forEach(([smallestUnit, expected]) => {
//        it(`rounds down to ${smallestUnit}`, () =>
//          expect(`${inst.round({ smallestUnit, roundingMode: 'floor' })}`).toBe(expected))
//        it(`truncates to ${smallestUnit}`, () =>
//          expect(`${inst.round({ smallestUnit, roundingMode: 'trunc' })}`).toBe(expected))
//      });
//      it('nearest is the default', () => {
//        expect(`${inst.round({ smallestUnit: 'minute' })}`).toBe('1976-11-18T14:24:00Z')
//        expect(`${inst.round({ smallestUnit: 'second' })}`).toBe('1976-11-18T14:23:30Z')
//      });
//      it('rounding down is towards the Big Bang, not towards the epoch', () => {
//        const inst2 = Instant.from('1969-12-15T12:00:00.5Z');
//        const smallestUnit = 'second';
//        expect(`${inst2.round({ smallestUnit, roundingMode: 'ceil' })}`).toBe('1969-12-15T12:00:01Z')
//        expect(`${inst2.round({ smallestUnit, roundingMode: 'floor' })}`).toBe('1969-12-15T12:00:00Z')
//        expect(`${inst2.round({ smallestUnit, roundingMode: 'trunc' })}`).toBe('1969-12-15T12:00:00Z')
//        expect(`${inst2.round({ smallestUnit, roundingMode: 'halfExpand' })}`).toBe('1969-12-15T12:00:01Z')
//      });
//      it('rounds to an increment of hours', () => {
//        expect(`${inst.round({ smallestUnit: 'hour', roundingIncrement: 4 })}`).toBe('1976-11-18T16:00:00Z')
//      });
//      it('rounds to an increment of minutes', () => {
//        expect(`${inst.round({ smallestUnit: 'minute', roundingIncrement: 15 })}`).toBe('1976-11-18T14:30:00Z')
//      });
//      it('rounds to an increment of seconds', () => {
//        expect(`${inst.round({ smallestUnit: 'second', roundingIncrement: 30 })}`).toBe('1976-11-18T14:23:30Z')
//      });
//      it('rounds to an increment of milliseconds', () => {
//        expect(`${inst.round({ smallestUnit: 'millisecond', roundingIncrement: 10 })}`).toBe('1976-11-18T14:23:30.12Z')
//      });
//      it('rounds to an increment of microseconds', () => {
//        expect(`${inst.round({ smallestUnit: 'microsecond', roundingIncrement: 10 })}`).toBe('1976-11-18T14:23:30.12346Z')
//      });
//      it('rounds to an increment of nanoseconds', () => {
//        expect(`${inst.round({ smallestUnit: 'nanosecond', roundingIncrement: 10 })}`).toBe('1976-11-18T14:23:30.12345679Z')
//      });
//      it('rounds to days by specifying increment of 86400 seconds in various units', () => {
//        const expected = '1976-11-19T00:00:00Z';
//        expect(`${inst.round({ smallestUnit: 'hour', roundingIncrement: 24 })}`).toBe(expected)
//        expect(`${inst.round({ smallestUnit: 'minute', roundingIncrement: 1440 })}`).toBe(expected)
//        expect(`${inst.round({ smallestUnit: 'second', roundingIncrement: 86400 })}`).toBe(expected)
//        expect(`${inst.round({ smallestUnit: 'millisecond', roundingIncrement: 86400e3 })}`).toBe(expected)
//        expect(`${inst.round({ smallestUnit: 'microsecond', roundingIncrement: 86400e6 })}`).toBe(expected)
//        expect(`${inst.round({ smallestUnit: 'nanosecond', roundingIncrement: 86400e9 })}`).toBe(expected)
//      });
//      it('allows increments that divide evenly into solar days', () => {
//        assert(inst.round({ smallestUnit: 'second', roundingIncrement: 864 }) instanceof Instant);
//      });
//      it('throws on increments that do not divide evenly into solar days', () => {
//        throws(() => inst.round({ smallestUnit: 'hour', roundingIncrement: 7 }), RangeError);
//        throws(() => inst.round({ smallestUnit: 'minute', roundingIncrement: 29 }), RangeError);
//        throws(() => inst.round({ smallestUnit: 'second', roundingIncrement: 29 }), RangeError);
//        throws(() => inst.round({ smallestUnit: 'millisecond', roundingIncrement: 29 }), RangeError);
//        throws(() => inst.round({ smallestUnit: 'microsecond', roundingIncrement: 29 }), RangeError);
//        throws(() => inst.round({ smallestUnit: 'nanosecond', roundingIncrement: 29 }), RangeError);
//      });
//      it('accepts plural units', () => {
//        assert(inst.round({ smallestUnit: 'hours' }).equals(inst.round({ smallestUnit: 'hour' })));
//        assert(inst.round({ smallestUnit: 'minutes' }).equals(inst.round({ smallestUnit: 'minute' })));
//        assert(inst.round({ smallestUnit: 'seconds' }).equals(inst.round({ smallestUnit: 'second' })));
//        assert(inst.round({ smallestUnit: 'milliseconds' }).equals(inst.round({ smallestUnit: 'millisecond' })));
//        assert(inst.round({ smallestUnit: 'microseconds' }).equals(inst.round({ smallestUnit: 'microsecond' })));
//        assert(inst.round({ smallestUnit: 'nanoseconds' }).equals(inst.round({ smallestUnit: 'nanosecond' })));
//      });
//    });
//    describe('Min/max range', () => {
//      it('constructing from ns', () => {
//        const limit = 8_640_000_000_000_000_000_000n;
//        throws(() => new Instant(-limit - 1n), RangeError);
//        throws(() => new Instant(limit + 1n), RangeError);
//        expect(`${new Instant(-limit)}`).toBe('-271821-04-20T00:00:00Z')
//        expect(`${new Instant(limit)}`).toBe('+275760-09-13T00:00:00Z')
//      });
//      it('constructing from ms', () => {
//        const limit = 86400e11;
//        throws(() => Instant.fromEpochMilliseconds(-limit - 1), RangeError);
//        throws(() => Instant.fromEpochMilliseconds(limit + 1), RangeError);
//        expect(`${Instant.fromEpochMilliseconds(-limit)}`).toBe('-271821-04-20T00:00:00Z')
//        expect(`${Instant.fromEpochMilliseconds(limit)}`).toBe('+275760-09-13T00:00:00Z')
//      });
//      it('constructing from ISO string', () => {
//        throws(() => Instant.from('-271821-04-19T23:59:59.999999999Z'), RangeError);
//        throws(() => Instant.from('+275760-09-13T00:00:00.000000001Z'), RangeError);
//        expect(`${Instant.from('-271821-04-20T00:00Z')}`).toBe('-271821-04-20T00:00:00Z')
//        expect(`${Instant.from('+275760-09-13T00:00Z')}`).toBe('+275760-09-13T00:00:00Z')
//      });
//      it('converting from DateTime', () => {
//        const min = Temporal.PlainDateTime.from('-271821-04-19T00:00:00.000000001');
//        const max = Temporal.PlainDateTime.from('+275760-09-13T23:59:59.999999999');
//        const utc = Temporal.TimeZone.from('UTC');
//        throws(() => utc.getInstantFor(min), RangeError);
//        throws(() => utc.getInstantFor(max), RangeError);
//      });
//      it('adding and subtracting beyond limit', () => {
//        const min = Instant.from('-271821-04-20T00:00Z');
//        const max = Instant.from('+275760-09-13T00:00Z');
//        throws(() => min.subtract({ nanoseconds: 1 }), RangeError);
//        throws(() => max.add({ nanoseconds: 1 }), RangeError);
//      });
//    });
//    describe('Instant.toZonedDateTimeISO() works', () => {
//      const inst = Instant.from('1976-11-18T14:23:30.123456789Z');
//      it('throws without parameter', () => {
//        throws(() => inst.toZonedDateTimeISO(), RangeError);
//      });
//      it('time zone parameter UTC', () => {
//        const tz = Temporal.TimeZone.from('UTC');
//        const zdt = inst.toZonedDateTimeISO(tz);
//        expect(inst.epochNanoseconds).toBe(zdt.epochNanoseconds)
//        expect(`${zdt}`).toBe('1976-11-18T14:23:30.123456789+00:00[UTC]')
//      });
//      it('time zone parameter non-UTC', () => {
//        const tz = Temporal.TimeZone.from('America/New_York');
//        const zdt = inst.toZonedDateTimeISO(tz);
//        expect(inst.epochNanoseconds).toBe(zdt.epochNanoseconds)
//        expect(`${zdt}`).toBe('1976-11-18T09:23:30.123456789-05:00[America/New_York]')
//      });
//    });
//    describe('Instant.toZonedDateTime() works', () => {
//      const inst = Instant.from('1976-11-18T14:23:30.123456789Z');
//      it('throws without parameter', () => {
//        throws(() => inst.toZonedDateTime(), TypeError);
//      });
//      it('throws with a string parameter', () => {
//        throws(() => inst.toZonedDateTime('Asia/Singapore'), TypeError);
//      });
//      it('time zone parameter UTC', () => {
//        const timeZone = Temporal.TimeZone.from('UTC');
//        const zdt = inst.toZonedDateTime({ timeZone, calendar: 'gregory' });
//        expect(inst.epochNanoseconds).toBe(zdt.epochNanoseconds)
//        expect(`${zdt}`).toBe('1976-11-18T14:23:30.123456789+00:00[UTC][u-ca=gregory]')
//      });
//      it('time zone parameter non-UTC', () => {
//        const timeZone = Temporal.TimeZone.from('America/New_York');
//        const zdt = inst.toZonedDateTime({ timeZone, calendar: 'gregory' });
//        expect(inst.epochNanoseconds).toBe(zdt.epochNanoseconds)
//        expect(`${zdt}`).toBe('1976-11-18T09:23:30.123456789-05:00[America/New_York][u-ca=gregory]')
//      });
//    });
//  });
