/**
 * Le symbole Prospecto : un P sculpté d'un seul trait liquide.
 *
 * - La hampe naît d'une pointe (une goutte qui s'étire), comme si le trait sortait de l'eau.
 * - Le trait s'affine au sommet, puis gonfle dans la boucle comme un coup de pinceau.
 * - La boucle reste ouverte : elle se termine par un renflement en goutte, sans toucher la hampe.
 * - Au cœur de la boucle flotte une sphère de lumière, l'opportunité repérée.
 *
 * Cette source unique alimente l'objet 3D (balayage d'une section elliptique) et le logo SVG.
 */

export type Vec3 = [number, number, number];

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const CENTER: [number, number] = [1.05, 1.1];
const R = 1.2;

function controlPoints(): Vec3[] {
  const pts: Vec3[] = [
    [0.1, -2.5, 0],
    [0.06, -1.45, 0],
    [0.02, -0.4, 0],
    [0.0, 0.6, 0],
    [0.0, 1.5, 0],
    [0.1, 2.02, 0],
    [0.42, 2.27, 0],
  ];
  // Boucle : de 95° à -105°, sens horaire ; le rayon se resserre à la fin (spirale vers le cœur).
  for (let a = 95; a >= -105; a -= 12.5) {
    const t = (a * Math.PI) / 180;
    const k = smooth(-40, -105, a);
    const r = R * (1 - 0.14 * k);
    pts.push([CENTER[0] + Math.cos(t) * r, CENTER[1] + Math.sin(t) * r, 0]);
  }
  return pts;
}

/** Catmull-Rom centripète (évite boucles et bosses quand l'espacement des points varie). */
function catmull(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, t: number): Vec3 {
  const d = (a: Vec3, b: Vec3) => Math.pow(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) || 1e-4, 0.5);
  const t0 = 0;
  const t1 = t0 + d(p0, p1);
  const t2 = t1 + d(p1, p2);
  const t3 = t2 + d(p2, p3);
  const tt = t1 + (t2 - t1) * t;
  const lerp = (a: Vec3, b: Vec3, ta: number, tb: number): Vec3 => {
    const k = tb - ta === 0 ? 0 : (tt - ta) / (tb - ta);
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  };
  const a1 = lerp(p0, p1, t0, t1);
  const a2 = lerp(p1, p2, t1, t2);
  const a3 = lerp(p2, p3, t2, t3);
  const b1 = lerp(a1, a2, t0, t2);
  const b2 = lerp(a2, a3, t1, t3);
  return lerp(b1, b2, t1, t2);
}

/** Épaisseur du trait (rayon) selon la position u ∈ [0, 1] le long du tracé. */
export function radiusAt(u: number): number {
  // Pointe en goutte à la base
  const tip = Math.pow(smooth(0, 0.1, u), 0.62);
  let r = mix(0.23, 0.25, smooth(0.08, 0.3, u));
  // Délié au sommet
  r = mix(r, 0.18, smooth(0.32, 0.48, u));
  // Plein de la boucle, côté droit
  r = mix(r, 0.33, smooth(0.55, 0.78, u));
  // Délié vers la fin
  r = mix(r, 0.2, smooth(0.82, 0.93, u));
  // Renflement terminal en goutte, puis fermeture arrondie
  r = mix(r, 0.28, smooth(0.93, 0.978, u));
  const end = Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, (u - 0.978) / 0.022), 2)));
  return r * tip * end;
}

/** Léger relief hors du plan : la boucle vient vers le spectateur, la base recule. */
export function depthAt(u: number): number {
  return Math.sin(u * Math.PI) * 0.32 - 0.08;
}

/** Points du tracé, régulièrement répartis en longueur. */
export function samplePath(n: number): Vec3[] {
  const cp = controlPoints();
  const dense: Vec3[] = [];
  const refl = (a: Vec3, b: Vec3): Vec3 => [2 * a[0] - b[0], 2 * a[1] - b[1], 2 * a[2] - b[2]];
  const ext = [refl(cp[0], cp[1]), ...cp, refl(cp[cp.length - 1], cp[cp.length - 2])];
  for (let i = 1; i < ext.length - 2; i++) {
    for (let k = 0; k < 24; k++) dense.push(catmull(ext[i - 1], ext[i], ext[i + 1], ext[i + 2], k / 24));
  }
  dense.push(cp[cp.length - 1]);
  // Abscisse curviligne
  const len = [0];
  for (let i = 1; i < dense.length; i++) {
    const d = Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1], dense[i][2] - dense[i - 1][2]);
    len.push(len[i - 1] + d);
  }
  const total = len[len.length - 1];
  const out: Vec3[] = [];
  let j = 0;
  for (let i = 0; i < n; i++) {
    const target = (i / (n - 1)) * total;
    while (j < len.length - 2 && len[j + 1] < target) j++;
    const t = (target - len[j]) / Math.max(1e-6, len[j + 1] - len[j]);
    const a = dense[j];
    const b = dense[j + 1];
    const u = i / (n - 1);
    out.push([mix(a[0], b[0], t), mix(a[1], b[1], t), depthAt(u)]);
  }
  return out;
}

export const SYMBOL_CORE = { x: CENTER[0] + 0.04, y: CENTER[1] + 0.12, r: 0.27 };
/** Décalage pour centrer le symbole horizontalement (sa boîte va d'environ -0.3 à 2.75). */
export const SYMBOL_OFFSET_X = -1.22;
export const SYMBOL_HEIGHT = 5.05;

/** Contour 2D du symbole pour le logo SVG (repère y vers le bas). */
export function symbolSvg(): { viewBox: string; path: string; core: { cx: number; cy: number; r: number } } {
  const n = 220;
  const pts = samplePath(n);
  const left: string[] = [];
  const right: string[] = [];
  // Repère SVG : x' = (x + 0.42) * s, y' = (2.62 - y) * s
  const s = 10;
  const X = (x: number) => ((x + 0.42) * s).toFixed(2);
  const Y = (y: number) => ((2.62 - y) * s).toFixed(2);
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const q = pts[Math.min(n - 1, i + 1)];
    const o = pts[Math.max(0, i - 1)];
    let tx = q[0] - o[0];
    let ty = q[1] - o[1];
    const l = Math.hypot(tx, ty) || 1;
    tx /= l;
    ty /= l;
    const r = radiusAt(i / (n - 1)) * 0.92;
    left.push(`${X(p[0] - ty * r)} ${Y(p[1] + tx * r)}`);
    right.push(`${X(p[0] + ty * r)} ${Y(p[1] - tx * r)}`);
  }
  const path = `M${left.join("L")}L${right.reverse().join("L")}Z`;
  return {
    viewBox: `0 0 ${((2.85 + 0.42) * s).toFixed(0)} ${((2.62 + 2.55) * s).toFixed(0)}`,
    path,
    core: { cx: Number(X(SYMBOL_CORE.x)), cy: Number(Y(SYMBOL_CORE.y)), r: SYMBOL_CORE.r * 0.9 * s },
  };
}
