import { ImageResponse } from "next/og";

export const alt = "Prospecto — Agent IA de prospection commerciale";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const P =
  "M0 50V0H19C27.3 0 34 6.7 34 15C34 23.3 27.3 30 19 30H9.5V50ZM9.5 9H18.5C21.9 9 24.5 11.7 24.5 15C24.5 18.3 21.9 21 18.5 21H9.5Z";

export default function OpengraphImage() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 50"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.4" stop-color="#c7d0dd"/><stop offset="0.75" stop-color="#6f86b3"/><stop offset="1" stop-color="#e9f0ff"/></linearGradient></defs><path fill="url(#g)" fill-rule="evenodd" d="${P}"/></svg>`;
  const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", alignItems: "center",
          background: "radial-gradient(60% 80% at 72% 45%, #2a3a5c 0%, #08101f 45%, #03050a 100%)",
          color: "#f1f4f9", padding: "0 90px", gap: 80,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 26, letterSpacing: 12, color: "#c7d0dd" }}>PROSPECTO</div>
          <div style={{ fontSize: 68, lineHeight: 1.05, marginTop: 30, letterSpacing: -2 }}>La prospection change.</div>
          <div style={{ fontSize: 68, lineHeight: 1.05, color: "#9aa6b8", letterSpacing: -2 }}>Votre croissance aussi.</div>
          <div style={{ fontSize: 26, marginTop: 36, color: "#9cbcff" }}>Agent IA de prospection commerciale</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={300} height={441} alt="" />
      </div>
    ),
    size,
  );
}
