import isEqual from 'is-equal'
import isRegExp from 'is-regex'
import assert from './assert'
import { isSpy } from './SpyUtils'
import {
  functionThrows,
  isFunction,
  isArray,
  isObject,
  isA,
  arrayContains,
  objectContains,
  stringContains
} from './TestUtils'

/**
 * An Expectation is a wrapper around an assertion that allows it to be written
 * in a more natural style, without the need to remember the order of arguments.
 * This helps prevent you from making mistakes when writing tests.
 */
class Expectation {

  constructor(actual) {
    this.actual = actual

    if (isFunction(actual)) {
      this.context = null
      this.args = []
    }
  }

  toExist(message) {
    assert(
      this.actual,
      (message || 'Expected %s to exist'),
      this.actual
    )

    return this
  }

  toNotExist(message) {
    assert(
      !this.actual,
      (message || 'Expected %s to not exist'),
      this.actual
    )

    return this
  }

  toBe(value, message) {
    assert(
      this.actual === value,
      (message || 'Expected %s to be %s'),
      this.actual,
      value
    )

    return this
  }

  toNotBe(value, message) {
    assert(
      this.actual !== value,
      (message || 'Expected %s to not be %s'),
      this.actual,
      value
    )

    return this
  }

  toEqual(value, message) {
    try {
      assert(
        isEqual(this.actual, value),
        (message || 'Expected %s to equal %s'),
        this.actual,
        value
      )
    } catch (e) {
      // These attributes are consumed by Mocha to produce a diff output.
      e.showDiff = true
      e.actual = this.actual
      e.expected = value
      throw e
    }

    return this
  }

  toNotEqual(value, message) {
    assert(
      !isEqual(this.actual, value),
      (message || 'Expected %s to not equal %s'),
      this.actual,
      value
    )

    return this
  }

  toThrow(value, message) {
    assert(
      isFunction(this.actual),
      'The "actual" argument in expect(actual).toThrow() must be a function, %s was given',
      this.actual
    )

    assert(
      functionThrows(this.actual, this.context, this.args, value),
      (message || 'Expected %s to throw %s'),
      this.actual,
      value || 'an error'
    )

    return this
  }

  toNotThrow(value, message) {
    assert(
      isFunction(this.actual),
      'The "actual" argument in expect(actual).toNotThrow() must be a function, %s was given',
      this.actual
    )

    assert(
      !functionThrows(this.actual, this.context, this.args, value),
      (message || 'Expected %s to not throw %s'),
      this.actual,
      value || 'an error'
    )

    return this
  }

  toBeA(value, message) {
    assert(
      isFunction(value) || typeof value === 'string',
      'The "value" argument in toBeA(value) must be a function or a string'
    )

    assert(
      isA(this.actual, value),
      (message || 'Expected %s to be a %s'),
      this.actual,
      value
    )

    return this
  }

  toNotBeA(value, message) {
    assert(
      isFunction(value) || typeof value === 'string',
      'The "value" argument in toNotBeA(value) must be a function or a string'
    )

    assert(
      !isA(this.actual, value),
      (message || 'Expected %s to be a %s'),
      this.actual,
      value
    )

    return this
  }

  toMatch(pattern, message) {
    assert(
      typeof this.actual === 'string',
      'The "actual" argument in expect(actual).toMatch() must be a string'
    )

    assert(
      isRegExp(pattern),
      'The "value" argument in toMatch(value) must be a RegExp'
    )

    assert(
      pattern.test(this.actual),
      (message || 'Expected %s to match %s'),
      this.actual,
      pattern
    )

    return this
  }

  toNotMatch(pattern, message) {
    assert(
      typeof this.actual === 'string',
      'The "actual" argument in expect(actual).toNotMatch() must be a string'
    )

    assert(
      isRegExp(pattern),
      'The "value" argument in toNotMatch(value) must be a RegExp'
    )

    assert(
      !pattern.test(this.actual),
      (message || 'Expected %s to not match %s'),
      this.actual,
      pattern
    )

    return this
  }

  toBeLessThan(value, message) {
    assert(
      typeof this.actual === 'number',
      'The "actual" argument in expect(actual).toBeLessThan() must be a number'
    )

    assert(
      typeof value === 'number',
      'The "value" argument in toBeLessThan(value) must be a number'
    )

    assert(
      this.actual < value,
      (message || 'Expected %s to be less than %s'),
      this.actual,
      value
    )

    return this
  }

  toBeLessThanOrEqualTo(value, message) {
    assert(
      typeof this.actual === 'number',
      'The "actual" argument in expect(actual).toBeLessThanOrEqualTo() must be a number'
    )

    assert(
      typeof value === 'number',
      'The "value" argument in toBeLessThanOrEqualTo(value) must be a number'
    )

    assert(
      this.actual <= value,
      (message || 'Expected %s to be less than or equal to %s'),
      this.actual,
      value
    )

    return this
  }

