function componentString(value: i32, suffix: string): string {
  return value != 0 ? value.toString() + suffix : "";
}

function fcomponentString(value: f32, suffix: string): string {
  return value != 0 ? value.toString() + suffix : "";
}

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
    const dayComponent =
      componentString(this.years, "Y") +
      componentString(this.months, "M") +
      componentString(this.days, "D") +
      componentString(this.weeks, "W");
    const timeComponent =
      componentString(this.hours, "H") +
      componentString(this.minutes, "M") +
      fcomponentString(
        f32(this.seconds) +
          f32(this.milliseconds) / 1000.0 +
          f32(this.microseconds) / 1000000.0 +
          f32(this.nanoseconds) / 1000000000.0,
        "S"
      );

    return (
      "P" + dayComponent + (timeComponent != "" ? "T" + timeComponent : "")
    );
  }
}
