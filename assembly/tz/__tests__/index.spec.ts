import { JsDate } from "../../date";
import { offsetForTimezone } from "../index";

describe("offsetForTimezone", () => {
  it("returns standard offset when no rule refs present", () => {
    // UK times pre 1847 always have a -75 sec offset applied
    expect(
      offsetForTimezone(
        "Europe/London",
        JsDate.fromString("1830-3-1").epochMilliseconds
      )
    ).toBe(-75);
  });
});
