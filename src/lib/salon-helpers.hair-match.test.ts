import { describe, expect, it } from "vitest";
import {
  hairTypeFamily,
  suggestHairMatch,
  type HairTextureSubtype,
} from "@/lib/salon-helpers";

const ALL_SUBTYPES: { subtype: HairTextureSubtype; family: string }[] = [
  { subtype: "1a", family: "straight" },
  { subtype: "1b", family: "straight" },
  { subtype: "1c", family: "straight" },
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

describe("suggestHairMatch", () => {
  const pricing = [
    { length: '18"', texture: "body-wavy", price: 120 },
    { length: '18"', texture: "straight", price: 110 },
    { length: '22"', texture: "kinky", price: 160 },
    { length: '22"', texture: "Yaki", price: 150 },
  ];

  it("returns no matches when nothing in pricing fits the family", () => {
    const result = suggestHairMatch(
      {
        textureSubtype: "4c",
        thickness: "fine",
        chemical_treatment: false,
      },
      [{ length: '18"', texture: "body-wavy", price: 120 }]
    );
    expect(result.matches).toEqual([]);
    expect(result.notes).toEqual([]);
  });

  it("returns a single matching texture for wavy hair", () => {
    const result = suggestHairMatch(
      {
        textureSubtype: "2b",
        thickness: "medium",
        chemical_treatment: false,
      },
      pricing
    );
    expect(result.matches).toEqual([
      { length: '18"', texture: "body-wavy", price: 120 },
    ]);
    expect(result.notes).toEqual([]);
  });

  it("returns multiple matches when several textures fit", () => {
    const result = suggestHairMatch(
      {
        textureSubtype: "1b",
        thickness: "medium",
        chemical_treatment: false,
      },
      pricing
    );
    expect(result.matches).toHaveLength(2);
    expect(result.matches.map((m) => m.texture).sort()).toEqual([
      "Yaki",
      "straight",
    ]);
  });

  it("adds a thickness note for thick hair", () => {
    const result = suggestHairMatch(
      {
        textureSubtype: "3a",
        thickness: "thick",
        chemical_treatment: false,
      },
      [{ length: '18"', texture: "kinky-curly", price: 130 }]
    );
    expect(result.notes).toContain(
      "Thicker natural hair may need more wefts for a balanced, full look."
    );
  });

  it("adds a chemical treatment note when true", () => {
    const result = suggestHairMatch(
      {
        textureSubtype: "2a",
        thickness: "fine",
        chemical_treatment: true,
      },
      pricing
    );
    expect(result.notes).toContain(
      "Recent chemical treatments can mean using lower heat and a protein treatment before install."
    );
  });

  it("combines thickness and chemical treatment notes", () => {
    const result = suggestHairMatch(
      {
        textureSubtype: "4b",
        thickness: "thick",
        chemical_treatment: true,
      },
      [{ length: '22"', texture: "kinky", price: 160 }]
    );
    expect(result.notes).toHaveLength(2);
    expect(result.matches).toEqual([
      { length: '22"', texture: "kinky", price: 160 },
    ]);
  });
});
