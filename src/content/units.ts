// Units and how big each one is, so that a conversion factor can be checked
// for truth (is its top really the same amount as its bottom?) and a chain of
// factors for what it leaves behind once units cancel.

export type Dim = "length" | "time" | "mass" | "volume";

/**
 * Each unit's size in its dimension's base unit (m, s, g, mL). The metric
 * ones are the class handout's ladder — kilo, hecto, deca, the base unit,
 * deci, centi, milli — on meters, liters and grams; then cm³ for volume, and
 * the time and English units the conversion-factor problems use.
 */
export const UNIT: Record<string, { dim: Dim; size: number; name: string }> = {
  km: { dim: "length", size: 1000, name: "kilometers" },
  hm: { dim: "length", size: 100, name: "hectometers" },
  dam: { dim: "length", size: 10, name: "decameters" },
  m: { dim: "length", size: 1, name: "meters" },
  dm: { dim: "length", size: 0.1, name: "decimeters" },
  cm: { dim: "length", size: 0.01, name: "centimeters" },
  mm: { dim: "length", size: 0.001, name: "millimeters" },
  mi: { dim: "length", size: 1609.344, name: "miles" },
  yd: { dim: "length", size: 0.9144, name: "yards" },
  ft: { dim: "length", size: 0.3048, name: "feet" },
  in: { dim: "length", size: 0.0254, name: "inches" },
  s: { dim: "time", size: 1, name: "seconds" },
  min: { dim: "time", size: 60, name: "minutes" },
  hr: { dim: "time", size: 3600, name: "hours" },
  day: { dim: "time", size: 86400, name: "days" },
  yr: { dim: "time", size: 31_536_000, name: "years" },
  kg: { dim: "mass", size: 1000, name: "kilograms" },
  hg: { dim: "mass", size: 100, name: "hectograms" },
  dag: { dim: "mass", size: 10, name: "decagrams" },
  g: { dim: "mass", size: 1, name: "grams" },
  dg: { dim: "mass", size: 0.1, name: "decigrams" },
  cg: { dim: "mass", size: 0.01, name: "centigrams" },
  mg: { dim: "mass", size: 0.001, name: "milligrams" },
  kL: { dim: "volume", size: 1e6, name: "kiloliters" },
  hL: { dim: "volume", size: 1e5, name: "hectoliters" },
  daL: { dim: "volume", size: 1e4, name: "decaliters" },
  L: { dim: "volume", size: 1000, name: "liters" },
  dL: { dim: "volume", size: 100, name: "deciliters" },
  cL: { dim: "volume", size: 10, name: "centiliters" },
  mL: { dim: "volume", size: 1, name: "milliliters" },
  "cm³": { dim: "volume", size: 1, name: "cubic centimeters" },
};

/** The units of a quantity: 3.5 km is {num: [km]}; 90 km/hr is {num: [km], den: [hr]}. */
export type Units = { num: string[]; den: string[] };

/** km·km is written km², as on paper. */
const side = (xs: string[]) => {
  const counts = new Map<string, number>();
  for (const x of xs) counts.set(x, (counts.get(x) ?? 0) + 1);
  return [...counts].map(([x, k]) => x + (k === 2 ? "²" : k === 3 ? "³" : k > 3 ? "^" + k : "")).join("·");
};

export const unitText = (u: Units) => (u.num.length ? side(u.num) : "1") + (u.den.length ? "/" + side(u.den) : "");

/** The units in the same dimensions as these, for the pickers. */
export function unitsLike(...us: Units[]): string[] {
  const dims = new Set(us.flatMap((u) => [...u.num, ...u.den]).map((s) => UNIT[s].dim));
  return Object.keys(UNIT).filter((s) => dims.has(UNIT[s].dim));
}

/** A factor as the student writes it: an amount over an amount. */
export type Factor = { top: { n: number; unit: string }; bottom: { n: number; unit: string } };

/**
 * Is the factor a way of writing 1? Its top and bottom must be the same
 * amount. A little slack lets through the rounded factors the book gives
 * (1,609 m = 1 mi; 3.785 L = 1 gal).
 */
export function factorTrue(f: Factor): boolean {
  const a = UNIT[f.top.unit], b = UNIT[f.bottom.unit];
  if (!a || !b || a.dim !== b.dim || f.bottom.n === 0) return false;
  const top = f.top.n * a.size, bottom = f.bottom.n * b.size;
  return Math.abs(top - bottom) <= 0.002 * Math.max(Math.abs(top), Math.abs(bottom));
}

/** What a chain leaves after cancelling: every unit on top struck out against the same unit below. */
export function cancel(start: Units, factors: Factor[]): Units {
  const num = [...start.num, ...factors.map((f) => f.top.unit)];
  const den = [...start.den, ...factors.map((f) => f.bottom.unit)];
  for (let i = num.length - 1; i >= 0; i--) {
    const j = den.indexOf(num[i]);
    if (j >= 0) {
      num.splice(i, 1);
      den.splice(j, 1);
    }
  }
  return { num, den };
}

export const sameUnits = (a: Units, b: Units) =>
  a.num.length === b.num.length && a.den.length === b.den.length &&
  [...a.num].sort().join() === [...b.num].sort().join() && [...a.den].sort().join() === [...b.den].sort().join();

/** Tops multiplied, bottoms divided: the number a chain gives. */
export const chainValue = (n: number, factors: Factor[]) => factors.reduce((v, f) => (v * f.top.n) / f.bottom.n, n);

/** The right answer, from the sizes of the units. */
export function convert(n: number, from: Units, to: Units): number {
  const size = (u: Units) => u.num.reduce((s, x) => s * UNIT[x].size, 1) / u.den.reduce((s, x) => s * UNIT[x].size, 1);
  return Number(((n * size(from)) / size(to)).toPrecision(12));
}
