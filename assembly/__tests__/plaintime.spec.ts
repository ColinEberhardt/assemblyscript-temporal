import { Duration, DurationLike } from "../duration";
import { PlainDateTime } from "../plaindatetime";
import { PlainTime, TimeLike } from "../plaintime";

let time: PlainTime, t1: PlainTime, t2: PlainTime, t3: PlainTime;

describe("Construction", () => {
  describe("complete", () => {
    time = new PlainTime(15, 23, 30, 123, 456, 789);
    it("time.hour is 15", () => {
      expect(time.hour).toBe(15);
    });
    it("time.minute is 23", () => {
      expect(time.minute).toBe(23);
    });
    it("time.second is 30", () => {
      expect(time.second).toBe(30);
    });
    it("time.millisecond is 123", () => {
      expect(time.millisecond).toBe(123);
    });
    it("time.microsecond is 456", () => {
      expect(time.microsecond).toBe(456);
    });
    it("time.nanosecond is 789", () => {
      expect(time.nanosecond).toBe(789);
    });
    // it("time.calendar.id is iso8601", () =>
    //   expect(time.calendar.id).toBe("iso8601"));
    // it("time}` is 15:23:30.123456789", () =>
    //   expect(time}`).toBe("15:23:30.123456789"));
  });
  describe("missing nanosecond", () => {
    time = new PlainTime(15, 23, 30, 123, 456);
    it("time.hour is 15", () => {
      expect(time.hour).toBe(15);
    });
    it("time.minute is 23", () => {
      expect(time.minute).toBe(23);
    });
    it("time.second is 30", () => {
      expect(time.second).toBe(30);
    });
    it("time.millisecond is 123", () => {
      expect(time.millisecond).toBe(123);
    });
    it("time.microsecond is 456", () => {
      expect(time.microsecond).toBe(456);
    });
    it("time.nanosecond is 0", () => {
      expect(time.nanosecond).toBe(0);
    });
    // it("time}` is 15:23:30.123456", () => {
    //   expect(time}`).toBe("15:23:30.123456");
    // });
  });
  describe("missing microsecond", () => {
    time = new PlainTime(15, 23, 30, 123);
    it("time.hour is 15", () => {
      expect(time.hour).toBe(15);
    });
    it("time.minute is 23", () => {
      expect(time.minute).toBe(23);
    });
    it("time.second is 30", () => {
      expect(time.second).toBe(30);
    });
    it("time.millisecond is 123", () => {
      expect(time.millisecond).toBe(123);
    });
    it("time.microsecond is 0", () => {
      expect(time.microsecond).toBe(0);
    });
    it("time.nanosecond is 0", () => {
      expect(time.nanosecond).toBe(0);
    });
    // it("time}` is 15:23:30.123", () => {
    //   expect(time}`).toBe("15:23:30.123");
    // });
  });
  describe("missing millisecond", () => {
    time = new PlainTime(15, 23, 30);
    it("time.hour is 15", () => {
      expect(time.hour).toBe(15);
    });
    it("time.minute is 23", () => {
      expect(time.minute).toBe(23);
    });
    it("time.second is 30", () => {
      expect(time.second).toBe(30);
    });
    it("time.millisecond is 0", () => {
      expect(time.millisecond).toBe(0);
    });
    it("time.microsecond is 0", () => {
      expect(time.microsecond).toBe(0);
    });
    it("time.nanosecond is 0", () => {
      expect(time.nanosecond).toBe(0);
    });
    // it("time}` is 15:23:30", () => expect(time).toBe( "15:23:30"));
  });
  describe("missing second", () => {
    time = new PlainTime(15, 23);
    it("time.hour is 15", () => {
      expect(time.hour).toBe(15);
    });
    it("time.minute is 23", () => {
      expect(time.minute).toBe(23);
    });
    it("time.second is 0", () => {
      expect(time.second).toBe(0);
    });
    it("time.millisecond is 0", () => {
      expect(time.millisecond).toBe(0);
    });
    it("time.microsecond is 0", () => {
      expect(time.microsecond).toBe(0);
    });
    it("time.nanosecond is 0", () => {
      expect(time.nanosecond).toBe(0);
    });
    // it("time}` is 15:23:00", () => expect(time).toBe( "15:23:00"));
  });
  describe("missing minute", () => {
    const time = new PlainTime(15);
    // it("time}` is 15:00:00", () => expect(time).toBe( "15:00:00"));
  });
  describe("missing all parameters", () => {
    const time = new PlainTime();
    // it("time}` is 00:00:00", () => expect(time).toBe( "00:00:00"));
  });
});

