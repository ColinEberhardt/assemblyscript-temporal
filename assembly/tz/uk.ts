import { Rule, DayOfMonth, NextDayAfter, LastDay } from "./rule";
import { Zone, ZoneOffset } from "./zone";

const zones = new Map<string, Zone>();

zones.set(
  "Europe/London",
  new Zone("Europe/London", [
    // Zone    Europe/London	-0:01:15 -	LMT	1847 Dec  1  0:00s
    new ZoneOffset(-75, "-", "LMT", -3849984000000),
    //     		 0:00	GB-Eire	%s	1968 Oct 27
    new ZoneOffset(0, "GB-Eire", "%s", -34560000000),
    //     		 1:00	-	BST	1971 Oct 31  2:00u
    new ZoneOffset(3600, "-", "BST", 60400800000),
    //     		 0:00	GB-Eire	%s	1996
    new ZoneOffset(0, "GB-Eire", "%s", 823132800000),
    //     		 0:00	EU	GMT/BST
    new ZoneOffset(0, "EU", "GMT/BST", -1),
  ])
);
const rules = [
  // Rule    GB-Eire	1916	only	-	May	21	2:00s	1:00	BST
  new Rule("GB-Eire", 1916, 1916, 5, new DayOfMonth(21), 120),
  // Rule    GB-Eire	1916	only	-	Oct	 1	2:00s	0	GMT
  new Rule("GB-Eire", 1916, 1916, 10, new DayOfMonth(1), 120),
  // Rule    GB-Eire	1917	only	-	Apr	 8	2:00s	1:00	BST
  new Rule("GB-Eire", 1917, 1917, 4, new DayOfMonth(8), 120),
  // Rule    GB-Eire	1917	only	-	Sep	17	2:00s	0	GMT
  new Rule("GB-Eire", 1917, 1917, 9, new DayOfMonth(17), 120),
  // Rule    GB-Eire	1918	only	-	Mar	24	2:00s	1:00	BST
  new Rule("GB-Eire", 1918, 1918, 3, new DayOfMonth(24), 120),
  // Rule    GB-Eire	1918	only	-	Sep	30	2:00s	0	GMT
  new Rule("GB-Eire", 1918, 1918, 9, new DayOfMonth(30), 120),
  // Rule    GB-Eire	1919	only	-	Mar	30	2:00s	1:00	BST
  new Rule("GB-Eire", 1919, 1919, 3, new DayOfMonth(30), 120),
  // Rule    GB-Eire	1919	only	-	Sep	29	2:00s	0	GMT
  new Rule("GB-Eire", 1919, 1919, 9, new DayOfMonth(29), 120),
  // Rule    GB-Eire	1920	only	-	Mar	28	2:00s	1:00	BST
  new Rule("GB-Eire", 1920, 1920, 3, new DayOfMonth(28), 120),
  // Rule    GB-Eire	1920	only	-	Oct	25	2:00s	0	GMT
  new Rule("GB-Eire", 1920, 1920, 10, new DayOfMonth(25), 120),
  // Rule    GB-Eire	1921	only	-	Apr	 3	2:00s	1:00	BST
  new Rule("GB-Eire", 1921, 1921, 4, new DayOfMonth(3), 120),
  // Rule    GB-Eire	1921	only	-	Oct	 3	2:00s	0	GMT
  new Rule("GB-Eire", 1921, 1921, 10, new DayOfMonth(3), 120),
  // Rule    GB-Eire	1922	only	-	Mar	26	2:00s	1:00	BST
  new Rule("GB-Eire", 1922, 1922, 3, new DayOfMonth(26), 120),
  // Rule    GB-Eire	1922	only	-	Oct	 8	2:00s	0	GMT
  new Rule("GB-Eire", 1922, 1922, 10, new DayOfMonth(8), 120),
  // Rule    GB-Eire	1923	only	-	Apr	Sun>=16	2:00s	1:00	BST
  new Rule("GB-Eire", 1923, 1923, 4, new NextDayAfter(7, 16), 120),
  // Rule    GB-Eire	1923	1924	-	Sep	Sun>=16	2:00s	0	GMT
  new Rule("GB-Eire", 1923, 1924, 9, new NextDayAfter(7, 16), 120),
  // Rule    GB-Eire	1924	only	-	Apr	Sun>=9	2:00s	1:00	BST
  new Rule("GB-Eire", 1924, 1924, 4, new NextDayAfter(7, 9), 120),
  // Rule    GB-Eire	1925	1926	-	Apr	Sun>=16	2:00s	1:00	BST
  new Rule("GB-Eire", 1925, 1926, 4, new NextDayAfter(7, 16), 120),
  // Rule    GB-Eire	1925	1938	-	Oct	Sun>=2	2:00s	0	GMT
  new Rule("GB-Eire", 1925, 1938, 10, new NextDayAfter(7, 2), 120),
  // Rule    GB-Eire	1927	only	-	Apr	Sun>=9	2:00s	1:00	BST
  new Rule("GB-Eire", 1927, 1927, 4, new NextDayAfter(7, 9), 120),
  // Rule    GB-Eire	1928	1929	-	Apr	Sun>=16	2:00s	1:00	BST
  new Rule("GB-Eire", 1928, 1929, 4, new NextDayAfter(7, 16), 120),
  // Rule    GB-Eire	1930	only	-	Apr	Sun>=9	2:00s	1:00	BST
  new Rule("GB-Eire", 1930, 1930, 4, new NextDayAfter(7, 9), 120),
  // Rule    GB-Eire	1931	1932	-	Apr	Sun>=16	2:00s	1:00	BST
  new Rule("GB-Eire", 1931, 1932, 4, new NextDayAfter(7, 16), 120),
  // Rule    GB-Eire	1933	only	-	Apr	Sun>=9	2:00s	1:00	BST
  new Rule("GB-Eire", 1933, 1933, 4, new NextDayAfter(7, 9), 120),
  // Rule    GB-Eire	1934	only	-	Apr	Sun>=16	2:00s	1:00	BST
  new Rule("GB-Eire", 1934, 1934, 4, new NextDayAfter(7, 16), 120),
  // Rule    GB-Eire	1935	only	-	Apr	Sun>=9	2:00s	1:00	BST
  new Rule("GB-Eire", 1935, 1935, 4, new NextDayAfter(7, 9), 120),
  // Rule    GB-Eire	1936	1937	-	Apr	Sun>=16	2:00s	1:00	BST
  new Rule("GB-Eire", 1936, 1937, 4, new NextDayAfter(7, 16), 120),
  // Rule    GB-Eire	1938	only	-	Apr	Sun>=9	2:00s	1:00	BST
  new Rule("GB-Eire", 1938, 1938, 4, new NextDayAfter(7, 9), 120),
  // Rule    GB-Eire	1939	only	-	Apr	Sun>=16	2:00s	1:00	BST
  new Rule("GB-Eire", 1939, 1939, 4, new NextDayAfter(7, 16), 120),
  // Rule    GB-Eire	1939	only	-	Nov	Sun>=16	2:00s	0	GMT
  new Rule("GB-Eire", 1939, 1939, 11, new NextDayAfter(7, 16), 120),
  // Rule    GB-Eire	1940	only	-	Feb	Sun>=23	2:00s	1:00	BST
  new Rule("GB-Eire", 1940, 1940, 2, new NextDayAfter(7, 23), 120),
  // Rule    GB-Eire	1941	only	-	May	Sun>=2	1:00s	2:00	BDST
  new Rule("GB-Eire", 1941, 1941, 5, new NextDayAfter(7, 2), 60),
  // Rule    GB-Eire	1941	1943	-	Aug	Sun>=9	1:00s	1:00	BST
  new Rule("GB-Eire", 1941, 1943, 8, new NextDayAfter(7, 9), 60),
  // Rule    GB-Eire	1942	1944	-	Apr	Sun>=2	1:00s	2:00	BDST
  new Rule("GB-Eire", 1942, 1944, 4, new NextDayAfter(7, 2), 60),
  // Rule    GB-Eire	1944	only	-	Sep	Sun>=16	1:00s	1:00	BST
  new Rule("GB-Eire", 1944, 1944, 9, new NextDayAfter(7, 16), 60),
  // Rule    GB-Eire	1945	only	-	Apr	Mon>=2	1:00s	2:00	BDST
  new Rule("GB-Eire", 1945, 1945, 4, new NextDayAfter(1, 2), 60),
  // Rule    GB-Eire	1945	only	-	Jul	Sun>=9	1:00s	1:00	BST
  new Rule("GB-Eire", 1945, 1945, 7, new NextDayAfter(7, 9), 60),
  // Rule    GB-Eire	1945	1946	-	Oct	Sun>=2	2:00s	0	GMT
  new Rule("GB-Eire", 1945, 1946, 10, new NextDayAfter(7, 2), 120),
  // Rule    GB-Eire	1946	only	-	Apr	Sun>=9	2:00s	1:00	BST
  new Rule("GB-Eire", 1946, 1946, 4, new NextDayAfter(7, 9), 120),
  // Rule    GB-Eire	1947	only	-	Mar	16	2:00s	1:00	BST
  new Rule("GB-Eire", 1947, 1947, 3, new DayOfMonth(16), 120),
  // Rule    GB-Eire	1947	only	-	Apr	13	1:00s	2:00	BDST
  new Rule("GB-Eire", 1947, 1947, 4, new DayOfMonth(13), 60),
  // Rule    GB-Eire	1947	only	-	Aug	10	1:00s	1:00	BST
  new Rule("GB-Eire", 1947, 1947, 8, new DayOfMonth(10), 60),
  // Rule    GB-Eire	1947	only	-	Nov	 2	2:00s	0	GMT
  new Rule("GB-Eire", 1947, 1947, 11, new DayOfMonth(2), 120),
  // Rule    GB-Eire	1948	only	-	Mar	14	2:00s	1:00	BST
  new Rule("GB-Eire", 1948, 1948, 3, new DayOfMonth(14), 120),
  // Rule    GB-Eire	1948	only	-	Oct	31	2:00s	0	GMT
  new Rule("GB-Eire", 1948, 1948, 10, new DayOfMonth(31), 120),
  // Rule    GB-Eire	1949	only	-	Apr	 3	2:00s	1:00	BST
  new Rule("GB-Eire", 1949, 1949, 4, new DayOfMonth(3), 120),
  // Rule    GB-Eire	1949	only	-	Oct	30	2:00s	0	GMT
  new Rule("GB-Eire", 1949, 1949, 10, new DayOfMonth(30), 120),
  // Rule    GB-Eire	1950	1952	-	Apr	Sun>=14	2:00s	1:00	BST
  new Rule("GB-Eire", 1950, 1952, 4, new NextDayAfter(7, 14), 120),
  // Rule    GB-Eire	1950	1952	-	Oct	Sun>=21	2:00s	0	GMT
  new Rule("GB-Eire", 1950, 1952, 10, new NextDayAfter(7, 21), 120),
  // Rule    GB-Eire	1953	only	-	Apr	Sun>=16	2:00s	1:00	BST
  new Rule("GB-Eire", 1953, 1953, 4, new NextDayAfter(7, 16), 120),
  // Rule    GB-Eire	1953	1960	-	Oct	Sun>=2	2:00s	0	GMT
  new Rule("GB-Eire", 1953, 1960, 10, new NextDayAfter(7, 2), 120),
  // Rule    GB-Eire	1954	only	-	Apr	Sun>=9	2:00s	1:00	BST
  new Rule("GB-Eire", 1954, 1954, 4, new NextDayAfter(7, 9), 120),
  // Rule    GB-Eire	1955	1956	-	Apr	Sun>=16	2:00s	1:00	BST
  new Rule("GB-Eire", 1955, 1956, 4, new NextDayAfter(7, 16), 120),
  // Rule    GB-Eire	1957	only	-	Apr	Sun>=9	2:00s	1:00	BST
  new Rule("GB-Eire", 1957, 1957, 4, new NextDayAfter(7, 9), 120),
  // Rule    GB-Eire	1958	1959	-	Apr	Sun>=16	2:00s	1:00	BST
  new Rule("GB-Eire", 1958, 1959, 4, new NextDayAfter(7, 16), 120),
  // Rule    GB-Eire	1960	only	-	Apr	Sun>=9	2:00s	1:00	BST
  new Rule("GB-Eire", 1960, 1960, 4, new NextDayAfter(7, 9), 120),
  // Rule    GB-Eire	1961	1963	-	Mar	lastSun	2:00s	1:00	BST
  new Rule("GB-Eire", 1961, 1963, 3, new LastDay(7), 120),
  // Rule    GB-Eire	1961	1968	-	Oct	Sun>=23	2:00s	0	GMT
  new Rule("GB-Eire", 1961, 1968, 10, new NextDayAfter(7, 23), 120),
  // Rule    GB-Eire	1964	1967	-	Mar	Sun>=19	2:00s	1:00	BST
  new Rule("GB-Eire", 1964, 1967, 3, new NextDayAfter(7, 19), 120),
  // Rule    GB-Eire	1968	only	-	Feb	18	2:00s	1:00	BST
  new Rule("GB-Eire", 1968, 1968, 2, new DayOfMonth(18), 120),
  // Rule    GB-Eire	1972	1980	-	Mar	Sun>=16	2:00s	1:00	BST
  new Rule("GB-Eire", 1972, 1980, 3, new NextDayAfter(7, 16), 120),
  // Rule    GB-Eire	1972	1980	-	Oct	Sun>=23	2:00s	0	GMT
  new Rule("GB-Eire", 1972, 1980, 10, new NextDayAfter(7, 23), 120),
  // Rule    GB-Eire	1981	1995	-	Mar	lastSun	1:00u	1:00	BST
  new Rule("GB-Eire", 1981, 1995, 3, new LastDay(7), 60),
  // Rule    GB-Eire 1981	1989	-	Oct	Sun>=23	1:00u	0	GMT
  new Rule("GB-Eire", 1981, 1989, 10, new NextDayAfter(7, 23), 60),
  // Rule    GB-Eire 1990	1995	-	Oct	Sun>=22	1:00u	0	GMT
  new Rule("GB-Eire", 1990, 1995, 10, new NextDayAfter(7, 22), 60),
  // Rule    EU	1977	1980	-	Apr	Sun>=1	 1:00u	1:00	S
  new Rule("EU", 1977, 1980, 4, new NextDayAfter(7, 1), 60),
  // Rule    EU	1977	only	-	Sep	lastSun	 1:00u	0	-
  new Rule("EU", 1977, 1977, 9, new LastDay(7), 60),
  // Rule    EU	1978	only	-	Oct	 1	 1:00u	0	-
  new Rule("EU", 1978, 1978, 10, new DayOfMonth(1), 60),
  // Rule    EU	1979	1995	-	Sep	lastSun	 1:00u	0	-
  new Rule("EU", 1979, 1995, 9, new LastDay(7), 60),
  // Rule    EU	1981	max	-	Mar	lastSun	 1:00u	1:00	S
  new Rule("EU", 1981, -1, 3, new LastDay(7), 60),
  // Rule    EU	1996	max	-	Oct	lastSun	 1:00u	0	-
  new Rule("EU", 1996, -1, 10, new LastDay(7), 60),
];
export { zones, rules };