  toBeGreaterThan(value, message) {
    assert(
      typeof this.actual === 'number',
      'The "actual" argument in expect(actual).toBeGreaterThan() must be a number'
    )

    assert(
      typeof value === 'number',
      'The "value" argument in toBeGreaterThan(value) must be a number'
    )

    assert(
      this.actual > value,
      (message || 'Expected %s to be greater than %s'),
      this.actual,
      value
    )

    return this
  }

  toBeGreaterThanOrEqualTo(value, message) {
    assert(
      typeof this.actual === 'number',
      'The "actual" argument in expect(actual).toBeGreaterThanOrEqualTo() must be a number'
    )

    assert(
      typeof value === 'number',
      'The "value" argument in toBeGreaterThanOrEqualTo(value) must be a number'
    )

    assert(
      this.actual >= value,
      (message || 'Expected %s to be greater than or equal to %s'),
      this.actual,
      value
    )

    return this
  }

  toInclude(value, compareValues, message) {
    if (typeof compareValues === 'string') {
      message = compareValues
      compareValues = null
    }

    if (compareValues == null)
      compareValues = isEqual

    assert(
      isArray(this.actual) || isObject(this.actual) || typeof this.actual === 'string',
      'The "actual" argument in expect(actual).toInclude() must be an array, object, or a string'
    )

    let contains = false

    if (isArray(this.actual)) {
      contains = arrayContains(this.actual, value, compareValues)
    } else if (isObject(this.actual)) {
      contains = objectContains(this.actual, value, compareValues)
    } else {
      contains = stringContains(this.actual, value)
    }

    assert(
      contains,
      message || 'Expected %s to include %s',
      this.actual,
      value
    )

    return this
  }

  toExclude(value, compareValues, message) {
    if (typeof compareValues === 'string') {
      message = compareValues
      compareValues = null
    }

    if (compareValues == null)
      compareValues = isEqual

    assert(
      isArray(this.actual) || isObject(this.actual) || typeof this.actual === 'string',
      'The "actual" argument in expect(actual).toExclude() must be an array, object, or a string'
    )

    let contains = false

    if (isArray(this.actual)) {
      contains = arrayContains(this.actual, value, compareValues)
    } else if (isObject(this.actual)) {
      contains = objectContains(this.actual, value, compareValues)
    } else {
      contains = stringContains(this.actual, value)
    }

    assert(
      !contains,
      message || 'Expected %s to exclude %s',
      this.actual,
      value
    )

    return this
  }

  toHaveBeenCalled(message) {
    const spy = this.actual

    assert(
      isSpy(spy),
      'The "actual" argument in expect(actual).toHaveBeenCalled() must be a spy'
    )

    assert(
      spy.calls.length > 0,
      (message || 'spy was not called')
    )

    return this
  }

  toHaveBeenCalledWith(...expectedArgs) {
    const spy = this.actual

    assert(
      isSpy(spy),
      'The "actual" argument in expect(actual).toHaveBeenCalledWith() must be a spy'
    )

    assert(
      spy.calls.some(call => isEqual(call.arguments, expectedArgs)),
      'spy was never called with %s',
      expectedArgs
    )

    return this
  }

  toNotHaveBeenCalled(message) {
    const spy = this.actual

    assert(
      isSpy(spy),
      'The "actual" argument in expect(actual).toNotHaveBeenCalled() must be a spy'
    )

    assert(
      spy.calls.length === 0,
      (message || 'spy was not supposed to be called')
    )

    return this
  }

  withContext(context) {
    assert(
      isFunction(this.actual),
      'The "actual" argument in expect(actual).withContext() must be a function'
    )

    this.context = context

    return this
  }

  withArgs(...args) {
    assert(
      isFunction(this.actual),
      'The "actual" argument in expect(actual).withArgs() must be a function'
    )

    if (args.length)
      this.args = this.args.concat(...args)

    return this
  }

}

const aliases = {
  toBeAn: 'toBeA',
  toNotBeAn: 'toNotBeA',
  toBeTruthy: 'toExist',
  toBeFalsy: 'toNotExist',
  toBeFewerThan: 'toBeLessThan',
  toBeMoreThan: 'toBeGreaterThan',
  toContain: 'toInclude',
  toNotContain: 'toExclude'
}

for (const alias in aliases)
  if (aliases.hasOwnProperty(alias))
    Expectation.prototype[alias] = Expectation.prototype[aliases[alias]]

export default Expectation