describe(".with manipulation", () => {
  time = new PlainTime(15, 23, 30, 123, 456, 789);
  it("time.with({ hour: 3 } works", () => {
    expect(time.with({ hour: 3 }).toString()).toBe("03:23:30.123456789");
  });
  it("time.with({ minute: 3 } works", () => {
    expect(time.with({ minute: 3 }).toString()).toBe("15:03:30.123456789");
  });
  it("time.with({ second: 3 } works", () => {
    expect(time.with({ second: 3 }).toString()).toBe("15:23:03.123456789");
  });
  it("time.with({ millisecond: 3 } works", () => {
    expect(time.with({ millisecond: 3 }).toString()).toBe("15:23:30.003456789");
  });
  it("time.with({ microsecond: 3 } works", () => {
    expect(time.with({ microsecond: 3 }).toString()).toBe("15:23:30.123003789");
  });
  it("time.with({ nanosecond: 3 } works", () => {
    expect(time.with({ nanosecond: 3 }).toString()).toBe("15:23:30.123456003");
  });
  it("time.with({ minute: 8, nanosecond: 3 } works", () => {
    expect(time.with({ minute: 8, nanosecond: 3 }).toString()).toBe(
      "15:08:30.123456003"
    );
  });
  // it("invalid overflow", () => {
  //   ["", "CONSTRAIN", "balance", 3, null].forEach((overflow) =>
  //     throws(() => time.with({ hour: 3 }, { overflow }), RangeError)
  //   );
  // });
  // it("options may only be an object or undefined", () => {
  //   [null, 1, "hello", true, Symbol("foo"), 1n].forEach((badOptions) =>
  //     throws(() => time.with({ hour: 3 }, badOptions), TypeError)
  //   );
  //   [{}, () => {}, undefined].forEach((options) =>
  //     expect(time.with({ hour: 3 }, options).toString()).toBe(
  //       "03:23:30.123456789"
  //     )
  //   );
  // });
  // it("object must contain at least one correctly-spelled property", () => {
  //   throws(() => time.with({}), TypeError);
  //   throws(() => time.with({ minutes: 12 }), TypeError);
  // });
  // it("incorrectly-spelled properties are ignored", () => {
  //   expect(time.with({ minutes: 1, hour: 1 }).toString()).toBe(
  //     "01:23:30.123456789"
  //   );
  // });
  // it("time.with(string) throws", () => {
  //   throws(() => time.with("18:05:42.577"), TypeError);
  //   throws(() => time.with("2019-05-17T18:05:42.577"), TypeError);
  //   throws(() => time.with("2019-05-17T18:05:42.577Z"), TypeError);
  //   throws(() => time.with("2019-05-17"), TypeError);
  //   throws(() => time.with("42"), TypeError);
  // // });
  // it("throws with calendar property", () => {
  //   throws(() => time.with({ hour: 21, calendar: "iso8601" }), TypeError);
  // });
  // it("throws with timeZone property", () => {
  //   throws(() => time.with({ hour: 21, timeZone: "UTC" }), TypeError);
  // });
});

describe("Time.compare() works", () => {
  t1 = PlainTime.from("08:44:15.321");
  t2 = PlainTime.from("14:23:30.123");
  it("equal", () => {
    expect(PlainTime.compare(t1, t1)).toBe(0);
  });
  it("smaller/larger", () => {
    expect(PlainTime.compare(t1, t2)).toBe(-1);
  });
  it("larger/smaller", () => {
    expect(PlainTime.compare(t2, t1)).toBe(1);
  });
  // it("casts first argument", () => {
  //   expect(PlainTime.compare({ hour: 16, minute: 34 }, t2), 1);
  //   expect(PlainTime.compare("16:34", t2), 1);
  // });
  // it("casts second argument", () => {
  //   expect(PlainTime.compare(t1, { hour: 16, minute: 34 }), -1);
  //   expect(PlainTime.compare(t1, "16:34"), -1);
  // });
  // it("object must contain at least one correctly-spelled property", () => {
  //   throws(() => PlainTime.compare({ hours: 16 }, t2), TypeError);
  //   throws(() => PlainTime.compare(t1, { hours: 16 }), TypeError);
  // });
});

