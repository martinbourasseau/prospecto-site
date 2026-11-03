// Géométrie de la lettre P de Prospecto — source unique pour le logo SVG et l'objet 3D.
// Coordonnées dans un repère 34 × 50 (y vers le bas, comme le SVG).

export const P_VIEWBOX = "0 0 34 50";

export const P_PATH =
  "M0 50V0H19C27.3 0 34 6.7 34 15C34 23.3 27.3 30 19 30H9.5V50Z" +
  "M9.5 9H18.5C21.9 9 24.5 11.7 24.5 15C24.5 18.3 21.9 21 18.5 21H9.5Z";

type Cmd =
  | { t: "M" | "L"; x: number; y: number }
  | { t: "C"; x1: number; y1: number; x2: number; y2: number; x: number; y: number };

// Contour extérieur et contre-forme, sous forme de commandes (repère SVG).
export const P_OUTER: Cmd[] = [
  { t: "M", x: 0, y: 50 },
  { t: "L", x: 0, y: 0 },
  { t: "L", x: 19, y: 0 },
  { t: "C", x1: 27.3, y1: 0, x2: 34, y2: 6.7, x: 34, y: 15 },
  { t: "C", x1: 34, y1: 23.3, x2: 27.3, y2: 30, x: 19, y: 30 },
  { t: "L", x: 9.5, y: 30 },
  { t: "L", x: 9.5, y: 50 },
];

export const P_INNER: Cmd[] = [
  { t: "M", x: 9.5, y: 9 },
  { t: "L", x: 9.5, y: 21 },
  { t: "L", x: 18.5, y: 21 },
  { t: "C", x1: 21.9, y1: 21, x2: 24.5, y2: 18.3, x: 24.5, y: 15 },
  { t: "C", x1: 24.5, y1: 11.7, x2: 21.9, y2: 9, x: 18.5, y: 9 },
];

export type { Cmd };
