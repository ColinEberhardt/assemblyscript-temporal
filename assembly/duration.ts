export class Duration {
  constructor(
    public years: i32 = 0,
    public months: i32 = 0,
    public weeks: i32 = 0,
    public days: i32 = 0,
    public hours: i32 = 0,
    public minutes: i32 = 0,
    public seconds: i32 = 0,
    public milliseconds: i32 = 0,
    public microseconds: i32 = 0,
    public nanoseconds: i32 = 0
  ) {}

  // P1Y1M1DT1H1M1.1S
  toString(): string {
    const data = (
      toString(this.years,  "Y") +
      toString(this.months, "M") +
      toString(this.days,   "D") +
      toString(this.weeks,  "W")
    );

    const time = (
      toString(this.hours,   "H") +
      toString(this.minutes, "M") +
      toString(
        // sort in ascending order for better sum precision
        f64(this.nanoseconds)  / 1000000000.0 +
        f64(this.microseconds) / 1000000.0 +
        f64(this.milliseconds) / 1000.0 +
        f64(this.seconds),
        "S"
      )
    );

    return "P" + data + (time.length ? "T" + time : "");
  }
}

function toString<T extends number>(value: T, suffix: string): string {
  return value ? value.toString() + suffix : "";
}