describe("time.equals() works", () => {
  t1 = PlainTime.from("08:44:15.321");
  t2 = PlainTime.from("14:23:30.123");
  it("equal", () => {
    expect(t1).toBe(t1);
  });
  it("unequal", () => {
    expect(t2).not.toBe(t1);
  });
  // it("casts argument", () => {
  //   assert(t1.equals("08:44:15.321"));
  //   assert(t1.equals({ hour: 8, minute: 44, second: 15, millisecond: 321 }));
  // });
  // it("object must contain at least one correctly-spelled property", () => {
  //   throws(() => t1.equals({ hours: 8 }), TypeError);
  // });
});

describe("time.add() works", () => {
  time = new PlainTime(15, 23, 30, 123, 456, 789);
  it(time.toString() + ".add({ hours: 16 })", () => {
    expect(
      time
        .add<DurationLike>({ hours: 16 })
        .toString()
    ).toBe("07:23:30.123456789");
  });
  it(time.toString() + ".add({ minutes: 45 })", () => {
    expect(
      time
        .add<DurationLike>({ minutes: 45 })
        .toString()
    ).toBe("16:08:30.123456789");
  });
  xit(time.toString() + ".add({ nanoseconds: 300 })", () => {
    // https://github.com/ColinEberhardt/assemblyscript-temporal/pull/25#issuecomment-812995856
    expect(
      time
        .add<DurationLike>({ nanoseconds: 300 })
        .toString()
    ).toBe("15:23:30.123457089");
  });
  it("symmetric with regard to negative durations", () => {
    expect(
      PlainTime.from<string>("07:23:30.123456789")
        .add<DurationLike>({ hours: -16 })
        .toString()
    ).toBe("15:23:30.123456789");
    expect(
      PlainTime.from<string>("16:08:30.123456789")
        .add<DurationLike>({ minutes: -45 })
        .toString()
    ).toBe("15:23:30.123456789");
    expect(
      PlainTime.from<string>("15:23:30.123457089")
        .add<DurationLike>({ nanoseconds: -300 })
        .toString()
    ).toBe("15:23:30.123456789");
  });
  // it("time.add(durationObj)", () => {
  //   expect(time.add(Duration.from("PT16H")).toString()).toBe(
  //     "07:23:30.123456789"
  //   );
  // });
  // it("casts argument", () =>
  //   expect(time.add("PT16H").toString()).toBe("07:23:30.123456789"));
  // it("ignores higher units", () => {
  //   expect(time.add({ days: 1 }).toString()).toBe("15:23:30.123456789");
  //   expect(time.add({ months: 1 }).toString()).toBe("15:23:30.123456789");
  //   expect(time.add({ years: 1 }).toString()).toBe("15:23:30.123456789");
  // });
  // it("mixed positive and negative values always throw", () => {
  //   ["constrain", "reject"].forEach((overflow) =>
  //     throws(
  //       () => time.add({ hours: 1, minutes: -30 }, { overflow }),
  //       RangeError
  //     )
  //   );
  // });
  // it("options is ignored", () => {
  //   [
  //     null,
  //     1,
  //     "hello",
  //     true,
  //     Symbol("foo"),
  //     1n,
  //     {},
  //     () => {},
  //     undefined,
  //   ].forEach((options) =>
  //     expect(time.add({ hours: 1 }, options).toString()).toBe(
  //       "16:23:30.123456789"
  //     )
  //   );
  //   ["", "CONSTRAIN", "balance", 3, null].forEach((overflow) =>
  //     expect(time.add({ hours: 1 }, { overflow }).toString()).toBe(
  //       "16:23:30.123456789"
  //     )
  //   );
  // });
  // it("object must contain at least one correctly-spelled property", () => {
  //   throws(() => time.add({}), TypeError);
  //   throws(() => time.add({ minute: 12 }), TypeError);
  // });
  // it("incorrectly-spelled properties are ignored", () => {
  //   expect(time.add({ minute: 1, hours: 1 }).toString()).toBe(
  //     "16:23:30.123456789"
  //   );
  // });
});

