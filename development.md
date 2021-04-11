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

- [x] overflow modes (current implementation defaults to constrain)
- [ ] non ISO 8601 calendars

#### PlainTime

PlainTime is currently being implemented based on the ISO 8601 calendar.

Constructor

- [x] new PlainTime

Static methods

- [x] from
- [x] compare

Properties

- [x] hour
- [x] minute
- [x] second
- [x] millisecond
- [x] microsecond
- [x] nanosecond
- [ ] calendar

Methods

- [x] with
- [x] add
- [x] subtract
- [x] until
- [x] since
- [ ] round
- [x] equals
- [x] toString
- [ ] toLocaleString
- [ ] toJSON
- [ ] valueOf
- [ ] toZonedDateTime
- [x] toPlainDateTime
- [ ] getISOFields

General features

- [x] overflow modes (current implementation defaults to constrain)
- [ ] non ISO 8601 calendars

#### PlainMonthDay

PlainMonthDay is currently being implemented based on the ISO 8601 calendar.

Constructor

- [x] new PlainMonthDay

Static methods

- [x] from

Properties

- [x] monthCode
- [x] day
- [ ] calendar

Methods

- [x] with
- [x] equals
- [x] toString
- [ ] toLocaleString
- [ ] toJSON
- [ ] valueOf
- [x] toPlainDate
- [ ] getISOFields

#### PlainYearMonth

PlainYearMonth is currently being implemented based on the ISO 8601 calendar.

Constructor

- [x] new Temporal.PlainYearMonth

Static methods

- [x] from
- [x] compare

Properties

- [x] year
- [x] month
- [x] monthCode
- [ ] calendar
- [ ] era
- [ ] eraYear
- [x] daysInMonth
- [x] daysInYear
- [x] monthsInYear
- [x] inLeapYear

Methods

- [x] with
- [x] add
- [x] subtract
- [x] until
- [x] since
- [x] equals
- [x] toString
- [ ] toLocaleString
- [ ] toJSON
- [ ] valueOf
- [x] toPlainDate
- [ ] getISOFields

General features

- [x] overflow modes (current implementation defaults to constrain)
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

- [x] with
- [ ] withCalendar
- [x] add
- [x] subtract
- [ ] until
- [ ] since
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

- [x] overflow modes (current implementation defaults to constrain)
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
