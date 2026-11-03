"use client";

import { useEffect, useRef, useState } from "react";
import PMark from "./PMark";
import { Arrow } from "./Icons";

/**
 * WebGL utilisable avec une vraie accélération matérielle ?
 * Un rendu logiciel (SwiftShader, llvmpipe…) ferait ramer la page : on affiche alors le P vectoriel.
 */
function hardwareWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    const q = new URLSearchParams(location.search);
    if (q.has("force3d") || q.has("debug3d")) return true;
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

function HeroActions() {
  return (
    <>
      <a href="#prospecto" className="btn btn-primary" data-glow data-magnetic>
        Découvrir Prospecto
        <Arrow />
      </a>
      <a href="#contact" className="btn btn-glass glass" data-glow data-magnetic>
        Développer mon activité avec l&apos;IA
      </a>
    </>
  );
}

export default function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "webgl" | "fallback">("pending");

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (!hardwareWebGL()) {
      setMode("fallback");
      return;
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let destroyed = false;
    let destroy: (() => void) | undefined;

    const start = async () => {
      try {
        const { createHeroScene } = await import("@/lib/heroScene");
        if (destroyed) return;
        const s = createHeroScene(el, {
          reducedMotion,
          onTooSlow: () => {
            s.destroy();
            destroy = undefined;
            setMode("fallback");
          },
        });
        destroy = s.destroy;
        setMode("webgl");
      } catch {
        setMode("fallback");
      }
    };
    // Le texte s'affiche d'abord ; la scène 3D se charge juste après.
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    const handle = idle ? idle(start, { timeout: 600 }) : window.setTimeout(start, 120);

    return () => {
      destroyed = true;
      if (!idle) window.clearTimeout(handle);
      destroy?.();
    };
  }, []);

  return (
    <section id="accueil" className="hero" aria-labelledby="hero-title">
      <div ref={stage} className="hero-stage">
        {mode !== "webgl" && (
          <div
            className="hero-fallback transition-opacity duration-1000"
            style={{ opacity: mode === "fallback" ? 1 : 0 }}
            aria-hidden="true"
          >
            <div className="fb-sky" />
            <div className="fb-water" />
            <div className="fb-p">
              <div className="fb-glow" />
              <PMark className="relative h-full w-auto drop-shadow-[0_0_32px_rgba(156,188,255,0.35)]" />
            </div>
            <div className="fb-reflect">
              <PMark className="h-full w-auto" />
            </div>
          </div>
        )}
      </div>
      <div className="hero-vignette" />

      <div className="hero-copy wrap flex min-h-[max(100svh,720px)] flex-col justify-end pb-[clamp(28px,6vh,64px)] pt-[44svh] md:pt-[50svh]">


        <div className="grid items-end gap-7 md:grid-cols-[1.55fr_1fr] md:gap-12">
          <div>
            <h1 id="hero-title" className="hero-title display">
              <span className="hero-eyebrow intro" style={{ ["--d" as string]: "0.3s" }}>
                Intelligence artificielle · Prospection commerciale
              </span>{" "}
              <span className="line intro" style={{ ["--d" as string]: "0.42s" }}>La prospection change.</span>{" "}
              <span className="line intro text-[var(--silver)]" style={{ ["--d" as string]: "0.54s" }}>
                Votre croissance aussi.
              </span>
            </h1>
            <div className="intro mt-8 hidden flex-wrap gap-3 md:flex" style={{ ["--d" as string]: "1s" }}>
              <HeroActions />
            </div>
          </div>

          <div className="md:pb-1">
            <p className="hero-wordmark wordmark intro mb-5" style={{ ["--d" as string]: "0.75s" }}>
              Prospecto
            </p>
            <p className="lede intro !text-[var(--silver)]" style={{ ["--d" as string]: "0.85s" }}>
              Un agent IA qui <strong className="kw">recherche</strong> des entreprises,{" "}
              <strong className="kw">qualifie</strong> les prospects et <strong className="kw">prépare</strong> des
              prises de contact personnalisées.
            </p>
            <div className="intro mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:hidden" style={{ ["--d" as string]: "1s" }}>
              <HeroActions />
            </div>
          </div>
        </div>
        {mode === "webgl" && (
          <p className="hero-hint intro mt-8 self-center" style={{ ["--d" as string]: "3.2s" }} aria-hidden="true">
            <i />
            <span className="hidden [@media(pointer:fine)]:inline">Cliquez sur l&apos;eau</span>
            <span className="[@media(pointer:fine)]:hidden">Touchez l&apos;eau</span>
          </p>
        )}
      </div>
    </section>
  );
}
