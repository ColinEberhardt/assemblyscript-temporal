import { zones, rules } from "./uk";

export function offsetForTimezone(
  tz: string,
  epochMillis: i64
): i32 {
  const zone = zones.get(tz);
  const offset = zone.getOffset(epochMillis);
  if (offset.ruleRef == "-") {
    return offset.standardOffset;
  }

  return 0;
}