describe("time.subtract() works", () => {
  time = PlainTime.from("15:23:30.123456789");
  it(time.toString() + ".subtract({ hours: 16 })", () => {
    expect(
      time
        .subtract<DurationLike>({ hours: 16 })
        .toString()
    ).toBe("23:23:30.123456789");
  });
  it(time.toString() + ".subtract({ minutes: 45 })", () => {
    expect(
      time
        .subtract<DurationLike>({ minutes: 45 })
        .toString()
    ).toBe("14:38:30.123456789");
  });
  it(time.toString() + ".subtract({ seconds: 45 })", () => {
    expect(
      time
        .subtract<DurationLike>({ seconds: 45 })
        .toString()
    ).toBe("15:22:45.123456789");
  });
  it(time.toString() + ".subtract({ milliseconds: 800 })", () => {
    expect(
      time
        .subtract<DurationLike>({ milliseconds: 800 })
        .toString()
    ).toBe("15:23:29.323456789");
  });
  it(time.toString() + ".subtract({ microseconds: 800 })", () => {
    expect(
      time
        .subtract<DurationLike>({ microseconds: 800 })
        .toString()
    ).toBe("15:23:30.122656789");
  });
  it(time.toString() + ".subtract({ nanoseconds: 800 })", () => {
    expect(
      time
        .subtract<DurationLike>({ nanoseconds: 800 })
        .toString()
    ).toBe("15:23:30.123455989");
  });
  it("symmetric with regard to negative durations", () => {
    expect(
      PlainTime.from("23:23:30.123456789")
        .subtract<DurationLike>({ hours: -16 })
        .toString()
    ).toBe("15:23:30.123456789");
    expect(
      PlainTime.from("14:38:30.123456789")
        .subtract<DurationLike>({ minutes: -45 })
        .toString()
    ).toBe("15:23:30.123456789");
    expect(
      PlainTime.from("15:22:45.123456789")
        .subtract<DurationLike>({ seconds: -45 })
        .toString()
    ).toBe("15:23:30.123456789");
    expect(
      PlainTime.from("15:23:29.323456789")
        .subtract<DurationLike>({ milliseconds: -800 })
        .toString()
    ).toBe("15:23:30.123456789");
    expect(
      PlainTime.from("15:23:30.122656789")
        .subtract<DurationLike>({ microseconds: -800 })
        .toString()
    ).toBe("15:23:30.123456789");
    expect(
      PlainTime.from("15:23:30.123455989")
        .subtract<DurationLike>({ nanoseconds: -800 })
        .toString()
    ).toBe("15:23:30.123456789");
  });
  // it("time.subtract(durationObj)", () => {
  //   expect(time.subtract(Temporal.Duration.from("PT16H")).toString()).toBe(
  //     "23:23:30.123456789"
  //   );
  // });
  // it("casts argument", () =>
  //   expect(time.subtract("PT16H").toString()).toBe("23:23:30.123456789"));
  it("ignores higher units", () => {
    expect(
      time
        .subtract<DurationLike>({ days: 1 })
        .toString()
    ).toBe("15:23:30.123456789");
    expect(
      time
        .subtract<DurationLike>({ months: 1 })
        .toString()
    ).toBe("15:23:30.123456789");
    expect(
      time
        .subtract<DurationLike>({ years: 1 })
        .toString()
    ).toBe("15:23:30.123456789");
  });
  // it("mixed positive and negative values always throw", () => {
  //   ["constrain", "reject"].forEach((overflow) =>
  //     throws(
  //       () => time.subtract({ hours: 1, minutes: -30 }, { overflow }),
  //       RangeError
  //     )
  //   );
  // });
  // it("options is ignored", () => {
  //   [
  //     null,
  //     1,
  //     "hello",
  //     true,
  //     Symbol("foo"),
  //     1n,
  //     {},
  //     () => {},
  //     undefined,
  //   ].forEach((options) =>
  //     expect(time.subtract({ hours: 1 }, options).toString()).toBe(
  //       "14:23:30.123456789"
  //     )
  //   );
  //   ["", "CONSTRAIN", "balance", 3, null].forEach((overflow) =>
  //     expect(time.subtract({ hours: 1 }, { overflow }).toString()).toBe(
  //       "14:23:30.123456789"
  //     )
  //   );
  // });
  // it("object must contain at least one correctly-spelled property", () => {
  //   throws(() => time.subtract({}), TypeError);
  //   throws(() => time.subtract({ minute: 12 }), TypeError);
  // });
  // it("incorrectly-spelled properties are ignored", () => {
  //   expect(time.subtract({ minute: 1, hours: 1 }).toString()).toBe(
  //     "14:23:30.123456789"
  //   );
  // });
});

