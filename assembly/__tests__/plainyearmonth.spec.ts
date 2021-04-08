/// <reference types="@as-pect/assembly/types/as-pect" />

import { Duration, DurationLike } from "../duration";
import { Overflow } from "../enums";
import { PlainDate } from "../plaindate";
import { PlainDateTime } from "../plaindatetime";
import { PlainYearMonth, YearMonthLike } from "../plainyearmonth";

let ym: PlainYearMonth,
  orig: PlainYearMonth,
  actu: PlainYearMonth,
  plainDate1: PlainYearMonth,
  plainDate2: PlainYearMonth,
  one: PlainYearMonth,
  two: PlainYearMonth;

describe("YearMonth", () => {
  describe("Construction", () => {
    ym = new PlainYearMonth(1976, 11);
    // it("YearMonth can be constructed", () => {
    //   assert(ym);
    //   expect(typeof ym, "object");
    // });
    it("ym.year is 1976", () => {
      expect(ym.year).toBe(1976);
    });
    it("ym.month is 11", () => {
      expect(ym.month).toBe(11);
    });
    xit('ym.monthCode is "M11"', () => {
      //   expect(ym.monthCode, "M11");
    });
    it("ym.daysInMonth is 30", () => {
      expect(ym.daysInMonth).toBe(30);
    });
    it("ym.daysInYear is 366", () => {
      expect(ym.daysInYear).toBe(366);
    });
    it("ym.monthsInYear is 12", () => {
      expect(ym.monthsInYear).toBe(12);
    });
    describe(".from()", () => {
      it("YearMonth.from(2019-10) == 2019-10", () => {
        expect(PlainYearMonth.from("2019-10").toString()).toBe("2019-10");
      });
      it("YearMonth.from(2019-10-01T09:00:00Z) == 2019-10", () => {
        expect(PlainYearMonth.from("2019-10-01T09:00:00Z").toString()).toBe(
          "2019-10"
        );
      });
      it("YearMonth.from('1976-11') == (1976-11)", () => {
        expect(PlainYearMonth.from("1976-11").toString()).toBe("1976-11");
      });
      it("YearMonth.from('1976-11-18') == (1976-11)", () => {
        expect(PlainYearMonth.from("1976-11-18").toString()).toBe("1976-11");
      });
      xit("can be constructed with monthCode and without month", () => {
        // expect(
        //   PlainYearMonth.from({ year: 2019, monthCode: "M11" }).toString()
        // ).toBe("2019-11");
      });
      it("can be constructed with month and without monthCode", () => {
        expect(PlainYearMonth.from({ year: 2019, month: 11 }).toString()).toBe(
          "2019-11"
        );
      });
      xit("month and monthCode must agree", () =>
        // expect(() => {
        //   PlainYearMonth.from({ year: 2019, month: 11, monthCode: "M12" });
        // }).toThrow()
        {});
      it("ignores day when determining the ISO reference day from year/month", () => {
        // const one = PlainYearMonth.from({ year: 2019, month: 11, day: 1 });
        // const two = PlainYearMonth.from({ year: 2019, month: 11, day: 2 });
        // expect(one.getISOFields().isoDay).toBe(two.getISOFields().isoDay);
      });
      xit("ignores day when determining the ISO reference day from year/monthCode", () => {
        // const one = PlainYearMonth.from({
        //   year: 2019,
        //   monthCode: "M11",
        //   day: 1,
        // });
        // const two = PlainYearMonth.from({
        //   year: 2019,
        //   monthCode: "M11",
        //   day: 2,
        // });
        // expect(one.getISOFields().isoDay, two.getISOFields().isoDay);
      });
      xit("ignores day when determining the ISO reference day from era/eraYear/month", () => {
        // const one = PlainYearMonth.from({
        //   era: "ce",
        //   eraYear: 2019,
        //   month: 11,
        //   day: 1,
        //   calendar: "gregory",
        // });
        // const two = PlainYearMonth.from({
        //   era: "ce",
        //   eraYear: 2019,
        //   month: 11,
        //   day: 2,
        //   calendar: "gregory",
        // });
        // expect(one.getISOFields().isoDay, two.getISOFields().isoDay);
      });
      xit("ignores day when determining the ISO reference day from era/eraYear/monthCode", () => {
        // const one = PlainYearMonth.from({
        //   era: "ce",
        //   eraYear: 2019,
        //   monthCode: "M11",
        //   day: 1,
        //   calendar: "gregory",
        // });
        // const two = PlainYearMonth.from({
        //   era: "ce",
        //   eraYear: 2019,
        //   monthCode: "M11",
        //   day: 2,
        //   calendar: "gregory",
        // });
        // expect(one.getISOFields().isoDay, two.getISOFields().isoDay);
      });
      xit("YearMonth.from(2019-11) is not the same object", () => {
        orig = new PlainYearMonth(2019, 11);
        actu = PlainYearMonth.from(orig);
        expect(actu).not.toBe(orig);
      });
      xit("ignores day when determining the ISO reference day from other Temporal object", () => {
        // plainDate1 = PlainDate.from("1976-11-01");
        // plainDate2 = PlainDate.from("1976-11-18");
        // one = PlainYearMonth.from(plainDate1);
        // two = PlainYearMonth.from(plainDate2);
        // expect(one.getISOFields().isoDay, two.getISOFields().isoDay);
      });
      it("YearMonth.from({ year: 2019 }) throws", () => {
        expect(() => {
          PlainYearMonth.from({ year: 2019 });
        }).toThrow();
      });
      it("YearMonth.from({ month: 6 }) throws", () => {
        expect(() => {
          PlainYearMonth.from({ month: 6 });
        }).toThrow();
      });
      xit('YearMonth.from({ monthCode: "M06" }) throws', () => {
        // expect(() => PlainYearMonth.from({ monthCode: "M06" })).toThrow();
      });
      it("YearMonth.from({}) throws", () => {
        expect(() => {
          PlainYearMonth.from({});
        });
      });
      //   it("YearMonth.from(required prop undefined) throws", () => {
      //     expect(() => {
      //       PlainYearMonth.from({ year: null, month: 6 });
      //     }).toThrows();
      //   });
      xit("YearMonth.from(number) is converted to string", () =>
        // assert(
        //   PlainYearMonth.from(201906).expects(PlainYearMonth.from("201906"))
        // )
        {});
      it("basic format", () => {
        expect(PlainYearMonth.from("197611").toString()).toBe("1976-11");
        expect(PlainYearMonth.from("+00197611").toString()).toBe("1976-11");
      });
      it("variant minus sign", () => {
        expect(PlainYearMonth.from("\u2212009999-11").toString()).toBe(
          "-009999-11"
        );
        expect(
          PlainYearMonth.from("1976-11-18T15:23:30.1\u221202:00").toString()
        ).toBe("1976-11");
      });
      it("mixture of basic and extended format", () => {
        expect(
          PlainYearMonth.from("1976-11-18T152330.1+00:00").toString()
        ).toBe("1976-11");
        expect(
          PlainYearMonth.from("19761118T15:23:30.1+00:00").toString()
        ).toBe("1976-11");
        expect(
          PlainYearMonth.from("1976-11-18T15:23:30.1+0000").toString()
        ).toBe("1976-11");
        expect(PlainYearMonth.from("1976-11-18T152330.1+0000").toString()).toBe(
          "1976-11"
        );
        expect(PlainYearMonth.from("19761118T15:23:30.1+0000").toString()).toBe(
          "1976-11"
        );
        expect(PlainYearMonth.from("19761118T152330.1+00:00").toString()).toBe(
          "1976-11"
        );
        expect(PlainYearMonth.from("19761118T152330.1+0000").toString()).toBe(
          "1976-11"
        );
        expect(
          PlainYearMonth.from("+001976-11-18T152330.1+00:00").toString()
        ).toBe("1976-11");
        expect(
          PlainYearMonth.from("+0019761118T15:23:30.1+00:00").toString()
        ).toBe("1976-11");
        expect(
          PlainYearMonth.from("+001976-11-18T15:23:30.1+0000").toString()
        ).toBe("1976-11");
        expect(
          PlainYearMonth.from("+001976-11-18T152330.1+0000").toString()
        ).toBe("1976-11");
        expect(
          PlainYearMonth.from("+0019761118T15:23:30.1+0000").toString()
        ).toBe("1976-11");
        expect(
          PlainYearMonth.from("+0019761118T152330.1+00:00").toString()
        ).toBe("1976-11");
        expect(
          PlainYearMonth.from("+0019761118T152330.1+0000").toString()
        ).toBe("1976-11");
      });
      it("optional components", () => {
        expect(PlainYearMonth.from("1976-11-18T15:23").toString()).toBe(
          "1976-11"
        );
        expect(PlainYearMonth.from("1976-11-18T15").toString()).toBe("1976-11");
        expect(PlainYearMonth.from("1976-11-18").toString()).toBe("1976-11");
      });
      it("ignores day when determining the ISO reference day from string", () => {
        one = PlainYearMonth.from("1976-11-01");
        two = PlainYearMonth.from("1976-11-18");
        expect(one.referenceISODay).toBe(two.referenceISODay);
      });
      it("no junk at end of string", () => {
        expect(() => {
          PlainYearMonth.from("1976-11junk");
        }).toThrow();
      });
      //   it("options may only be an object or undefined", () => {
      //     [null, 1, "hello", true, Symbol("foo"), 1n].forEach((badOptions) =>
      //       expect(
      //         () => PlainYearMonth.from({ year: 1976, month: 11 }, badOptions),
      //         TypeError
      //       )
      //     );
      //     [{}, () => {}, undefined].forEach((options) =>
      //       expect(
      //         PlainYearMonth.from({ year: 1976, month: 11 }, options).toString()
      //       ).toBe("1976-11")
      //     );
      //   });
      describe("Overflow", () => {
        // const bad = { year: 2019, month: 13 };
        xit("reject", () =>
          //   expect(
          //     () => PlainYearMonth.from(bad, { overflow: "reject" }),
          //     RangeError
          //   )
          {});
        xit("constrain", () => {
          //   expect(PlainYearMonth.from(bad).toString()).toBe("2019-12");
          //   expect(
          //     PlainYearMonth.from(bad, Overflow.Constrain).toString()
          //   ).toBe("2019-12");
        });
        xit("throw on bad overflow", () => {
          //   [
          //     new PlainYearMonth(2019, 1),
          //     { year: 2019, month: 1 },
          //     "2019-01",
          //   ].forEach((input) => {
          //     ["", "CONSTRAIN", "balance", 3, null].forEach((overflow) =>
          //       expect(() => PlainYearMonth.from(input, { overflow }), RangeError)
          //     );
          //   });
        });
        xit("constrain has no effect on invalid ISO string", () => {
          //   expect(
          //     () => PlainYearMonth.from("2020-13", { overflow: "constrain" }),
          //     RangeError
          //   );
        });
      });
      //   it("object must contain at least the required correctly-spelled properties", () => {
      //     expect(() => PlainYearMonth.from({}), TypeError);
      //     expect(
      //       () => PlainYearMonth.from({ year: 1976, months: 11 }),
      //       TypeError
      //     );
      //   });
    //   it("incorrectly-spelled properties are ignored", () => {
    //     expect(
    //       PlainYearMonth.from({ year: 1976, month: 11, months: 12 }).toString()
    //     ).toBe("1976-11");
    //   });
    });
    describe(".with()", () => {
      ym = PlainYearMonth.from("2019-10");
      it("with(2020)", () => {
        expect(ym.with({ year: 2020 }).toString()).toBe("2020-10");
      });
      it("with(09)", () => {
        expect(ym.with({ month: 9 }).toString()).toBe("2019-09");
      });
      xit("with(monthCode)", () => {
        // expect(ym.with({ monthCode: "M09" }).toString()).toBe("2019-09");
      });
      xit("month and monthCode must agree", () => {
        // expect(() => {
        //   ym.with({ month: 9, monthCode: "M10" });
        // }).toThrow();
      });
    });
  });
});
