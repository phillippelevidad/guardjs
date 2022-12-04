import { GuardError } from "./GuardError";

export type Optional<T> = T | null;

export type ElementType<ArrayType> = ArrayType extends Array<infer ElementType>
  ? ElementType
  : never;

export class Guard<T = unknown> {
  private _isOptional = false;

  constructor(public value: T, public parameterName = "value") {
    if (value === undefined) this.value = null as T;
  }

  /**
   * Ensures that the value is a valid JavaScript array.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  array(message?: string): Guard<Array<ElementType<T>>> {
    return this.ensure(
      (value) => Array.isArray(value),
      message ?? `${this.parameterName} '${this.value} must be an array.`
    );
  }

  /**
   * Coerces the guarded value into a Boolean value, guaranteed to be either true or false.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  coerceToBoolean(): Guard<boolean> {
    return this.makeNewGuard<boolean>(!!this.value);
  }

  /**
   * Ensures that the value is a valid JavaScript number.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  date(message?: string): Guard<Date> {
    return this.ensure(
      (value) => value instanceof Date,
      message ?? `${this.parameterName} '${this.value} must be a date.`
    );
  }

  /**
   * Provides a default value, in case the original is null or undefined.
   * @param defaultValue The default value to be used in case the original is missing.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  defaultTo(defaultValue: NonNullable<T>): Guard<T> {
    if (!this.hasValue()) return guard(defaultValue, this.parameterName);
    return this;
  }

  /**
   * If the guarded value is not null nor undefined, runs it through the provided callback function.
   * This is similar to @see transform, but it does not change the value and it does not expect a return value.
   * @param fn The callback function, which receives the guarded value and is allowed to operate on it.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  do(fn: (value: T) => void): Guard<T> {
    if (this.hasValue()) fn(this.value);
    return this;
  }

  /**
   * Steps into the items of the input value, when it is an array or object.
   * @param callback A function that will validate or act upon each item. This function can expect to receive a @see Guard object containing the current value.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  each(
    callback: (
      guard: Guard<ElementType<T>>,
      keyOrIndex: string | number
    ) => void
  ): Guard<T> {
    if (this.value !== null && typeof this.value === "object") {
      for (const key of Object.keys(this.value!))
        callback(
          this.makeNewGuard((this.value as Record<string, unknown>)[key]),
          key
        );
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
  equal(value: any, message?: string): Guard<T> {
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
  email(message?: string): Guard<string> {
    return this.pattern(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message ??
        `${this.parameterName} must be a valid email. Value was: ${this.value}`
    );
  }

  /**
   * Runs the guarded value through the provided function, which is expected to return true in order for the guarded value to be considered valid.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  ensure<TAssertedType = T>(
    isValid: (value: any) => boolean,
    message?: string
  ): Guard<TAssertedType> {
    this.throwIfNotOptionalAndNoValue();
    if (this.hasValue() && isValid(this.value) !== true)
      throw new GuardError(
        this.parameterName,
        message ?? `${this.parameterName} '${this.value}' is not valid.`
      );
    return this as unknown as Guard<TAssertedType>;
  }

  /**
   * Ensures that the value is a valid hostname (domain name).
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  hostname(message?: string): Guard<string> {
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
  in(possibleValues: Array<T>, message?: string): Guard<T> {
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
  instanceOf<TAssertedType = T>(
    classType: TAssertedType,
    message?: string
  ): Guard<TAssertedType> {
    const anyClassType = classType as any;
    return this.ensure<TAssertedType>(
      (val) => val instanceof anyClassType,
      message ??
        `${this.parameterName} ${this.value} must be an instance of ${anyClassType.name}.`
    );
  }

  /**
   * Ensures that the value is in the valid integer.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  integer(message?: string): Guard<number> {
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
  isoDateTime(message?: string): Guard<string> {
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
  length(min: number, max: number, message?: string): Guard<T> {
    return this.minLength(min, message).maxLength(max, message);
  }

  /**
   * If the value is present and is an Array, makes its elements unique.
   * @param keySelector A function to extract a key from an element. If not provided, the element itself will be used as the key.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  makeUnique(keySelector?: (item: ElementType<T>) => unknown): Guard<T> {
    this.array();
    const unique = new Map(
      (this.value as Array<ElementType<T>>).map((item) => [
        keySelector ? keySelector(item) : item,
        item,
      ])
    );
    return this.makeNewGuard(Array.from(unique.values()));
  }

  /**
   * Ensures that the value is a number lesser than or equal to @argument maxValue.
   * @param maxValue The max number value allowed for the guarded value.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  max(maxValue: number, message?: string): Guard<number> {
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
  maxLength(length: number, message?: string): Guard<T> {
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
  min(minValue: number, message?: string): Guard<T> {
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
  minLength(length: number, message?: string): Guard<T> {
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
  notEqual(value: any, message?: string): Guard<T> {
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
  notIn(possibleValues: Array<T>, message?: string): Guard<T> {
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
  notEmpty(message?: string): Guard<T> {
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
  notEmptyOrWhitespace(message?: string): Guard<string> {
    return this.ensure(
      (val) => typeof val === "string" && val.trim().length > 0,
      message ?? `${this.parameterName} must not be empty or whitespace.`
    );
  }

  /**
   * Ensures that the value is a valid JavaScript number.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  number(message?: string): Guard<number> {
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
      message ?? `${this.parameterName} '${this.value} must be an object.`
    );
  }

  /**
   * Marks the guarded value as optional,
   * so that guard functions will not throw an error if the value is null or undefined.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  optional(): Guard<Optional<T>> {
    this._isOptional = true;
    return this;
  }

  /**
   * Ensures that the guarded value is a string and matches the provided regex pattern.
   * @param regex The regex pattern.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  pattern(regex: RegExp, message?: string): Guard<string> {
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
  patterns(regexes: Array<RegExp>, message?: string): Guard<string> {
    return this.ensure(
      (val) => typeof val === "string" && regexes.some((r) => r.test(val)),
      message ??
        `${this.parameterName} must match at least one of the patterns ${regexes}.`
    );
  }

  /**
   * Ensures that the value is a number in the specified range.
   * @param maxValue The max number value allowed for the guarded value.
   * @param message Optional message. If not provided, a default message will be used.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  range(minValue: number, maxValue: number, message?: string): Guard<number> {
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
  string(message?: string): Guard<string> {
    return this.ensure(
      (value) => typeof value === "string",
      message ?? `${this.parameterName} '${this.value} must be a string.`
    );
  }

  /**
   * Runs the guarded value through the provided transform function.
   * This is similar to @see do, but it expects the function to return the new value.
   * @param fn The transform function, which receives the guarded value and is expected to return a new one. The function is not expected to return a value.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  transform<TNewType = unknown>(fn: (value: T) => TNewType): Guard<TNewType> {
    return this.makeNewGuard(fn(this.value));
  }

  /**
   * Makes a string lower case.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  toLowerCase(): Guard<Lowercase<string>> {
    const transformed = this.string().value?.toLowerCase();
    return this.makeNewGuard(transformed);
  }

  /**
   * Makes a string upper case.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  toUpperCase(): Guard<Uppercase<string>> {
    const transformed = this.string().value?.toUpperCase();
    return this.makeNewGuard(transformed);
  }

  /**
   * Trims the guarded string value.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  trim(): Guard<string> {
    const transformed = this.string().value?.trim();
    return this.makeNewGuard(transformed);
  }

  /**
   * Ensures that the value is an array and that all of its entries are unique.
   * @param keySelector A function to extract a key from an element. If not provided, the element itself will be used as the key.
   * @returns A @see Guard object, for following up with other guard methods or obtaining the input value.
   */
  unique(keySelector?: (item: ElementType<T>) => any): Guard<T> {
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
  url(message?: string): Guard<string> {
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

  private makeNewGuard<TValue>(value: any): Guard<TValue> {
    const g = guard<TValue>(value, this.parameterName);
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

export function guard<T = unknown>(value: T, parameterName?: string): Guard<T> {
  return new Guard<T>(value, parameterName);
}
