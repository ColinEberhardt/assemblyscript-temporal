// for the proposal-temporal implementation, most of the business logic
// sits within the ecmascript.mjs file:
//
// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs
//
// here we use the same structure to make it easier to audit this implementation
// to ensure correctess

import { TimeComponent } from "../enums";


// @ts-ignore: decorator
@inline
export function sign<T extends number>(x: T): i32 {
  // optimized variant of x < 0 ? -1 : 1
  // i32: x >> 31 | 1
  // i64: x >> 63 | 1
  // @ts-ignore
  return ((x >> (sizeof<T>() * 8 - 1)) | 1) as i32;
}

// @ts-ignore: decorator
@inline
export function ord<T extends number>(x: T, y: T): i32 {
  return i32(x > y) - i32(x < y);
}

// @ts-ignore: decorator
@inline
export function floorDiv<T extends number>(a: T, b: T): T {
  return (a >= 0 ? a : a - b + 1) / b as T;
}

// @ts-ignore: decorator
@inline
export function nonNegativeModulo<T extends number>(x: T, y: T): T {
  x = x % y as T;
  return (x < 0 ? x + y : x) as T;
}


// https://github.com/tc39/proposal-temporal/blob/49629f785eee61e9f6641452e01e995f846da3a1/polyfill/lib/ecmascript.mjs#L2616
// @ts-ignore: decorator
@inline
export function clamp(value: i32, lo: i32, hi: i32): i32 {
  return min(max(value, lo), hi);
}

// https://github.com/tc39/proposal-temporal/blob/51c6c5138b5b73817f5e0ff2694fe0134f09b0a7/polyfill/lib/ecmascript.mjs#L2704
// @ts-ignore: decorator
@inline
export function checkRange(value: i32, lo: i32, hi: i32): bool {
  return u32(value - lo) <= u32(hi - lo);
}


export function compare<T extends number>(a: Array<T>, b: Array<T>): i32 {
  for (let i = 0; i < a.length; i++) {
    let res = a[i] - b[i];
    if (res) return sign(res);
  }
  return 0;
}

export function arraySign(values: Array<i32>): i32 {
  for (let i = 0; i < values.length; i++) {
    if (values[i]) return sign(values[i]);
  }
  return 0;
}

// @ts-ignore: decorator
@inline
export function toPaddedString(number: i32, length: i32 = 2): string {
  return number.toString().padStart(length, "0");
}

// @ts-ignore: decorator
@inline
// @ts-ignore: default value
export function coalesce<T extends number>(a: T, b: T, nill: T = -1):T {
  return a == nill ? b : a;
}

// returns the larger of two values for ordered enums
export function larger<T>(t1: T, t2: T): T {
  return min(t1, t2) as T
}
