## assemblyscript-temporal

A **very** experimental implementation of temporal within AssemblyScript.

### Why?

AssemblyScript has minimal `Date` support, however, the JS Date API itself is terrible and people tend not to use it that often. As a result libraries like moment / luxon have become staple replacements.

However, there is now a [relatively mature TC39 proposal](https://github.com/tc39/proposal-temporal) that adds greatly improved date support to JS. This projects explores the the feasibility of porting this library.

Note, that string parsing is an important feature of any date library, and as a result, this project relies on the [assemblyscript-regex](https://github.com/ColinEberhardt/assemblyscript-regex) library.

### Implementation approach

The current approach is as follows:

1. Use the temporal polyfill test cases as a means to ensure implementation correctness. Currently these test cases are cut / paste with a few tweaks. Ideally this would be automated to ensure parity going forwards
2. Start simple ... start with `PlainDate`
3. Use the polyfill implementation as a starting point. However, it is riddled with JS-specific code that doesn't make sense to port. However, most of the algorithmic code is [within a single file](https://github.com/tc39/proposal-temporal/blob/main/polyfill/lib/ecmascript.mjs), which can be ported relatively easily.
4. Don't bother refactoring heavily, being able to map between the polyfill implementation and this codebase will help ensure correctness


### Implementation progress

#### PlainDate

PlainDate is currently being implemented based on the ISO 8601 calendar.

Constructor

- [x] new Temporal.PlainDate

Static methods

- [x] from
- [x] compare

Properties

- [x] year
- [x] month
- [x] monthCode
- [x] day
- [ ] calendar
- [ ] era
- [ ] eraYear
- [x] dayOfWeek
- [x] dayOfYear
- [x] weekOfYear
- [x] daysInWeek
- [x] daysInMonth
- [x] daysInYear
- [x] monthsInYear
- [x] inLeapYear

Methods

- [x] with
- [ ] withCalendar
- [x] add
- [x] subtract
- [x] until
- [x] since
- [x] equals
- [x] toString
- [ ] toLocaleString
- [ ] toJSON
- [ ] valueOf
- [ ] toZonedDateTime
- [ ] toPlainDateTime
- [ ] toPlainYearMonth
- [ ] toPlainMonthDay
- [ ] getISOFields

General features

- [ ] overflow modes (current implementation defaults to constrain)
- [ ] non ISO 8601 calendars

#### PlainDateTime

PlainDateTime is currently being implemented based on the ISO 8601 calendar.

Constructor

- [x] new Temporal.PlainDateTime

Static methods

- [x] from
- [x] compare

Properties

- [x] year
- [x] month
- [ ] monthCode
- [x] day
- [x] hour
- [x] minute
- [x] second
- [x] millisecond
- [x] microsecond
- [x] nanosecond
- [ ] calendar
- [ ] era
- [ ] eraYear
- [x] dayOfWeek
- [x] dayOfYear
- [x] weekOfYear
- [x] daysInWeek
- [x] daysInMonth
- [x] daysInYear
- [x] monthsInYear
- [x] inLeapYear

Methods
<<<<<<< HEAD

- [ ] with
- [ ] withCalendar
- [ ] add
- [ ] subtract
- [ ] until
- [ ] since
- [ ] equals
- [x] toString
- [ ] toLocaleString
- [ ] toJSON
- [ ] valueOf
- [ ] toZonedDateTime
- [ ] toPlainDateTime
- [ ] toPlainYearMonth
- [ ] toPlainMonthDay
- [ ] getISOFields
=======
  - [x] with
  - [ ] withCalendar
  - [ ] add
  - [ ] subtract
  - [ ] until
  - [ ] since
  - [ ] equals
  - [x] toString
  - [ ] toLocaleString
  - [ ] toJSON
  - [ ] valueOf
  - [ ] toZonedDateTime
  - [ ] toPlainDateTime
  - [ ] toPlainYearMonth
  - [ ] toPlainMonthDay
  - [ ] getISOFields
>>>>>>> 13234ce... implemented PlainDateTime.from

General features

- [ ] overflow modes (current implementation defaults to constrain)
- [ ] non ISO 8601 calendars

#### Duration

Constructor

- [x] new Duration

static methods

- [ ] from
- [ ] compare

Properties

- [x] years
- [x] months
- [x] weeks
- [x] days
- [x] hours
- [x] minutes
- [x] seconds
- [x] milliseconds
- [x] microseconds
- [x] nanoseconds
- [x] sign
- [ ] blank

Methods

- [ ] with
- [ ] add
- [ ] subtract
- [ ] negated
- [ ] abs
- [ ] round
- [ ] total
- [x] toString
- [ ] toJSON
- [ ] toLocaleString
- [ ] valueOf

General features

- [ ] precision - need to determine what type to use for the properties
