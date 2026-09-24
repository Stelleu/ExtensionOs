import { describe, expect, it } from "vitest";
import {
  getRecommendationFor,
  hairTypeFamily,
  normalizeHairTextureKey,
  pricingRowsForRecommendations,
  resolveRecommendations,
  type HairTextureSubtype,
} from "@/lib/salon-helpers";

const ALL_SUBTYPES: { subtype: HairTextureSubtype; family: string }[] = [
  { subtype: "1", family: "straight" },
  { subtype: "2a", family: "wavy" },
  { subtype: "2b", family: "wavy" },
  { subtype: "2c", family: "wavy" },
  { subtype: "3a", family: "curly" },
  { subtype: "3b", family: "curly" },
  { subtype: "3c", family: "curly" },
  { subtype: "4a", family: "coily" },
  { subtype: "4b", family: "coily" },
  { subtype: "4c", family: "coily" },
];

describe("hairTypeFamily", () => {
  it.each(ALL_SUBTYPES)("maps $subtype to $family", ({ subtype, family }) => {
    expect(hairTypeFamily(subtype)).toBe(family);
  });

  it("returns null for unknown subtypes", () => {
    expect(hairTypeFamily("5a")).toBeNull();
    expect(hairTypeFamily("")).toBeNull();
  });
});

describe("getRecommendationFor", () => {
  const recommendations = {
    "3c": ["kinky-curly"],
    "4a": ["kinky", "kinky-curly"],
  };

  it("returns matching texture labels when found", () => {
    expect(getRecommendationFor("3c", recommendations)).toEqual([
      "kinky-curly",
    ]);
    expect(getRecommendationFor("4a", recommendations)).toEqual([
      "kinky",
      "kinky-curly",
    ]);
  });

  it("returns empty array when subtype has no recommendation", () => {
    expect(getRecommendationFor("2b", recommendations)).toEqual([]);
  });

  it("handles malformed or empty input without throwing", () => {
    expect(getRecommendationFor("3c", null)).toEqual([]);
    expect(getRecommendationFor("3c", undefined)).toEqual([]);
    expect(getRecommendationFor("3c", [])).toEqual([]);
    expect(getRecommendationFor("3c", "nope")).toEqual([]);
    expect(getRecommendationFor("3c", { "3c": "not-an-array" })).toEqual([]);
    expect(getRecommendationFor(null, recommendations)).toEqual([]);
    expect(getRecommendationFor("", recommendations)).toEqual([]);
    expect(
      getRecommendationFor("3c", { "3c": ["  ", "body-wavy", 42 as never] })
    ).toEqual(["body-wavy"]);
  });
});

describe("resolveRecommendations", () => {
  it("prefers curated recommendations", () => {
    expect(
      resolveRecommendations("2a", { "2a": ["deep-wave"] }, [
        "body-wavy",
        "deep-wave",
      ])
    ).toEqual(["deep-wave"]);
  });

  it("falls back to family defaults matched to available textures", () => {
    expect(
      resolveRecommendations("2a", {}, ["straight", "body-wavy", "kinky"])
    ).toEqual(["body-wavy"]);
    expect(resolveRecommendations("1", {}, ["straight", "yaki"])).toEqual([
      "straight",
      "yaki",
    ]);
  });

  it("matches body-wave alias to body-wavy pricing", () => {
    expect(
      pricingRowsForRecommendations(["body-wave"], [
        { length: '18"', texture: "body-wavy", price: 120 },
      ])
    ).toHaveLength(1);
    expect(normalizeHairTextureKey("body-wave")).toBe("body-wavy");
  });
});
