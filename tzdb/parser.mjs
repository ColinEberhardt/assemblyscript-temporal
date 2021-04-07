const dayNameToNumber = (name) =>
  ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].indexOf(name.toLowerCase()) + 1;

const parseDay = (day) => {
  if (day.match(/^[0-9]+$/)) {
    return {
      type: "day",
      value: parseInt(day),
    };
  }
  if (day.match(/^last[A-Za-z]{3}$/)) {
    return {
      type: "last-day",
      value: dayNameToNumber(day.substr(4)),
    };
  }
  let parts = day.match(/^([A-Za-z]{3})>=([0-9]+)$/);
  if (parts) {
    return {
      type: "next-day-after",
      day: parseInt(parts[2]),
      dayOfWeek: dayNameToNumber(parts[1]),
    };
  }

  return {
    type: "parse-error",
  };
};

const parseTimeZone = (zone) => {
  if (zone == "" || zone == "w") {
    return "wall-clock";
  }
  if (zone == "g" || zone == "u" || zone == "z") {
    return "utc";
  }
  if (zone == "s") {
    return "standard";
  }
};

const parseTime = (time) => {
  const parts = time.match(/([0-9]{1,2}):([0-9]{1,2})([a-z])/);
  const hour = parseInt(parts[1]);
  const minute = parseInt(parts[2]);
  return {
    hour,
    minute,
    totalMinutes: hour * 60 + minute,
    zone: parseTimeZone(parts[3]),
  };
};

const parseOffset = (offset) => {
  let sign = 1;
  if (offset.startsWith("-")) {
    sign = -1;
    offset = offset.substr(1);
  }

  const parts = offset.split(":");
  if (parts.length == 3) {
    return (
      sign *
      (parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]))
    );
  }
  if (parts.length == 2) {
    return sign * (parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60);
  }
  if (parts.length == 1) {
    return sign * parseInt(offset);
  }
};

const parseEndYear = (endYear, startYear) => {
  if (endYear == "only") return startYear;
  if (endYear == "max") return -1;
  return endYear;
};

const monthIndex = (month) =>
  [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ].indexOf(month.toLowerCase()) + 1;

const parseUntil = (until) => {
  const match = until.match(
    /([0-9]{1,4})\s*(\w{3})?\s*([0-9]{1,2})?\s*([0-9]{1,2})?:?([0-9]{1,2})?(u|s)?/
  );
  if (!match) {
    return;
  }
  const untilObj = {
    year: parseInt(match[1]),
    month: monthIndex(match[2] ?? "Jan"),
    day: parseInt(match[3] ?? "1"),
    hour: parseInt(match[4] ?? "00"),
    minute: parseInt(match[5] ?? "00"),
    zone: match[6] ?? "u",
  };
  // TODO - consider utc / standard time offsets
  untilObj.millis = Date.UTC(
    untilObj.year,
    untilObj.month,
    untilObj.day,
    untilObj.hour,
    untilObj.minute
  );
  return untilObj;
};

const parseRule = (line) => {
  const cols = line.split(/[\t ]+/);
  return {
    name: cols[1],
    startYear: parseInt(cols[2]),
    endYear: parseInt(parseEndYear(cols[3], cols[2])),
    inMonth: monthIndex(cols[5]),
    day: parseDay(cols[6]),
    time: parseTime(cols[7]),
    offset: parseOffset(cols[8]),
    letter: cols[9],
    line
  };
};

const parseZone = (line) => {
  const match = line.match(
    /^(Zone)?\s+([a-zA-Z\/]*)?\s+(-?[0-9:]*)\s+([A-Za-z-]*)\s+([A-Z\/]+|%s)\s*(.*)$/
  );
  return {
    standardOffset: parseOffset(match[3]),
    rules: match[4],
    format: match[5],
    until: parseUntil(match[6]),
    line
  };
};

// parse the IANA database
const parserDatabase = (tzDatabase) => {
  const lines = tzDatabase.split("\n");

  const rules = [];
  const zones = [];

  let zone;
  lines.forEach((line) => {
    if (line.startsWith("#")) return;

    if (zone) {
      const nextZone = parseZone(line);
      zone.ruleRefs.push(nextZone);
      if (!nextZone.until) {
        zones.push(zone);
        zone = undefined;
      }
    } else if (line.startsWith("Rule")) {
      rules.push(parseRule(line));
    } else if (line.startsWith("Zone")) {
      const cols = line.split(/[\t ]+/);
      zone = {
        name: cols[1],
        ruleRefs: [parseZone(line)],
      };
    }
  });
  return { zones, rules };
};

export {
  parserDatabase
};

// const offsetForMillis = (millis) => {
//   // TODO: find the zone
//   const zone = zones[0];
//   const ruleRef = zone.ruleRefs.find(
//     (z) => !z.until || z.until.millis > millis
//   );
//   if (ruleRef.rules === "-") {
//     return ruleRef.standardOffset;
//   }

//   const zoneRules = rules.filter((f) => f.name === ruleRef.rules);

//   const dateMillis = new Date(millis);
//   const matchingRules = zoneRules.filter((r) => ruleMatches(r, dateMillis));

//   return matchingRules.length > 0
//     ? matchingRules[matchingRules.length - 1].offset
//     : 0;
// };

// const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

// const ruleMatches = (rule, millis) => {
//   const dateMillis = new Date(millis);
//   if (
//     rule.startYear > dateMillis.getUTCFullYear() ||
//     (rule.endYear !== -1 && rule.endYear < dateMillis.getUTCFullYear())
//   ) {
//     return false;
//   }

//   if (dateMillis.getUTCMonth() + 1 < rule.inMonth) {
//     return false;
//   }

//   if (dateMillis.getUTCMonth() + 1 > rule.inMonth) {
//     return true;
//   }

//   let day = -1;
//   if (rule.day.type === "last-day") {
//     const lastDay = daysInMonth(dateMillis.getUTCFullYear(), rule.inMonth);
//     const lastDayOfWeek =
//       (dateMillis.getDay() + (lastDay - dateMillis.getUTCDate())) % 7;
//     const diff = lastDayOfWeek - rule.day.value;
//     if (diff < 0) diff += 7;
//     day = lastDay - diff;
//   }

//   if (dateMillis.getUTCDate() < day) {
//     return false;
//   }

//   if (dateMillis.getUTCDate() > day) {
//     return true;
//   }

//   return (
//     dateMillis.getUTCHours() * 60 + dateMillis.getUTCMinutes() >
//     rule.time.totalMinutes
//   );
// };
