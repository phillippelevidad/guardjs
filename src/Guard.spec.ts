import { describe, expect, it } from "@jest/globals";
import { guard } from "./Guard";

const THROW = true;
const DONT_THROW = false;

describe("guard", () => {
  test("undefined becomes null", () => {
    const guardedValue = guard(undefined).value;
    expect(guardedValue).toBeNull();
  });

  test("null remains null", () => {
    const guardedValue = guard(null).value;
    expect(guardedValue).toBeNull();
  });

  test("array", () => {
    [
      [undefined, THROW],
      [null, THROW],
      [0, THROW],
      [[], DONT_THROW],
      [[1], DONT_THROW],
    ].forEach(([value, shouldThrow]) => {
      const isExpected = expect(() => guard(value).array());
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });

  test("coerceToBoolean", () => {
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

  test("date", () => {
    [
      [undefined, THROW],
      [null, THROW],
      [0, THROW],
      [new Date(), DONT_THROW],
    ].forEach(([value, shouldThrow]) => {
      const isExpected = expect(() => guard(value).date());
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });

  test("defaultTo", () => {
    const guardedValue = guard(null as string | null).defaultTo(
      "default"
    ).value;
    expect(guardedValue).toBe("default");
  });

  test("do", () => {
    let notCalled = false;
    guard(undefined).do(() => (notCalled = true));
    expect(notCalled).toBe(false);

    let called = false;
    guard(1).do(() => (called = true));
    expect(called).toBe(true);
  });

  test("each", () => {
    const output: number[] = [];
    guard([1, 2, 3]).each((g) => output.push(g.value + 1)).value;
    expect(output).toEqual([2, 3, 4]);
  });

  test("equal", () => {
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

  test("email", () => {
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

  test("ensure", () => {
    [
      [() => guard(1).ensure((val) => val === 1), DONT_THROW],
      [() => guard(1).ensure((val) => val === 2), THROW],
    ].forEach(([fn, shouldThrow]) => {
      const isExpected = expect(fn);
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });

  test("hostname", () => {
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

  test("in", () => {
    [
      [1, [1, 2, 3], DONT_THROW] as [number, number[], boolean],
      [1, [2, 3, 4], THROW] as [number, number[], boolean],
      ["a", ["a", "b", "c"], DONT_THROW] as [string, string[], boolean],
      ["a", ["b", "c", "d"], THROW] as [string, string[], boolean],
    ].forEach(([value, possibleValues, shouldThrow]) => {
      const isExpected = expect(() => guard(value).in(possibleValues));
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });

  test("instanceOf", () => {
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

  test("integer", () => {
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

  test("isoDateTime", () => {
    [
      ["2020-01-01", DONT_THROW],
      ["2020-01-01T00:00:00", DONT_THROW],
      ["2020-01-01T00:00:00.000", DONT_THROW],
      ["2020-01-01T00:00:00.000Z", DONT_THROW],
      ["2020-01-01T00:00:00.000+00:00", DONT_THROW],
      ["2020-01-01T00:00:00.000-00:00", DONT_THROW],
      ["2020-13-01", THROW],
      ["2020-01-32", THROW],
      ["2020-01-01T00:00:60", THROW],
    ].forEach(([value, shouldThrow]) => {
      const isExpected = expect(() => guard(value).isoDateTime());
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });

  test("length, for strings", () => {
    [
      ["12345", 3, 5, DONT_THROW],
      ["12345", 0, 6, DONT_THROW],
      ["12345", 0, 3, THROW],
      ["12345", 6, 10, THROW],
    ].forEach(([value, min, max, shouldThrow]) => {
      const isExpected = expect(() =>
        guard(value).length(min as number, max as number)
      );
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });

  test("length, for arrays", () => {
    [
      ["12345".split(""), 3, 5, DONT_THROW],
      ["12345".split(""), 0, 6, DONT_THROW],
      ["12345".split(""), 0, 3, THROW],
      ["12345".split(""), 6, 10, THROW],
    ].forEach(([value, min, max, shouldThrow]) => {
      const isExpected = expect(() =>
        guard(value).length(min as number, max as number)
      );
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });

  test("makeUnique", () => {
    const uniquePrimitives = guard([1, 1, 2]).makeUnique().value;
    expect(uniquePrimitives).toEqual([1, 2]);

    const uniqueObjects = guard([{ id: 1 }, { id: 1 }, { id: 2 }]).makeUnique(
      (obj) => obj.id
    ).value;
    expect(uniqueObjects).toEqual([{ id: 1 }, { id: 2 }]);
  });

  test("max", () => {
    [
      [1, 2, DONT_THROW] as [number, number, boolean],
      [1, 1, DONT_THROW] as [number, number, boolean],
      [1, 0, THROW] as [number, number, boolean],
    ].forEach(([value, max, shouldThrow]) => {
      const isExpected = expect(() => guard(value).max(max));
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });

  test("object", () => {
    [
      [{}, DONT_THROW],
      [new Object(), DONT_THROW],
      [null, THROW],
      [undefined, THROW],
      [1, THROW],
      ["a", THROW],
      [true, THROW],
      [() => {}, THROW],
      [[], THROW],
    ].forEach(([value, shouldThrow]) => {
      const isExpected = expect(() => guard(value).object());
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });

  test("optional", () => {
    [
      [() => guard(null).number(), THROW],
      [() => guard(null).optional().number(), DONT_THROW],
    ].forEach(([fn, shouldThrow]) => {
      const isExpected = expect(fn);
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });

  test("pattern", () => {
    [
      ["abc", /abc/, DONT_THROW] as [string, RegExp, boolean],
      ["abc", /def/, THROW] as [string, RegExp, boolean],
    ].forEach(([value, pattern, shouldThrow]) => {
      const isExpected = expect(() => guard(value).pattern(pattern));
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });

  test("range", () => {
    [
      [1, 0, 2, DONT_THROW] as [number, number, number, boolean],
      [1, 1, 2, DONT_THROW] as [number, number, number, boolean],
      [1, 2, 3, THROW] as [number, number, number, boolean],
    ].forEach(([value, min, max, shouldThrow]) => {
      const isExpected = expect(() => guard(value).range(min, max));
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });

  test("string", () => {
    [
      ["", DONT_THROW],
      ["a", DONT_THROW],
      [new String("a"), THROW],
      [null, THROW],
      [undefined, THROW],
      [1, THROW],
      [true, THROW],
      [() => {}, THROW],
      [[], THROW],
    ].forEach(([value, shouldThrow]) => {
      const isExpected = expect(() => guard(value).string());
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });

  test("transform", () => {
    const value = guard("1").transform((v) => parseInt(v)).value;
    expect(value).toBe(1);
  });

  test("toLowerCase", () => {
    const value = guard("A").toLowerCase().value;
    expect(value).toBe("a");
  });

  test("toUpperCase", () => {
    const value = guard("a").toUpperCase().value;
    expect(value).toBe("A");
  });

  test("trim", () => {
    const value = guard(" a ").trim().value;
    expect(value).toBe("a");
  });

  test("unique", () => {
    [
      [[], DONT_THROW],
      [[1, 2], DONT_THROW],
      [[1, 1], THROW],
      ["", THROW],
    ].forEach(([value, shouldThrow]) => {
      const isExpected = expect(() => guard(value).unique());
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });

  test("url", () => {
    [
      ["http://example.com", DONT_THROW],
      ["https://example.com", DONT_THROW],
      ["ftp://example.com", DONT_THROW],
      ["http://example.com/", DONT_THROW],
      ["http://example.com/path", DONT_THROW],
      ["http://example.com/path/", DONT_THROW],
      ["http://example.com/path?query=1", DONT_THROW],
      ["http://example.com/path/?query=1", DONT_THROW],
      ["http://example.com/path?query=1&query=2", DONT_THROW],
      ["http://example.com/path/?query=1&query=2", DONT_THROW],
      ["http://example.com/path#fragment", DONT_THROW],
      ["http://example.com/path/#fragment", DONT_THROW],
      ["http://example.com/path?query=1#fragment", DONT_THROW],
      ["http://example.com/path/?query=1#fragment", DONT_THROW],
      ["http", THROW],
      ["www.example.com", THROW],
      ["www.example.com/path", THROW],
      ["www.example.com/path/", THROW],
    ].forEach(([value, shouldThrow]) => {
      const isExpected = expect(() => guard(value).url());
      if (shouldThrow) isExpected.toThrow();
      else isExpected.not.toThrow();
    });
  });
});
