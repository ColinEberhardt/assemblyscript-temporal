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


The current AssemnblyScript PlainDate implementation passes 54 of the 241 tests, which is not a bad start!

*If you have thoughts / ideas on the implementation technique, please open an issue*

### Current challenges and open questions ...

1. Oveloaded functions

The temporal API makes extensive use of function overloading, e.g. [PlainDate.From](https://github.com/tc39/proposal-temporal/blob/main/polyfill/index.d.ts#L807):

~~~
date = Temporal.PlainDate.from('2006-08-24'); 
date = Temporal.PlainDate.from({year: 2006, month: 8, day: 24}); 
date = Temporal.PlainDate.from(Temporal.PlainDateTime.from('2006-08-24T15:43:27'));
~~~

AssemblyScript doesn't support [union types](https://www.assemblyscript.org/basics.html#no-union-types). What is the best way to support this API?

Perhaps ...

~~~
date = Temporal.PlainDate.fromString('2006-08-24'); 
date = Temporal.PlainDate.fromDateLike({year: 2006, month: 8, day: 24}); 
date = Temporal.PlainDate.fromPlainDate(Temporal.PlainDateTime.from('2006-08-24T15:43:27'));
~~~

2. DateLike / DurationLike

The API makes extensive use of object literals with optional properties, e.g.

~~~
date.add({ years: 20, months: 4 })
~~~

As defined by the types such as [DurationLike](https://github.com/tc39/proposal-temporal/blob/main/polyfill/index.d.ts#L460).

AssemblyScript doesn't support object literals. What is the best way to support this API?


*If you have thoughts / ideas on the above, please open an issue*