describe("time.toString() works", () => {
  it("new Time(15, 23).toString()", () => {
    expect(new PlainTime(15, 23).toString()).toBe("15:23:00");
  });
  it("new Time(15, 23, 30).toString()", () => {
    expect(new PlainTime(15, 23, 30).toString()).toBe("15:23:30");
  });
  it("new Time(15, 23, 30, 123).toString()", () => {
    expect(new PlainTime(15, 23, 30, 123).toString()).toBe("15:23:30.123");
  });
  it("new Time(15, 23, 30, 123, 456).toString()", () => {
    expect(new PlainTime(15, 23, 30, 123, 456).toString()).toBe(
      "15:23:30.123456"
    );
  });
  it("new Time(15, 23, 30, 123, 456, 789).toString()", () => {
    expect(new PlainTime(15, 23, 30, 123, 456, 789).toString()).toBe(
      "15:23:30.123456789"
    );
  });
  t1 = PlainTime.from("15:23");
  t2 = PlainTime.from("15:23:30");
  t3 = PlainTime.from("15:23:30.1234");
  it("default is to emit seconds and drop trailing zeros after the decimal", () => {
    expect(t1.toString()).toBe("15:23:00");
    expect(t2.toString()).toBe("15:23:30");
    expect(t3.toString()).toBe("15:23:30.1234");
  });
  // it("truncates to minute", () => {
  //   [t1, t2, t3].forEach((t) =>
  //     expect(t.toString({ smallestUnit: "minute" }), "15:23")
  //   );
  // });
  // it("other smallestUnits are aliases for fractional digits", () => {
  //   expect(
  //     t3.toString({ smallestUnit: "second" }),
  //     t3.toString({ fractionalSecondDigits: 0 })
  //   );
  //   expect(
  //     t3.toString({ smallestUnit: "millisecond" }),
  //     t3.toString({ fractionalSecondDigits: 3 })
  //   );
  //   expect(
  //     t3.toString({ smallestUnit: "microsecond" }),
  //     t3.toString({ fractionalSecondDigits: 6 })
  //   );
  //   expect(
  //     t3.toString({ smallestUnit: "nanosecond" }),
  //     t3.toString({ fractionalSecondDigits: 9 })
  //   );
  // });
  // it("throws on invalid or disallowed smallestUnit", () => {
  //   [
  //     "era",
  //     "year",
  //     "month",
  //     "day",
  //     "hour",
  //     "nonsense",
  //   ].forEach((smallestUnit) =>
  //     throws(() => t1.toString({ smallestUnit }), RangeError)
  //   );
  // });
  // it("accepts plural units", () => {
  //   expect(
  //     t3.toString({ smallestUnit: "minutes" }),
  //     t3.toString({ smallestUnit: "minute" })
  //   );
  //   expect(
  //     t3.toString({ smallestUnit: "seconds" }),
  //     t3.toString({ smallestUnit: "second" })
  //   );
  //   expect(
  //     t3.toString({ smallestUnit: "milliseconds" }),
  //     t3.toString({ smallestUnit: "millisecond" })
  //   );
  //   expect(
  //     t3.toString({ smallestUnit: "microseconds" }),
  //     t3.toString({ smallestUnit: "microsecond" })
  //   );
  //   expect(
  //     t3.toString({ smallestUnit: "nanoseconds" }),
  //     t3.toString({ smallestUnit: "nanosecond" })
  //   );
  // });
  // it("truncates or pads to 2 places", () => {
  //   const options = { fractionalSecondDigits: 2 };
  //   expect(t1.toString(options), "15:23:00.00");
  //   expect(t2.toString(options), "15:23:30.00");
  //   expect(t3.toString(options), "15:23:30.12");
  // });
  // it("pads to 7 places", () => {
  //   const options = { fractionalSecondDigits: 7 };
  //   expect(t1.toString(options), "15:23:00.0000000");
  //   expect(t2.toString(options), "15:23:30.0000000");
  //   expect(t3.toString(options), "15:23:30.1234000");
  // });
  // it("auto is the default", () => {
  //   [t1, t2, t3].forEach((dt) =>
  //     expect(dt.toString({ fractionalSecondDigits: "auto" }), dt.toString())
  //   );
  // });
  // it("throws on out of range or invalid fractionalSecondDigits", () => {
  //   [-1, 10, Infinity, NaN, "not-auto"].forEach((fractionalSecondDigits) =>
  //     throws(() => t1.toString({ fractionalSecondDigits }), RangeError)
  //   );
  // });
  // it("accepts and truncates fractional fractionalSecondDigits", () => {
  //   expect(t3.toString({ fractionalSecondDigits: 5.5 }), "15:23:30.12340");
  // });
  // it("smallestUnit overrides fractionalSecondDigits", () => {
  //   expect(
  //     t3.toString({ smallestUnit: "minute", fractionalSecondDigits: 9 }),
  //     "15:23"
  //   );
  // });
  // it("throws on invalid roundingMode", () => {
  //   throws(() => t1.toString({ roundingMode: "cile" }), RangeError);
  // });
  // it("rounds to nearest", () => {
  //   expect(
  //     t2.toString({ smallestUnit: "minute", roundingMode: "halfExpand" }),
  //     "15:24"
  //   );
  //   expect(
  //     t3.toString({ fractionalSecondDigits: 3, roundingMode: "halfExpand" }),
  //     "15:23:30.123"
  //   );
  // });
  // it("rounds up", () => {
  //   expect(
  //     t2.toString({ smallestUnit: "minute", roundingMode: "ceil" }),
  //     "15:24"
  //   );
  //   expect(
  //     t3.toString({ fractionalSecondDigits: 3, roundingMode: "ceil" }),
  //     "15:23:30.124"
  //   );
  // });
  // it("rounds down", () => {
  //   ["floor", "trunc"].forEach((roundingMode) => {
  //     expect(t2.toString({ smallestUnit: "minute", roundingMode }), "15:23");
  //     expect(
  //       t3.toString({ fractionalSecondDigits: 3, roundingMode }),
  //       "15:23:30.123"
  //     );
  //   });
  // });
  // it("rounding can affect all units", () => {
  //   const t4 = PlainTime.from("23:59:59.999999999");
  //   expect(
  //     t4.toString({ fractionalSecondDigits: 8, roundingMode: "halfExpand" }),
  //     "00:00:00.00000000"
  //   );
  // });
  // it("options may only be an object or undefined", () => {
  //   [null, 1, "hello", true, Symbol("foo"), 1n].forEach((badOptions) =>
  //     throws(() => t1.toString(badOptions), TypeError)
  //   );
  //   [{}, () => {}, undefined].forEach((options) =>
  //     expect(t1.toString(options), "15:23:00")
  //   );
  // });
});

