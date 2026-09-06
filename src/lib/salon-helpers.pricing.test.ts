import { describe, expect, it } from "vitest";
import {
  parseHairAddonPricing,
  findHairAddonPrice,
} from "@/lib/salon-helpers";

describe("parseHairAddonPricing", () => {
  it("parses a valid pricing array", () => {
    const rows = parseHairAddonPricing([
      { length: '18"', texture: "body-wavy", price: 120 },
      { length: '22"', texture: "straight", price: 160 },
    ]);
    expect(rows).toEqual([
      { length: '18"', texture: "body-wavy", price: 120 },
      { length: '22"', texture: "straight", price: 160 },
    ]);
  });

  it("returns [] for non-arrays and drops invalid rows", () => {
    expect(parseHairAddonPricing(null)).toEqual([]);
    expect(parseHairAddonPricing({})).toEqual([]);
    expect(
      parseHairAddonPricing([
        { length: "", texture: "straight", price: 10 },
        { length: '18"', texture: "", price: 10 },
        { length: '18"', texture: "straight", price: "nope" },
        { length: '18"', texture: "straight", price: 100 },
      ])
    ).toEqual([{ length: '18"', texture: "straight", price: 100 }]);
  });
});

describe("findHairAddonPrice", () => {
  const pricing = [
    { length: '18"', texture: "body-wavy", price: 120 },
    { length: '22"', texture: "kinky", price: 160 },
  ];

  it("returns the price for a matching length/texture pair", () => {
    expect(findHairAddonPrice(pricing, '18"', "body-wavy")).toBe(120);
  });

  it("returns null for a pair not in the list without throwing", () => {
    expect(findHairAddonPrice(pricing, '18"', "straight")).toBeNull();
    expect(findHairAddonPrice(pricing, '26"', "body-wavy")).toBeNull();
  });

  it("returns null for an empty pricing array or missing args", () => {
    expect(findHairAddonPrice([], '18"', "body-wavy")).toBeNull();
    expect(findHairAddonPrice(pricing, null, "body-wavy")).toBeNull();
    expect(findHairAddonPrice(pricing, '18"', undefined)).toBeNull();
  });
});
