import { Duration, DurationLike } from "../duration";
import { PlainDate } from "../plaindate";
import { PlainDateTime } from "../plaindatetime";
import { MonthDayLike, PlainMonthDay } from "../plainmonthday";

let one: PlainMonthDay,
  two: PlainMonthDay,
  md: PlainMonthDay,
  md1: PlainMonthDay,
  md2: PlainMonthDay;

describe("MonthDay", () => {
  // describe('Structure', () => {
  //   it('MonthDay is a Function', () => {
  //     equal(typeof PlainMonthDay, 'function');
  //   });
  //   it('MonthDay has a prototype', () => {
  //     assert(PlainMonthDay.prototype);
  //     equal(typeof PlainMonthDay.prototype, 'object');
  //   });
  //   describe('MonthDay.prototype', () => {
  //     it('MonthDay.prototype has monthCode', () => {
  //       assert('monthCode' in PlainMonthDay.prototype);
  //     });
  //     it('MonthDay.prototype.equals is a Function', () => {
  //       equal(typeof PlainMonthDay.prototype.equals, 'function');
  //     });
  //     it('MonthDay.prototype.toString is a Function', () => {
  //       equal(typeof PlainMonthDay.prototype.toString, 'function');
  //     });
  //     it('MonthDay.prototype.getISOFields is a Function', () => {
  //       equal(typeof PlainMonthDay.prototype.getISOFields, 'function');
  //     });
  //   });
  // });
  describe("Construction", () => {
    it("Leap day", () => {
      expect(new PlainMonthDay(2, 29).toString()).toBe("02-29");
    });
    describe(".from()", () => {
      it("MonthDay.from(10-01) == 10-01", () => {
        expect(PlainMonthDay.from("10-01").toString()).toBe("10-01");
      });
      it("MonthDay.from(2019-10-01T09:00:00Z) == 10-01", () => {
        expect(PlainMonthDay.from("2019-10-01T09:00:00Z").toString()).toBe(
          "10-01"
        );
      });
      it("MonthDay.from('11-18') == (11-18)", () => {
        expect(PlainMonthDay.from("11-18").toString()).toBe("11-18");
      });
      it("MonthDay.from('1976-11-18') == (11-18)", () => {
        expect(PlainMonthDay.from("1976-11-18").toString()).toBe("11-18");
      });
      xit('MonthDay.from({ monthCode: "M11", day: 18 }) == 11-18', () => {
        // expect(
        //   PlainMonthDay.from({ monthCode: "M11", day: 18 }).toString()
        // ).toBe("11-18");
      });
      //   it("ignores year when determining the ISO reference year from month/day", () => {
      //     const one = PlainMonthDay.from({ year: 2019, month: 11, day: 18 });
      //     const two = PlainMonthDay.from({ year: 1979, month: 11, day: 18 });
      //     equal(one.getISOFields().isoYear, two.getISOFields().isoYear);
      //   });
      //   it("ignores era/eraYear when determining the ISO reference year from month/day", () => {
      //     const one = PlainMonthDay.from({
      //       era: "ce",
      //       eraYear: 2019,
      //       month: 11,
      //       day: 18,
      //       calendar: "gregory",
      //     });
      //     const two = PlainMonthDay.from({
      //       era: "ce",
      //       eraYear: 1979,
      //       month: 11,
      //       day: 18,
      //       calendar: "gregory",
      //     });
      //     equal(one.getISOFields().isoYear, two.getISOFields().isoYear);
      //   });
      //   it("ignores year when determining the ISO reference year from monthCode/day", () => {
      //     const one = PlainMonthDay.from({
      //       year: 2019,
      //       monthCode: "M11",
      //       day: 18,
      //     });
      //     const two = PlainMonthDay.from({
      //       year: 1979,
      //       monthCode: "M11",
      //       day: 18,
      //     });
      //     equal(one.getISOFields().isoYear, two.getISOFields().isoYear);
      //   });
      //   it("ignores era/eraYear when determining the ISO reference year from monthCode/day", () => {
      //     const one = PlainMonthDay.from({
      //       era: "ce",
      //       eraYear: 2019,
      //       monthCode: "M11",
      //       day: 18,
      //       calendar: "gregory",
      //     });
      //     const two = PlainMonthDay.from({
      //       era: "ce",
      //       eraYear: 1979,
      //       monthCode: "M11",
      //       day: 18,
      //       calendar: "gregory",
      //     });
      //     equal(one.getISOFields().isoYear, two.getISOFields().isoYear);
      //   });
      it("MonthDay.from(11-18) is not the same object", () => {
        one = new PlainMonthDay(11, 18);
        two = PlainMonthDay.from(one);
        expect(one).not.toBe(two);
      });
      //   it("ignores year when determining the ISO reference year from other Temporal object", () => {
      //     const plainDate1 = Temporal.PlainDate.from("2019-11-18");
      //     const plainDate2 = Temporal.PlainDate.from("1976-11-18");
      //     const one = PlainMonthDay.from(plainDate1);
      //     const two = PlainMonthDay.from(plainDate2);
      //     equal(one.getISOFields().isoYear, two.getISOFields().isoYear);
      //   });
      it("MonthDay.from({month, day}) allowed if calendar absent", () => {
        expect(PlainMonthDay.from({ month: 11, day: 18 }).toString()).toBe(
          "11-18"
        );
      });
      xit("MonthDay.from({month, day}) not allowed in explicit ISO calendar", () => {});
      //   throws(
      //     () => PlainMonthDay.from({ month: 11, day: 18, calendar: "iso8601" }),
      //     TypeError
      //   )
      xit("MonthDay.from({month, day}) not allowed in other calendar", () => {});
      //   throws(
      //     () => PlainMonthDay.from({ month: 11, day: 18, calendar: "gregory" }),
      //     TypeError)
      xit("MonthDay.from({year, month, day}) allowed in other calendar", () => {
        //   equal(
        //     `${PlainMonthDay.from({
        //       year: 1970,
        //       month: 11,
        //       day: 18,
        //       calendar: "gregory",
        //     })}`,
        //     "1972-11-18[u-ca=gregory]"
        //   );
      });
      xit("MonthDay.from({era, eraYear, month, day}) allowed in other calendar", () => {
        //   equal(
        //     `${PlainMonthDay.from({
        //       era: "ce",
        //       eraYear: 1970,
        //       month: 11,
        //       day: 18,
        //       calendar: "gregory",
        //     })}`,
        //     "1972-11-18[u-ca=gregory]"
        //   );
      });
      it("MonthDay.from({ day: 15 }) throws", () => {
        expect(() => {
          PlainMonthDay.from({ day: 15 });
        }).toThrow();
      });
      //   it('MonthDay.from({ monthCode: "M12" }) throws', () =>
      //     throws(() => PlainMonthDay.from({ monthCode: "M12" }), TypeError));
      //   it("MonthDay.from({}) throws", () =>
      //     throws(() => PlainMonthDay.from({}), TypeError));
      //   it("MonthDay.from(required prop undefined) throws", () =>
      //     throws(
      //       () => PlainMonthDay.from({ monthCode: undefined, day: 15 }),
      //       TypeError
      //     ));
      //   it("MonthDay.from(number) is converted to string", () =>
      //     assert(PlainMonthDay.from(1201).equals(PlainMonthDay.from("12-01"))));
      it("basic format", () => {
        expect(PlainMonthDay.from("1118").toString()).toBe("11-18");
      });
      it("mixture of basic and extended format", () => {
        expect(PlainMonthDay.from("1976-11-18T152330.1+00:00").toString()).toBe(
          "11-18"
        );
        expect(PlainMonthDay.from("19761118T15:23:30.1+00:00").toString()).toBe(
          "11-18"
        );
        expect(
          PlainMonthDay.from("1976-11-18T15:23:30.1+0000").toString()
        ).toBe("11-18");
        expect(PlainMonthDay.from("1976-11-18T152330.1+0000").toString()).toBe(
          "11-18"
        );
        expect(PlainMonthDay.from("19761118T15:23:30.1+0000").toString()).toBe(
          "11-18"
        );
        expect(PlainMonthDay.from("19761118T152330.1+00:00").toString()).toBe(
          "11-18"
        );
        expect(PlainMonthDay.from("19761118T152330.1+0000").toString()).toBe(
          "11-18"
        );
        expect(
          PlainMonthDay.from("+001976-11-18T152330.1+00:00").toString()
        ).toBe("11-18");
        expect(
          PlainMonthDay.from("+0019761118T15:23:30.1+00:00").toString()
        ).toBe("11-18");
        expect(
          PlainMonthDay.from("+001976-11-18T15:23:30.1+0000").toString()
        ).toBe("11-18");
        expect(
          PlainMonthDay.from("+001976-11-18T152330.1+0000").toString()
        ).toBe("11-18");
        expect(
          PlainMonthDay.from("+0019761118T15:23:30.1+0000").toString()
        ).toBe("11-18");
        expect(
          PlainMonthDay.from("+0019761118T152330.1+00:00").toString()
        ).toBe("11-18");
        expect(PlainMonthDay.from("+0019761118T152330.1+0000").toString()).toBe(
          "11-18"
        );
      });
      it("optional parts", () => {
        expect(PlainMonthDay.from("1976-11-18T15:23").toString()).toBe("11-18");
        expect(PlainMonthDay.from("1976-11-18T15").toString()).toBe("11-18");
        expect(PlainMonthDay.from("1976-11-18").toString()).toBe("11-18");
      });
      it("RFC 3339 month-day syntax", () => {
        expect(PlainMonthDay.from("--11-18").toString()).toBe("11-18");
        expect(PlainMonthDay.from("--1118").toString()).toBe("11-18");
      });
      it("ignores year when determining the ISO reference year from string", () => {
        one = PlainMonthDay.from("2019-11-18");
        two = PlainMonthDay.from("1976-11-18");
        expect(one.referenceISOYear).toBe(two.referenceISOYear);
      });
      it("no junk at end of string", () => {
        expect(() => {
          PlainMonthDay.from("11-18junk");
        }).toThrow();
      });
      //   it("options may only be an object or undefined", () => {
      //     [null, 1, "hello", true, Symbol("foo"), 1n].forEach((badOptions) =>
      //       throws(
      //         () => PlainMonthDay.from({ month: 11, day: 18 }, badOptions),
      //         TypeError
      //       )
      //     );
      //     [{}, () => {}, undefined].forEach((options) =>
      //       equal(
      //         `${PlainMonthDay.from({ month: 11, day: 18 }, options)}`,
      //         "11-18"
      //       )
      //     );
      //   });
      //   describe("Overflow", () => {
      //     const bad = { month: 1, day: 32 };
      //     it("reject", () =>
      //       throws(
      //         () => PlainMonthDay.from(bad, { overflow: "reject" }),
      //         RangeError
      //       ));
      //     it("constrain", () => {
      //       equal(`${PlainMonthDay.from(bad)}`, "01-31");
      //       equal(
      //         `${PlainMonthDay.from(bad, { overflow: "constrain" })}`,
      //         "01-31"
      //       );
      //     });
      //     it("throw on bad overflow", () => {
      //       [new PlainMonthDay(11, 18), { month: 1, day: 1 }, "01-31"].forEach(
      //         (input) => {
      //           ["", "CONSTRAIN", "balance", 3, null].forEach((overflow) =>
      //             throws(
      //               () => PlainMonthDay.from(input, { overflow }),
      //               RangeError
      //             )
      //           );
      //         }
      //       );
      //     });
      //     it("constrain has no effect on invalid ISO string", () => {
      //       throws(
      //         () => PlainMonthDay.from("13-34", { overflow: "constrain" }),
      //         RangeError
      //       );
      //     });
      //   });
      //   describe("Leap day", () => {
      //     ["reject", "constrain"].forEach((overflow) =>
      //       it(overflow, () =>
      //         equal(
      //           `${PlainMonthDay.from({ month: 2, day: 29 }, { overflow })}`,
      //           "02-29"
      //         )
      //       )
      //     );
      //     it("rejects when year isn't a leap year", () =>
      //       throws(
      //         () =>
      //           PlainMonthDay.from(
      //             { month: 2, day: 29, year: 2001 },
      //             { overflow: "reject" }
      //           ),
      //         RangeError
      //       ));
      //     it("constrains non-leap year", () =>
      //       equal(
      //         `${PlainMonthDay.from(
      //           { month: 2, day: 29, year: 2001 },
      //           { overflow: "constrain" }
      //         )}`,
      //         "02-28"
      //       ));
      //   });
      //   describe("Leap day with calendar", () => {
      //     it("requires year with calendar", () =>
      //       throws(
      //         () =>
      //           PlainMonthDay.from(
      //             { month: 2, day: 29, calendar: "iso8601" },
      //             { overflow: "reject" }
      //           ),
      //         TypeError
      //       ));
      //     it("rejects leap day with non-leap year", () =>
      //       throws(
      //         () =>
      //           PlainMonthDay.from(
      //             { month: 2, day: 29, year: 2001, calendar: "iso8601" },
      //             { overflow: "reject" }
      //           ),
      //         RangeError
      //       ));
      //     it("constrains leap day", () =>
      //       equal(
      //         `${PlainMonthDay.from(
      //           { month: 2, day: 29, year: 2001, calendar: "iso8601" },
      //           { overflow: "constrain" }
      //         )}`,
      //         "02-28"
      //       ));
      //     it("accepts leap day with monthCode", () =>
      //       equal(
      //         `${PlainMonthDay.from(
      //           { monthCode: "M02", day: 29, calendar: "iso8601" },
      //           { overflow: "reject" }
      //         )}`,
      //         "02-29"
      //       ));
      //   });
      //   it("object must contain at least the required correctly-spelled properties", () => {
      //     throws(() => PlainMonthDay.from({}), TypeError);
      //     throws(() => PlainMonthDay.from({ months: 12, day: 31 }), TypeError);
      //   });
      //   it("incorrectly-spelled properties are ignored", () => {
      //     equal(
      //       `${PlainMonthDay.from({ month: 12, day: 1, days: 31 })}`,
      //       "12-01"
      //     );
      //   });
    });
    describe("getters", () => {
      md = new PlainMonthDay(1, 15);
      it("(1-15).monthCode === '1'", () => {
        expect(md.monthCode).toBe("M01");
      });
      it("(1-15).day === '15'", () => {
        expect(md.day.toString()).toBe("15");
      });
      // it("month is undefined", () => equal(md.month, undefined));
    });
    describe(".with()", () => {
      md = PlainMonthDay.from("01-22");
      // it("with(12-)", () => equal(`${md.with({ monthCode: "M12" })}`, "12-22"));
      it("with(12-)", () => {
        expect(md.with({ month: 12 }).toString()).toBe("12-22");
      });
      it("with(-15)", () => {
        expect(md.with({ day: 15 }).toString()).toBe("01-15");
      });
    });
  });
  describe("MonthDay.with()", () => {
    md = PlainMonthDay.from("01-15");
    it("with({day})", () => {
      expect(md.with({ day: 3 }).toString()).toBe("01-03");
    });
    it("with({month})", () => {
      expect(md.with({ month: 12 }).toString()).toBe("12-15");
    });
    xit("with({monthCode})", () => {});
    // equal(`${md.with({ monthCode: "M12" })}`, "12-15"));
    xit("with({month}) not accepted", () => {
      expect(() => {
        md.with({ month: 12 });
      }).toThrow();
    });
    xit("with({month, monthCode}) accepted", () => {});
    // equal(`${md.with({ month: 12, monthCode: "M12" })}`, "12-15"));
    xit("month and monthCode must agree", () => {
      // throws(() => md.with({ month: 12, monthCode: "M11" }), RangeError);
    });
    xit("with({year, month}) accepted", () => {});
    // equal(`${md.with({ year: 2000, month: 12 })}`, "12-15"));
    xit("throws on bad overflow", () => {
      //   ["", "CONSTRAIN", "balance", 3, null].forEach((overflow) =>
      //     throws(() => md.with({ day: 1 }, { overflow }), RangeError)
      //   );
    });
    xit("throws with calendar property", () => {
      //   throws(() => md.with({ day: 1, calendar: "iso8601" }), TypeError);
    });
    xit("throws with timeZone property", () => {
      //   throws(() => md.with({ day: 1, timeZone: "UTC" }), TypeError);
    });
    // it("options may only be an object or undefined", () => {
    //   [null, 1, "hello", true, Symbol("foo"), 1n].forEach((badOptions) =>
    //     throws(() => md.with({ day: 1 }, badOptions), TypeError)
    //   );
    //   [{}, () => {}, undefined].forEach((options) =>
    //     equal(`${md.with({ day: 1 }, options)}`, "01-01")
    //   );
    // });
    // it("object must contain at least one correctly-spelled property", () => {
    //   throws(() => md.with({}), TypeError);
    //   throws(() => md.with({ months: 12 }), TypeError);
    // });
    // it("incorrectly-spelled properties are ignored", () => {
    //   equal(`${md.with({ monthCode: "M12", days: 1 })}`, "12-15");
    // });
    // it("year is ignored when determining ISO reference year", () => {
    //   equal(
    //     md.with({ year: 1900 }).getISOFields().isoYear,
    //     md.getISOFields().isoYear
    //   );
    // });
  });
  describe("MonthDay.equals()", () => {
    md1 = PlainMonthDay.from("01-22");
    md2 = PlainMonthDay.from("12-15");
    it("equal", () => {
      expect(md1).toBe(md1);
    });
    it("unequal", () => {
      expect(md1).not.toBe(md2);
    });
    xit("casts argument", () => {
      //   assert(md1.equals("01-22"));
      //   assert(md1.equals({ month: 1, day: 22 }));
    });
    // it("object must contain at least the required properties", () => {
    //   throws(() => md1.equals({ month: 1 }), TypeError);
    // });
    xit("takes [[ISOYear]] into account", () => {
      //   const iso = Temporal.Calendar.from("iso8601");
      //   const md1 = new PlainMonthDay(1, 1, iso, 1972);
      //   const md2 = new PlainMonthDay(1, 1, iso, 2000);
      //   assert(!md1.equals(md2));
    });
  });
  //   describe("Comparison operators don't work", () => {
  //     const md1 = PlainMonthDay.from("02-13");
  //     const md1again = PlainMonthDay.from("02-13");
  //     const md2 = PlainMonthDay.from("11-18");
  //     it("=== is object equality", () => equal(md1, md1));
  //     it("!== is object equality", () => notEqual(md1, md1again));
  //     it("<", () => throws(() => md1 < md2));
  //     it(">", () => throws(() => md1 > md2));
  //     it("<=", () => throws(() => md1 <= md2));
  //     it(">=", () => throws(() => md1 >= md2));
  //   });
  describe("MonthDay.toPlainDate()", () => {
    md = PlainMonthDay.from("01-22");
    // it("doesn't take a primitive argument", () => {
    //   [2002, "2002", false, 2002n, Symbol("2002"), null].forEach((bad) => {
    //     throws(() => md.toPlainDate(bad), TypeError);
    //   });
    // });
    it("takes year", () => {
      // it("takes an object argument with year property", () => {
      //   equal(`${md.toPlainDate({ year: 2002 })}`, "2002-01-22");
      expect(md.toPlainDate(2002).toString()).toBe("2002-01-22");
    });
    xit("needs at least a year property on the object in the ISO calendar", () => {
      //   throws(() => md.toPlainDate({ something: "nothing" }), TypeError);
    });
    xit("constrains if the MonthDay doesn't exist in the year", () => {
      //   const leapDay = PlainMonthDay.from("02-29");
      //   equal(`${leapDay.toPlainDate({ year: 2019 })}`, "2019-02-28");
      //   equal(
      //     `${leapDay.toPlainDate({ year: 2019 }, { overflow: "constrain" })}`,
      //     "2019-02-28"
      //   );
    });
  });
  describe("MonthDay.toString()", () => {
    // const md1 = PlainMonthDay.from("11-18");
    // const md2 = PlainMonthDay.from({
    //   monthCode: "M11",
    //   day: 18,
    //   calendar: "gregory",
    // });
    it("new MonthDay(11, 18).toString()", () => {
      expect(new PlainMonthDay(11, 18).toString()).toBe("11-18");
    });
    xit("shows only non-ISO calendar if calendarName = auto", () => {
      //   equal(md1.toString({ calendarName: "auto" }), "11-18");
      //   equal(md2.toString({ calendarName: "auto" }), "1972-11-18[u-ca=gregory]");
    });
    xit("shows ISO calendar if calendarName = always", () => {
      //   equal(md1.toString({ calendarName: "always" }), "11-18[u-ca=iso8601]");
    });
    xit("omits non-ISO calendar, but not year, if calendarName = never", () => {
      //   equal(md1.toString({ calendarName: "never" }), "11-18");
      //   equal(md2.toString({ calendarName: "never" }), "1972-11-18");
    });
    xit("default is calendar = auto", () => {
      //   equal(md1.toString(), "11-18");
      //   equal(md2.toString(), "1972-11-18[u-ca=gregory]");
    });
    // it("throws on invalid calendar", () => {
    //   ["ALWAYS", "sometimes", false, 3, null].forEach((calendarName) => {
    //     throws(() => md1.toString({ calendarName }), RangeError);
    //   });
    // });
  });
  //   describe("monthDay.getISOFields() works", () => {
  //     const md1 = PlainMonthDay.from("11-18");
  //     const fields = md1.getISOFields();
  //     it("fields", () => {
  //       equal(fields.isoMonth, 11);
  //       equal(fields.isoDay, 18);
  //       equal(fields.calendar.id, "iso8601");
  //       equal(typeof fields.isoYear, "number");
  //     });
  //     it("enumerable", () => {
  //       const fields2 = { ...fields };
  //       equal(fields2.isoMonth, 11);
  //       equal(fields2.isoDay, 18);
  //       equal(fields2.calendar, fields.calendar);
  //       equal(typeof fields2.isoYear, "number");
  //     });
  //     it("as input to constructor", () => {
  //       const md2 = new PlainMonthDay(
  //         fields.isoMonth,
  //         fields.isoDay,
  //         fields.calendar,
  //         fields.isoYear
  //       );
  //       assert(md2.equals(md1));
  //     });
  //   });
});