describe("Time.from() works", () => {
  it('Time.from("15:23")', () => {
    expect(PlainTime.from("15:23").toString()).toBe("15:23:00");
  });
  it('Time.from("15:23:30")', () => {
    expect(PlainTime.from("15:23:30").toString()).toBe("15:23:30");
  });
  it('Time.from("15:23:30.123")', () => {
    expect(PlainTime.from("15:23:30.123").toString()).toBe("15:23:30.123");
  });
  it('Time.from("15:23:30.123456")', () => {
    expect(PlainTime.from("15:23:30.123456").toString()).toBe(
      "15:23:30.123456"
    );
  });
  it('Time.from("15:23:30.123456789")', () => {
    expect(PlainTime.from("15:23:30.123456789").toString()).toBe(
      "15:23:30.123456789"
    );
  });
  it("Time.from({ hour: 15, minute: 23 })", () => {
    expect(
      PlainTime.from<TimeLike>({
        hour: 15,
        minute: 23,
        second: 0,
        microsecond: 0,
        millisecond: 0,
        nanosecond: 0,
      }).toString()
    ).toBe("15:23:00");
  });
  it("Time.from({ minute: 30, microsecond: 555 })", () => {
    expect(PlainTime.from({ minute: 30, microsecond: 555 }).toString()).toBe(
      "00:30:00.000555"
    );
  });
  it("Time.from(ISO string leap second) is constrained", () => {
    expect(PlainTime.from("23:59:60").toString()).toBe("23:59:59");
    expect(PlainTime.from("23:59:60").toString()).toBe("23:59:59");
  });
  // it("Time.from(number) is converted to string", () => {
  //   expect(PlainTime.from(152343).toString()).toBe(
  //     PlainTime.from("152343").toString()
  //   );
  // });
  it("Time.from(time) returns the same properties", () => {
    const t = PlainTime.from("2020-02-12T11:42:00+01:00[Europe/Amsterdam]");
    expect(PlainTime.from(t).toString()).toBe(t.toString());
  });
  it("Time.from(dateTime) returns the same time properties", () => {
    const dt = PlainDateTime.from(
      "2020-02-12T11:42:00+01:00[Europe/Amsterdam]"
    );
    expect(PlainTime.from(dt).toString()).toBe(dt.toPlainTime().toString());
  });
  it("Time.from(time) is not the same object", () => {
    const t = PlainTime.from("2020-02-12T11:42:00+01:00[Europe/Amsterdam]");
    expect(PlainTime.from(t)).not.toBe(t);
  });
  it("any number of decimal places", () => {
    expect(PlainTime.from("1976-11-18T15:23:30.1Z").toString()).toBe(
      "15:23:30.1"
    );
    expect(PlainTime.from("1976-11-18T15:23:30.12Z").toString()).toBe(
      "15:23:30.12"
    );
    expect(PlainTime.from("1976-11-18T15:23:30.123Z").toString()).toBe(
      "15:23:30.123"
    );
    expect(PlainTime.from("1976-11-18T15:23:30.1234Z").toString()).toBe(
      "15:23:30.1234"
    );
    expect(PlainTime.from("1976-11-18T15:23:30.12345Z").toString()).toBe(
      "15:23:30.12345"
    );
    expect(PlainTime.from("1976-11-18T15:23:30.123456Z").toString()).toBe(
      "15:23:30.123456"
    );
    expect(PlainTime.from("1976-11-18T15:23:30.1234567Z").toString()).toBe(
      "15:23:30.1234567"
    );
    expect(PlainTime.from("1976-11-18T15:23:30.12345678Z").toString()).toBe(
      "15:23:30.12345678"
    );
    expect(PlainTime.from("1976-11-18T15:23:30.123456789Z").toString()).toBe(
      "15:23:30.123456789"
    );
  });
  it("variant decimal separator", () => {
    expect(PlainTime.from("1976-11-18T15:23:30,12Z").toString()).toBe(
      "15:23:30.12"
    );
  });
  // it("variant minus sign", () => {
  //   expect(PlainTime.from("1976-11-18T15:23:30.12\u221202:00").toString()).toBe(
  //     "15:23:30.12"
  //   );
  // });
  it("basic format", () => {
    expect(PlainTime.from("152330").toString()).toBe("15:23:30");
    expect(PlainTime.from("152330.1").toString()).toBe("15:23:30.1");
    expect(PlainTime.from("152330-08").toString()).toBe("15:23:30");
    expect(PlainTime.from("152330.1-08").toString()).toBe("15:23:30.1");
    expect(PlainTime.from("152330-0800").toString()).toBe("15:23:30");
    expect(PlainTime.from("152330.1-0800").toString()).toBe("15:23:30.1");
  });
  it("mixture of basic and extended format", () => {
    expect(PlainTime.from("1976-11-18T152330.1+00:00").toString()).toBe(
      "15:23:30.1"
    );
    expect(PlainTime.from("19761118T15:23:30.1+00:00").toString()).toBe(
      "15:23:30.1"
    );
    expect(PlainTime.from("1976-11-18T15:23:30.1+0000").toString()).toBe(
      "15:23:30.1"
    );
    expect(PlainTime.from("1976-11-18T152330.1+0000").toString()).toBe(
      "15:23:30.1"
    );
    expect(PlainTime.from("19761118T15:23:30.1+0000").toString()).toBe(
      "15:23:30.1"
    );
    expect(PlainTime.from("19761118T152330.1+00:00").toString()).toBe(
      "15:23:30.1"
    );
    expect(PlainTime.from("19761118T152330.1+0000").toString()).toBe(
      "15:23:30.1"
    );
    expect(PlainTime.from("+001976-11-18T152330.1+00:00").toString()).toBe(
      "15:23:30.1"
    );
    expect(PlainTime.from("+0019761118T15:23:30.1+00:00").toString()).toBe(
      "15:23:30.1"
    );
    expect(PlainTime.from("+001976-11-18T15:23:30.1+0000").toString()).toBe(
      "15:23:30.1"
    );
    expect(PlainTime.from("+001976-11-18T152330.1+0000").toString()).toBe(
      "15:23:30.1"
    );
    expect(PlainTime.from("+0019761118T15:23:30.1+0000").toString()).toBe(
      "15:23:30.1"
    );
    expect(PlainTime.from("+0019761118T152330.1+00:00").toString()).toBe(
      "15:23:30.1"
    );
    expect(PlainTime.from("+0019761118T152330.1+0000").toString()).toBe(
      "15:23:30.1"
    );
  });
  it("optional parts", () => {
    expect(PlainTime.from("15").toString()).toBe("15:00:00");
  });
  it("no junk at end of string", () => {
    expect(() => {
      PlainTime.from("15:23:30.100junk");
    }).toThrow();
  });
  // it("options may only be an object or undefined", () => {
  //   [null, 1, "hello", true, Symbol("foo"), 1n].forEach((badOptions) =>
  //     throws(() => PlainTime.from({ hour: 12 }, badOptions), TypeError)
  //   );
  //   [{}, () => {}, undefined].forEach((options) =>
  //     expect(PlainTime.from({ hour: 12 }, options)).toBe("12:00:00")
  //   );
  // });
  // describe("Overflow", () => {
  //   const bad = { nanosecond: 1000 };
  //   it("reject", () =>
  //     throws(() => PlainTime.from(bad, { overflow: "reject" }), RangeError));
  //   it("constrain", () => {
  //     expect(PlainTime.from(bad)).toBe("00:00:00.000000999");
  //     expect(PlainTime.from(bad, { overflow: "constrain" })).toBe(
  //       "00:00:00.000000999"
  //     );
  //   });
  //   it("throw on bad overflow", () => {
  //     [new PlainTime(15), { hour: 15 }, "15:00"].forEach((input) => {
  //       ["", "CONSTRAIN", "balance", 3, null].forEach((overflow) =>
  //         throws(() => PlainTime.from(input, { overflow }), RangeError)
  //       );
  //     });
  //   });
  //   const leap = { hour: 23, minute: 59, second: 60 };
  //   it("reject leap second", () =>
  //     throws(() => PlainTime.from(leap, { overflow: "reject" }), RangeError));
  //   it("constrain leap second", () =>
  //     expect(PlainTime.from(leap)).toBe("23:59:59"));
  //   it("constrain has no effect on invalid ISO string", () => {
  //     throws(
  //       () => PlainTime.from("24:60", { overflow: "constrain" }),
  //       RangeError
  //     );
  //   });
  // });
  // it("object must contain at least one correctly-spelled property", () => {
  //   throws(() => PlainTime.from({}), TypeError);
  //   throws(() => PlainTime.from({ minutes: 12 }), TypeError);
  // });
  // it("incorrectly-spelled properties are ignored", () => {
  //   expect(PlainTime.from({ minutes: 1, hour: 1 })).toBe("01:00:00");
  // });
});