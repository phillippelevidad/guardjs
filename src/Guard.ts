import { GuardError } from "./GuardError";

export class Guard {
  private _isOptional = false;

  constructor(public value: any, public parameterName = "value") {
    if (value === undefined) this.value = null;
  }

  /**
   * Ensures that the value is a valid JavaScript number.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  array(message?: string): Guard {
    return this.ensure(
      (value) => Array.isArray(value),
      message ?? `${this.parameterName} '${this.value} must be a number.`
    );
  }

  /**
   * Coerces the guarded value into a Boolean value, guaranteed to be either true or false.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  coerceToBoolean(): Guard {
    return guard(!!this.value, this.parameterName);
  }

  /**
   * Provides a default value, in case the original is null or undefined.
   * @param defaultValue The default value to be used in case the original is missing.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  defaultTo(defaultValue: any): Guard {
    if (!this.hasValue()) return guard(defaultValue, this.parameterName);
    return this;
  }

  /**
   * If the guarded value is not null nor undefined, runs it through the provided callback function.
   * This is similar to @see transform, but it does not change the value and it does not expect a return value.
   * @param fn The callback function, which receives the guarded value and is allowed to operate on it.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  do(fn: (value: any) => void): Guard {
    if (this.hasValue()) fn(this.value);
    return this;
  }

  /**
   * Steps into the items of the input value, when it is an array or object.
   * @param callback A function that will validate or act upon each item. This function can expect to receive a @see Guard object containing the current value.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  each(callback: (guard: Guard, keyOrIndex: string | number) => void): Guard {
    if (typeof this.value === "object") {
      for (const key of Object.keys(this.value))
        callback(this.makeNewGuard(this.value[key]), key);
      return this;
    }
    if (Array.isArray(this.value)) {
      for (let i = 0; i < this.value.length; i++)
        callback(this.makeNewGuard(this.value[i]), i);
      return this;
    }
    return this;
  }

  /**
   * Ensures that the value exactly equals (===) the specified value.
   * @param value The value to compare the guarded value against.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  equal(value: any, message?: string): Guard {
    return this.ensure(
      (val) => val === value,
      message ?? `${this.parameterName} must be equal to '${value}'.`
    );
  }

  /**
   * Ensures that the value is a valid email address.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  email(message?: string): Guard {
    return this.pattern(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message ??
        `${this.parameterName} must be a valid email. Value was: ${this.value}`
    );
  }

  /**
   * Runs the guarded value through the provided functionm which is expected to return true in order for the guarded value to be considered valid.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  ensure(isValid: (value: any) => boolean, message?: string): Guard {
    this.throwIfNotOptionalAndNoValue();
    if (this.hasValue() && isValid(this.value) !== true)
      throw new GuardError(
        this.parameterName,
        message ?? `${this.parameterName} '${this.value}' is not valid.`
      );
    return this;
  }

  /**
   * Ensures that the value is a valid hostname (domain name).
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  hostname(message?: string): Guard {
    return this.pattern(
      /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/,
      message ?? `${this.parameterName} must be a valid hostname (domain name).`
    );
  }

  /**
   * Ensures that the value matches one of the possible values.
   * @param possibleValues An array of the possible values.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  in(possibleValues: unknown[], message?: string): Guard {
    return this.ensure(
      (val) => possibleValues.includes(val),
      message ??
        `${
          this.parameterName
        } must be one of the following: ${possibleValues.join(", ")}.`
    );
  }

  /**
   * Ensures that the guarded value is a valid instance of the specified class.
   * @param classType The class prototype (just pass in the class itself).
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  instanceOf(classType: any, message?: string): Guard {
    return this.ensure(
      (val) => val instanceof classType,
      message ??
        `${this.parameterName} ${this.value} must be an instance of ${classType.name}.`
    );
  }

  /**
   * Ensures that the value is in the valid integer.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  integer(message?: string): Guard {
    return this.ensure(
      (val) => Number.isSafeInteger(val),
      message ??
        `${this.parameterName} must be an integer (from ${Number.MIN_SAFE_INTEGER} to ${Number.MAX_SAFE_INTEGER}).`
    );
  }

  /**
   * Ensures that the value is a valid ISO datetime string.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  isoDateTime(message?: string): Guard {
    return this.ensure((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, message ?? `${this.parameterName} must be a valid ISO datetime string.`);
  }

  /**
   * Ensures that the value is a string or array,
   * has length lesser than or equal to @argument max,
   * and greater than or equal to @argument min.
   * @param length The min length allowed for the guarded value.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  length(min: number, max: number, message?: string) {
    return this.minLength(min, message).maxLength(max, message);
  }

  /**
   * If the value is present and is an Array, makes its elements unique.
   * @param keySelector A function to extract a key from an element. If not provided, the element itself will be used as the key.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  makeUnique<TItem = any>(keySelector?: (item: TItem) => any): Guard {
    if (Array.isArray(this.value)) {
      const uniqueValues = new Set(
        this.value.map(keySelector ?? ((item) => item))
      );
      return this.makeNewGuard(uniqueValues);
    }
    return this;
  }

  /**
   * Ensures that the value is a number lesser than or equal to @argument maxValue.
   * @param maxValue The max number value allowed for the guarded value.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  max(maxValue: number, message?: string) {
    return this.ensure(
      (val) => typeof val === "number" && val <= maxValue,
      message ??
        `${this.parameterName} must be lesser than or equal to ${maxValue}.`
    );
  }

  /**
   * Ensures that the value is a string or array with length lesser than or equal to @argument length.
   * @param length The min length allowed for the guarded value.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  maxLength(length: number, message?: string) {
    return this.ensure(
      (val) =>
        (typeof val === "string" || Array.isArray(val)) && val.length <= length,
      message ??
        `${this.parameterName} must have a maximum length of ${length}.`
    );
  }

  /**
   * Ensures that the value is a number greater than or equal to @argument minValue.
   * @param minValue The min number value allowed for the guarded value.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  min(minValue: number, message?: string) {
    return this.ensure(
      (val) => typeof val === "number" && val >= minValue,
      message ??
        `${this.parameterName} must be greater than or equal to ${minValue}.`
    );
  }

  /**
   * Ensures that the value is a string or array with length greater than or equal to @argument length.
   * @param length The min length allowed for the guarded value.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  minLength(length: number, message?: string) {
    return this.ensure(
      (val) =>
        (typeof val === "string" || Array.isArray(val)) && val.length >= length,
      message ??
        `${this.parameterName} must have a minimum length of ${length}.`
    );
  }

  /**
   * Ensures that the value, does NOT exactly equals (!==) the specified value.
   * @param value The value to compare the guarded value against.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  notEqual(value: any, message?: string): Guard {
    return this.ensure(
      (val) => val !== value,
      message ?? `${this.parameterName} must not be equal to ${value}.`
    );
  }

  /**
   * Ensures that the value is not one of the specified values.
   * @param possibleValues An array of the unwanted values.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  notIn(possibleValues: any[], message?: string): Guard {
    return this.ensure(
      (val) => !possibleValues.includes(val),
      message ??
        `${
          this.parameterName
        } must not be any of the following: ${possibleValues.join(", ")}.`
    );
  }

  /**
   * Ensures that the value is not empty.
   * If the value is a string, it must have at least one character.
   * If the value is an array, it must have at least one element.
   * If the value is an object, it must have at least one property.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  notEmpty(message?: string): Guard {
    return this.ensure((val) => {
      if (typeof val === "string") return val.length > 0;
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === "object") return Object.keys(val).length > 0;
      return true;
    }, message ?? `${this.parameterName} must not be empty.`);
  }

  /**
   * Ensures that the value is a string with at least one character that is not a whitespace.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  notEmptyOrWhitespace(message?: string): Guard {
    guard(this.value?.trim(), this.parameterName).notEmpty(
      message ?? `${this.parameterName} must not be empty.`
    );
    return this;
  }

  /**
   * Ensures that the value is a valid JavaScript number.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  number(message?: string): Guard {
    return this.ensure(
      (value) => typeof value === "number",
      message ?? `${this.parameterName} '${this.value} must be a number.`
    );
  }

  /**
   * Ensures that the value is a valid JavaScript object.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  object(message?: string): Guard {
    return this.ensure(
      (value) => typeof value === "object",
      message ?? `${this.parameterName} '${this.value} must be a number.`
    );
  }

  /**
   * Marks the guarded value as optional,
   * so that guard functions will not throw an error if the value is null or undefined.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  optional(): Guard {
    this._isOptional = true;
    return this;
  }

  /**
   * Ensures that the guarded value is a string and matches the provided regex pattern.
   * @param regex The regex pattern.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  pattern(regex: RegExp, message?: string): Guard {
    return this.ensure(
      (val) => typeof val === "string" && regex.test(val),
      message ?? `${this.parameterName} must match the pattern ${regex}.`
    );
  }

  /**
   * Ensures that the guarded value is a string and matches at least one of the provided patterns.
   * @param regexes An array of regexes.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  patterns(regexes: RegExp[], message?: string): Guard {
    return this.ensure(
      (val) => typeof val === "string" && regexes.some((r) => r.test(val)),
      message ??
        `${this.parameterName} must match at least one of the patterns ${regexes}.`
    );
  }

  /**
   * Ensures that the value and is a number, is in the specified range.
   * @param maxValue The max number value allowed for the guarded value.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  range(minValue: number, maxValue: number, message?: string) {
    const msg =
      message ??
      `${this.parameterName} must be between ${minValue} and ${maxValue}.`;
    return this.min(minValue, msg).max(maxValue, msg);
  }

  /**
   * Ensures that the value is a valid JavaScript string.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  string(message?: string): Guard {
    return this.ensure(
      (value) => typeof value === "string",
      message ?? `${this.parameterName} '${this.value} must be a string.`
    );
  }

  /**
   * If the guarded value is not null or undefined, runs it through the provided transform function.
   * This is similar to @see do, but it expects the function to return the new value.
   * @param fn The transform function, which receives the guarded value and is expected to return a new one. The function is not expected to return a value.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  transform<T = any>(fn: (value: T) => any): Guard {
    if (this.hasValue()) return guard(fn(this.value), this.parameterName);
    return this;
  }

  /**
   * If the guarded value is a string, makes it lower case.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  toLowerCase(): Guard {
    if (typeof this.value !== "string") return this;
    return guard(this.value.toLowerCase(), this.parameterName);
  }

  /**
   * If the guarded value is a string, makes it upper case.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  toUpperCase(): Guard {
    if (typeof this.value !== "string") return this;
    return guard(this.value.toUpperCase(), this.parameterName);
  }

  /**
   * If the guarded value is a string, trims it.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  trim(): Guard {
    if (typeof this.value !== "string") return this;
    return guard(this.value.trim(), this.parameterName);
  }

  /**
   * Ensures that the value is an array and that all of its entries are unique.
   * @param keySelector A function to extract a key from an element. If not provided, the element itself will be used as the key.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  unique<TItem = any>(keySelector?: (item: TItem) => any): Guard {
    return this.ensure((val) => {
      if (!Array.isArray(val)) return false;
      const uniqueValues = new Set(val.map(keySelector ?? ((item) => item)));
      return uniqueValues.size === val.length;
    }, `${this.parameterName} must be an array with unique entries.`);
  }

  /**
   * Ensures that the value is a valid URL.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  url(message?: string): Guard {
    return this.pattern(
      /^(ftp|http|https):\/\/[^ "]+$/,
      message ?? `${this.parameterName} must be a valid URL.`
    );
  }

  /**
   * Returns a value indicating whether the guarded value is null or undefined.
   * @returns true if the guarded value is not null or undefined. Otherwise, returns false.
   */
  hasValue(): boolean {
    return this.value !== null && this.value !== undefined;
  }

  private makeNewGuard(value: any): Guard {
    const g = guard(value, this.parameterName);
    if (this._isOptional) g.optional();
    return g;
  }

  private throwIfNotOptionalAndNoValue(): void | never {
    if (this._isOptional) return;
    if (this.hasValue()) return;
    throw new GuardError(
      this.parameterName,
      `${this.parameterName} is required.`
    );
  }
}

export function guard(value: any, parameterName?: string) {
  return new Guard(value, parameterName);
}
