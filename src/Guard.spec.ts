import { describe, expect, it } from "@jest/globals";
import { guard } from "./Guard";

describe("guard", () => {
  it("shoud alter undefined to null", () => {
    const guardedValue = guard(undefined).value;
    expect(guardedValue).toBeNull();
  });
});
