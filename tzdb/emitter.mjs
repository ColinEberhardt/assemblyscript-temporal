const emitZoneOffset = (offset) => {
  return `
    // ${offset.line.replace("\t", "    ")}
    new ZoneOffset(${offset.standardOffset}, "${offset.rules}",
        "${offset.format}", ${offset.until ? offset.until.millis : -1})
  `;
};

const emitZone = (zone) => {
  return `
    zones.set("${zone.name}",
      new Zone("${zone.name}", [${zone.ruleRefs.map(emitZoneOffset)}]));
  `;
};

const emitZones = (zones) => {
  return `
    const zones = new Map<string, Zone>();
    ${zones.map(emitZone)};
  `;
};

const emitDay = (day) => {
  if (day.type == "day") {
    return `new DayOfMonth(${day.value})`;
  }
  if (day.type == "next-day-after") {
    return `new NextDayAfter(${day.dayOfWeek}, ${day.day})`;
  }
  if (day.type == "last-day") {
    return `new LastDay(${day.value})`;
  }
};

const emitRule = (rule) => {
  return `
  // ${rule.line.replace("\t", "    ")}
  new Rule("${rule.name}", ${rule.startYear}, ${rule.endYear},
    ${rule.inMonth}, ${emitDay(rule.day)}, ${rule.time.totalMinutes})
`;
};

const emitRules = (rules) => {
  return `
    const rules = [${rules.map(emitRule).join(",")}];
  `;
};

const emit = (tzdb) => {
  return `
  import { Rule, DayOfMonth, NextDayAfter, LastDay } from "./rule";
  import { Zone, ZoneOffset } from "./zone";

  ${emitZones(tzdb.zones)};

  ${emitRules(tzdb.rules)};

  export {
    zones, rules
  };
`;
};

export { emit };
