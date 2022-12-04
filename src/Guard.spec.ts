import { describe, expect, it } from "@jest/globals";
import { guard } from "./Guard";

const THROW = true;
const DONT_THROW = false;

describe("guard", () => {
  it("undefined becomes null", () => {
    const guardedValue = guard(undefined).value;
    expect(guardedValue).toBeNull();
  });

  it("coerceToBoolean", () => {
    [
      [false, false],
      [true, true],
      [0, false],
      [1, true],
      ["", false],
      [" ", true],
    ].forEach(([value, expected]) => {
      const guardedValue = guard(value).coerceToBoolean().value;
      expect(guardedValue).toBe(expected);
    });
  });

  it("defaultTo", () => {
    const guardedValue = guard(undefined).defaultTo("default").value;
    expect(guardedValue).toBe("default");
  });

  it("do", () => {
    let notCalled = false;
    guard(undefined).do(() => (notCalled = true));
    expect(notCalled).toBe(false);

    let called = false;
    guard(1).do(() => (called = true));
    expect(called).toBe(true);
  });

  it("each", () => {
    const output: number[] = [];
    guard([1, 2, 3]).each((g) => output.push(g.value + 1)).value;
    expect(output).toEqual([2, 3, 4]);
  });

  it("equal", () => {
    [
      [1, 1, DONT_THROW],
      [1, "1", THROW],
      [1, 2, THROW],
      [{}, {}, THROW],
    ].forEach(([value, expected, shouldThrow]) => {
      const isExpected = expect(() => guard(value).equal(expected));
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
    expect(() => guard(1).equal(1)).not.toThrow();
  });

  it("email", () => {
    [
      ["", THROW],
      [" ", THROW],
      ["a", THROW],
      ["a@", THROW],
      ["a@b", THROW],
      ["a@b.", THROW],
      ["someemail@domain.com", DONT_THROW],
      ["some.email@domain.com", DONT_THROW],
      ["some.email+alias@domain.com", DONT_THROW],
      ["some.email+alias-asdasd@domain.com.br", DONT_THROW],
    ].forEach(([value, shouldThrow]) => {
      const isExpected = expect(() => guard(value).email());
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });

  it("hostname", () => {
    [
      ["", THROW],
      [" ", THROW],
      ["localhost", DONT_THROW],
      ["local\\host", THROW],
      ["domain.com", DONT_THROW],
      ["sub.domain.com", DONT_THROW],
      ["sub.domain.com.br", DONT_THROW],
    ].forEach(([value, shouldThrow]) => {
      const isExpected = expect(() => guard(value).hostname());
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });

  it("in", () => {
    [
      [1, [1, 2, 3], DONT_THROW],
      [1, [2, 3, 4], THROW],
      ["a", ["a", "b", "c"], DONT_THROW],
      ["a", ["b", "c", "d"], THROW],
    ].forEach(([value, possibleValues, shouldThrow]) => {
      const isExpected = expect(() =>
        guard(value).in(possibleValues as unknown[])
      );
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });

  it("instanceOf", () => {
    [
      [new Number(1), Number, DONT_THROW],
      [new Number(1), String, THROW],
      [new String("a"), String, DONT_THROW],
      [new String("a"), Number, THROW],
    ].forEach(([value, expected, shouldThrow]) => {
      const isExpected = expect(() => guard(value).instanceOf(expected));
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });

  it("integer", () => {
    [
      [1, DONT_THROW],
      [1.1, THROW],
      ["1", THROW],
      ["1.1", THROW],
    ].forEach(([value, shouldThrow]) => {
      const isExpected = expect(() => guard(value).integer());
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });

  it("isoDate", () => {
    [
      ["2020-01-01", DONT_THROW],
      ["2020-01-01T00:00:00", DONT_THROW],
      ["2020-01-01T00:00:00.000", DONT_THROW],
      ["2020-01-01T00:00:00.000Z", DONT_THROW],
      ["2020-01-01T00:00:00.000+00:00", DONT_THROW],
      ["2020-01-01T00:00:00.000-00:00", DONT_THROW],
      ["2020-13-01", THROW],
      ["2020-01-32", THROW],
      ["2020-01-01T24:00:00", THROW],
      ["2020-01-01T00:00:60", THROW],
    ].forEach(([value, shouldThrow]) => {
      const isExpected = expect(() => guard(value).isoDate());
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });
});
