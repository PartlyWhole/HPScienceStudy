// Units and how big each one is, so that a conversion factor can be checked
// for truth (is its top really the same amount as its bottom?) and a chain of
// factors for what it leaves behind once units cancel.

export type Dim = "length" | "time" | "mass" | "volume" | "power";

/** Each unit's size in its dimension's base unit (m, s, g, mL, W). */
export const UNIT: Record<string, { dim: Dim; size: number; name: string }> = {
  km: { dim: "length", size: 1000, name: "kilometers" },
  m: { dim: "length", size: 1, name: "meters" },
  cm: { dim: "length", size: 0.01, name: "centimeters" },
  mm: { dim: "length", size: 0.001, name: "millimeters" },
  "µm": { dim: "length", size: 1e-6, name: "micrometers" },
  mi: { dim: "length", size: 1609.344, name: "miles" },
  yd: { dim: "length", size: 0.9144, name: "yards" },
  ft: { dim: "length", size: 0.3048, name: "feet" },
  in: { dim: "length", size: 0.0254, name: "inches" },
  s: { dim: "time", size: 1, name: "seconds" },
  min: { dim: "time", size: 60, name: "minutes" },
  hr: { dim: "time", size: 3600, name: "hours" },
  day: { dim: "time", size: 86400, name: "days" },
  yr: { dim: "time", size: 31_536_000, name: "years" },
  Mg: { dim: "mass", size: 1e6, name: "megagrams" },
  kg: { dim: "mass", size: 1000, name: "kilograms" },
  g: { dim: "mass", size: 1, name: "grams" },
  mg: { dim: "mass", size: 0.001, name: "milligrams" },
  "µg": { dim: "mass", size: 1e-6, name: "micrograms" },
  "m³": { dim: "volume", size: 1e6, name: "cubic meters" },
  L: { dim: "volume", size: 1000, name: "liters" },
  mL: { dim: "volume", size: 1, name: "milliliters" },
  "cm³": { dim: "volume", size: 1, name: "cubic centimeters" },
  "µL": { dim: "volume", size: 0.001, name: "microliters" },
  gal: { dim: "volume", size: 3785.41, name: "gallons" },
  MW: { dim: "power", size: 1e6, name: "megawatts" },
  kW: { dim: "power", size: 1000, name: "kilowatts" },
  W: { dim: "power", size: 1, name: "watts" },
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
