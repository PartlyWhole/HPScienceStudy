// Reading what a student types as a number, and knowing which way it was
// written: 4,500 and 4.5 × 10³ are the same number, but only one of them is
// scientific notation, and a question may ask for one form in particular.

export type Form = "standard" | "sci" | "fraction";
export type Parsed = { value: number; form: Form; mantissa?: number; exponent?: number };

const SUPERSCRIPT: Record<string, string> = {
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-",
};

/** Tidy the typing: one minus sign, one times sign, no spaces or thousands commas. */
export function normalize(raw: string): string {
  let s = raw.trim().toLowerCase();
  // 10⁻³ written with superscripts becomes 10^-3.
  s = s.replace(/10([⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+)/g, (_, sup: string) => "10^" + [...sup].map((c) => SUPERSCRIPT[c]).join(""));
  s = s.replace(/[−–—]/g, "-").replace(/[×✕✖*·]/g, "x");
  s = s.replace(/\s+/g, "").replace(/,/g, "");
  return s;
}

const NUM = String.raw`-?(?:\d+\.?\d*|\.\d+)`;
const SCI = new RegExp(`^(${NUM})x10\\^?\\(?(-?\\d+)\\)?$`);
const SCI_E = new RegExp(`^(${NUM})e(-?\\d+)$`);
const POWER = /^10\^\(?(-?\d+)\)?$/;
const FRACTION = new RegExp(`^(${NUM})/(${NUM})$`);
const PLAIN = new RegExp(`^${NUM}$`);

/** What the student typed, as a number and the form it was written in — or null. */
export function parseAnswer(raw: string): Parsed | null {
  const s = normalize(raw);
  if (!s) return null;
  let m = s.match(SCI) ?? s.match(SCI_E);
  if (m) {
    const mantissa = Number(m[1]), exponent = Number(m[2]);
    return { value: mantissa * 10 ** exponent, form: "sci", mantissa, exponent };
  }
  m = s.match(POWER);
  if (m) return { value: 10 ** Number(m[1]), form: "sci", mantissa: 1, exponent: Number(m[1]) };
  m = s.match(FRACTION);
  if (m) {
    const d = Number(m[2]);
    return d === 0 ? null : { value: Number(m[1]) / d, form: "fraction" };
  }
  if (PLAIN.test(s)) return { value: Number(s), form: "standard" };
  return null;
}

/**
 * Equal, allowing for floating point, and — when `tolerance` is given — for
 * the rounding a question permits (an absolute amount).
 */
export function close(a: number, b: number, tolerance = 0): boolean {
  return Math.abs(a - b) <= Math.max(1e-9 * Math.max(Math.abs(a), Math.abs(b)), tolerance);
}

const SUP = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
const sup = (n: number) => (n < 0 ? "⁻" : "") + [...String(Math.abs(n))].map((d) => SUP[Number(d)]).join("");

/** 4,500 — with thousands commas, and no floating-point tails. */
export function formatStandard(v: number): string {
  const r = Number(v.toPrecision(12));
  const [int, frac] = String(Math.abs(r) >= 1e21 ? r.toFixed(0) : r.toFixed(Math.max(0, decimals(r)))).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (frac ? grouped + "." + frac : grouped).replace(/^-/, "−");
}

/** How many decimal places a number really has. */
function decimals(v: number): number {
  const s = String(v);
  if (s.includes("e-")) {
    const [m, e] = s.split("e-");
    return Number(e) + (m.split(".")[1]?.length ?? 0);
  }
  return s.split(".")[1]?.length ?? 0;
}

/** 4.5 × 10³ */
export function formatSci(v: number): string {
  if (v === 0) return "0";
  const exponent = Math.floor(Math.log10(Math.abs(v)));
  const mantissa = Number((v / 10 ** exponent).toPrecision(10));
  // Floating point can land a hair under 10.
  if (Math.abs(mantissa) >= 10) return formatSci(Number(v.toPrecision(10)));
  return String(mantissa).replace(/^-/, "−") + " × 10" + sup(exponent);
}

/** The same thing a student typed, shown as it would be written on paper. */
export function preview(raw: string): string | null {
  const p = parseAnswer(raw);
  if (!p) return null;
  if (p.form === "sci") return String(p.mantissa).replace(/^-/, "−") + " × 10" + sup(p.exponent!);
  if (p.form === "fraction") return normalize(raw).replace("/", " ⁄ ");
  return formatStandard(p.value);
}
