import * as THREE from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gsap } from "gsap";
import { P_INNER, P_OUTER, type Cmd } from "./pShape";

export type HeroSceneOptions = {
  reducedMotion: boolean;
  onReady?: () => void;
  /** Appelé si l'appareil ne parvient pas à afficher la scène de façon fluide. */
  onTooSlow?: () => void;
};

export type HeroScene = {
  destroy: () => void;
};

const SCALE = 0.1; // 34 × 50 → 3.4 × 5 unités
const P_HEIGHT = 50 * SCALE;
const WATER_Y = -P_HEIGHT / 2 - 0.02;

function toPath(cmds: Cmd[], target: THREE.Path) {
  for (const c of cmds) {
    if (c.t === "M") target.moveTo(c.x * SCALE, -c.y * SCALE);
    else if (c.t === "L") target.lineTo(c.x * SCALE, -c.y * SCALE);
    else if (c.t === "C")
      target.bezierCurveTo(
        c.x1 * SCALE, -c.y1 * SCALE,
        c.x2 * SCALE, -c.y2 * SCALE,
        c.x * SCALE, -c.y * SCALE,
      );
  }
  return target;
}

function buildPGeometry(mobile: boolean) {
  const shape = toPath(P_OUTER, new THREE.Shape()) as THREE.Shape;
  shape.holes.push(toPath(P_INNER, new THREE.Path()));
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 1.05,
    bevelEnabled: true,
    bevelThickness: 0.22,
    bevelSize: 0.13,
    bevelSegments: mobile ? 6 : 10,
    curveSegments: mobile ? 36 : 64,
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

// Fond : une lumière liquide volumétrique derrière le P (réfractée par le verre).
const backdropShader = {
  uniforms: {
    uTime: { value: 0 },
    uIntensity: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform float uIntensity;
    uniform vec2 uMouse;
    varying vec2 vUv;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
                 mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
    }
    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
      return v;
    }

    void main() {
      // Coordonnées « monde » sur le plan de fond (90 × 45, centré à y = 2.2).
      vec2 p = (vUv - 0.5) * vec2(90.0, 45.0) + vec2(0.0, 2.2);
      float t = uTime * 0.05;
      vec2 n = p * 0.22;
      vec2 q = vec2(fbm(n + t), fbm(n - t + 3.1));
      float liquid = fbm(n * 1.4 + q * 1.7 + vec2(t * 2.0, -t));
      float l = smoothstep(0.25, 0.85, liquid);

      vec2 c = p - vec2(uMouse.x * 1.2, 0.9 + uMouse.y * 0.6);
      float d2 = dot(c, c);
      float core = exp(-d2 / 5.0);
      float halo = exp(-d2 / 30.0);
      float far = exp(-d2 / 220.0);
      float beam = exp(-pow(p.x / 1.5, 2.0)) * smoothstep(-2.0, 9.0, p.y);

      vec3 night = vec3(0.004, 0.008, 0.02);
      vec3 steel = vec3(0.16, 0.22, 0.36);
      vec3 silver = vec3(0.78, 0.84, 0.96);
      vec3 cyan = vec3(0.2, 0.6, 0.66);

      vec3 col = night;
      col += steel * far * (0.18 + l * 0.15);
      col += steel * halo * (0.3 + l * 0.6);
      col += silver * core * (0.25 + l * 0.6);
      col += cyan * l * l * halo * 0.22;
      col += silver * beam * (0.04 + l * 0.07);
      col *= mix(0.2, 1.0, smoothstep(-3.0, 1.5, p.y));
      // Brume lumineuse juste au-dessus de l'eau.
      col += steel * exp(-pow((p.y + 2.3) / 1.1, 2.0)) * far * 0.3;
      col *= uIntensity;
      gl_FragColor = vec4(col, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
};

// Miroir liquide : reflet du P troublé par une houle lente.
const waterShader = {
  name: "ProspectoWater",
  uniforms: {
    color: { value: null },
    tDiffuse: { value: null },
    textureMatrix: { value: null },
    uTime: { value: 0 },
    uIntensity: { value: 0 },
  },
  vertexShader: /* glsl */ `
    uniform mat4 textureMatrix;
    varying vec4 vUv;
    varying vec3 vWorld;
    void main() {
      vUv = textureMatrix * vec4(position, 1.0);
      vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */ `
    uniform vec3 color;
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uIntensity;
    varying vec4 vUv;
    varying vec3 vWorld;

    void main() {
      vec2 p = vWorld.xz;
      float t = uTime;
      float w = sin(p.x * 2.1 + t * 0.7) * 0.5
              + sin(p.y * 6.5 - t * 1.2 + p.x * 1.3) * 0.35
              + sin((p.x - p.y) * 11.0 + t * 1.9) * 0.15;
      float near = smoothstep(9.0, 0.0, abs(p.y + 0.5));
      vec4 uv = vUv;
      uv.x += w * 0.010 * uv.w;
      uv.y += w * (0.018 + 0.03 * (1.0 - near)) * uv.w;
      vec3 refl = texture2DProj(tDiffuse, uv).rgb;

      // Le reflet s'estompe en se rapprochant du spectateur, et reste continu vers l'horizon.
      float toward = exp(-max(vWorld.z, 0.0) * 0.8);
      float side = smoothstep(16.0, 3.0, abs(p.x));
      float sheen = pow(max(0.0, w), 6.0) * 0.05 * near;

      vec3 deep = vec3(0.006, 0.01, 0.022);
      vec3 col = deep + refl * mix(0.06, 0.62, toward) * side + vec3(0.55, 0.65, 0.85) * sheen;
      // Brume d'horizon : l'eau lointaine rejoint la lumière du fond, sans ligne dure.
      float haze = smoothstep(-1.5, -8.5, vWorld.z) * smoothstep(30.0, 4.0, abs(p.x));
      col = mix(col, vec3(0.05, 0.075, 0.125), haze * 0.75);
      col *= uIntensity;
      gl_FragColor = vec4(col, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
};

const particleShader = {
  uniforms: {
    uTime: { value: 0 },
    uOpacity: { value: 0 },
    uPixelRatio: { value: 1 },
  },
  vertexShader: /* glsl */ `
    uniform float uTime;
    uniform float uPixelRatio;
    attribute float aSeed;
    varying float vAlpha;
    void main() {
      vec3 p = position;
      float speed = 0.06 + aSeed * 0.1;
      p.y = mod(p.y + uTime * speed + 3.0, 9.0) - 3.0;
      p.x += sin(uTime * 0.25 + aSeed * 12.0) * 0.25;
      p.z += cos(uTime * 0.2 + aSeed * 9.0) * 0.2;
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = (1.0 + aSeed * 2.4) * uPixelRatio * (9.0 / -mv.z);
      float twinkle = 0.55 + 0.45 * sin(uTime * (0.8 + aSeed) + aSeed * 40.0);
      vAlpha = twinkle * smoothstep(-3.0, -1.6, p.y) * smoothstep(6.0, 3.0, p.y);
    }`,
  fragmentShader: /* glsl */ `
    uniform float uOpacity;
    varying float vAlpha;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      float a = smoothstep(0.5, 0.0, d);
      gl_FragColor = vec4(vec3(0.82, 0.9, 1.0), a * vAlpha * uOpacity * 0.7);
    }`,
};

export function createHeroScene(container: HTMLElement, opts: HeroSceneOptions): HeroScene {
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  const renderer = new THREE.WebGLRenderer({
    antialias: !mobile,
    alpha: false,
    powerPreference: "high-performance",
  });
  const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
  let quality = dpr;
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.localClippingEnabled = true;
  renderer.transmissionResolutionScale = mobile ? 0.35 : 0.5;
  renderer.setClearColor(0x03050a, 1);
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.className = "hero-canvas";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const lookAt = new THREE.Vector3(0, -0.15, 0);

  // Fond lumineux : la lumière liquide est calculée une fois par image dans une petite texture
  // (elle est floue par nature), puis réutilisée par le rendu principal, la réfraction et le reflet.
  const liquidRT = new THREE.WebGLRenderTarget(mobile ? 256 : 384, mobile ? 128 : 192, {
    type: THREE.HalfFloatType,
    depthBuffer: false,
  });
  const backdropMat = new THREE.ShaderMaterial({
    ...backdropShader,
    uniforms: THREE.UniformsUtils.clone(backdropShader.uniforms),
    depthWrite: false,
    depthTest: false,
  });
  const liquidScene = new THREE.Scene();
  const liquidCam = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);
  liquidScene.add(new THREE.Mesh(new THREE.PlaneGeometry(1, 1), backdropMat));
  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 45),
    new THREE.MeshBasicMaterial({ map: liquidRT.texture, depthWrite: false }),
  );
  backdrop.position.set(0, 2.2, -9);
  scene.add(backdrop);

  // Le P
  const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), -P_HEIGHT);
  const pMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#eef3fb"),
    metalness: 0,
    roughness: 0.06,
    transmission: 1,
    thickness: 0.9,
    ior: 1.48,
    iridescence: 0.4,
    iridescenceIOR: 1.25,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    attenuationColor: new THREE.Color("#b3c4e4"),
    attenuationDistance: 4.5,
    specularIntensity: 1,
    envMapIntensity: 0.85,
    clippingPlanes: [clip],
    clipShadows: true,
  });

  const timeUniform = { value: 0 };
  pMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = timeUniform;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uTime;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
         float wob = sin(position.y * 1.15 + uTime * 0.9) * 0.022
                   + sin(position.x * 2.3 - uTime * 0.6) * 0.012;
         transformed.z += wob;
         transformed.x += sin(position.y * 0.8 + uTime * 0.5) * 0.012;`,
      );
  };

  const pGroup = new THREE.Group();
  const pMesh = new THREE.Mesh<THREE.BufferGeometry, THREE.Material>(buildPGeometry(mobile), pMat);
  pGroup.add(pMesh);
  scene.add(pGroup);

  // Lumière intérieure : un cœur lumineux pris dans la contre-forme.
  const coreMat = new THREE.SpriteMaterial({
    map: radialTexture(),
    color: new THREE.Color("#bcd2ff"),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0,
  });
  const core = new THREE.Sprite(coreMat);
  core.scale.set(3.2, 3.2, 1);
  core.position.set(0.25, 1.0, -0.9);
  pGroup.add(core);

  // Ligne de balayage qui « construit » le P.
  const scanMat = new THREE.MeshBasicMaterial({
    map: lineTexture(),
    color: new THREE.Color("#d8e6ff"),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0,
  });
  const scan = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 0.08), scanMat);
  scan.position.z = 0.8;
  pGroup.add(scan);

  // Lumières
  const key = new THREE.DirectionalLight("#e8efff", 0);
  key.position.set(4, 6, 5);
  scene.add(key);
  const rim = new THREE.PointLight("#7fd4e0", 0, 14, 1.6);
  rim.position.set(-3.5, 1.5, -2.5);
  scene.add(rim);
  const under = new THREE.PointLight("#8aa6ff", 0, 10, 2);
  under.position.set(1.5, WATER_Y + 0.4, 2);
  scene.add(under);

  // Eau
  const waterGeo = new THREE.PlaneGeometry(140, 90);
  const reflScale = mobile ? 0.3 : 0.4;
  const water = new Reflector(waterGeo, {
    clipBias: 0.003,
    textureWidth: Math.round(window.innerWidth * dpr * reflScale),
    textureHeight: Math.round(window.innerHeight * dpr * reflScale),
    color: new THREE.Color(0x8899aa),
    multisample: 0,
    shader: waterShader,
  });
  // Dans le reflet (flou), un verre simplifié suffit : on évite une seconde passe de réfraction.
  const reflMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#c9d6ee"),
    roughness: 0.15,
    metalness: 0.2,
    transparent: true,
    opacity: 0.5,
    emissive: new THREE.Color("#2a3a5c"),
    clippingPlanes: [clip],
  });
  const reflectorRender = water.onBeforeRender;
  water.onBeforeRender = function (...args: Parameters<typeof reflectorRender>) {
    pMesh.material = reflMat;
    particles.visible = false;
    reflectorRender.apply(this, args);
    pMesh.material = pMat;
    particles.visible = true;
  };
  water.rotation.x = -Math.PI / 2;
  water.position.y = WATER_Y;
  scene.add(water);
  const waterUniforms = (water.material as THREE.ShaderMaterial).uniforms;

  // Particules
  const count = mobile ? 220 : coarse ? 340 : 520;
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 2.2 + Math.random() * 7.5;
    const a = Math.random() * Math.PI * 2;
    pos[i * 3] = Math.cos(a) * r * 1.2;
    pos[i * 3 + 1] = Math.random() * 9 - 3;
    pos[i * 3 + 2] = Math.sin(a) * r * 0.6 - 2;
    seed[i] = Math.random();
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  const partMat = new THREE.ShaderMaterial({
    ...particleShader,
    uniforms: THREE.UniformsUtils.clone(particleShader.uniforms),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  partMat.uniforms.uPixelRatio.value = dpr;
  const particles = new THREE.Points(pGeo, partMat);
  scene.add(particles);

  // Dimensionnement
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Cadrage : part de la hauteur occupée par le P et position de son centre (depuis le haut).
    const a = camera.aspect;
    const pFrac = a < 0.75 ? 0.24 : a < 1.2 ? 0.3 : 0.34;
    const centerFrac = a < 0.75 ? 0.26 : a < 1.2 ? 0.29 : 0.31;
    let visibleH = P_HEIGHT / pFrac;
    // En portrait, on garde une marge latérale suffisante.
    const minVisibleW = 3.4 * 2.6;
    if (visibleH * a < minVisibleW) visibleH = minVisibleW / a;
    const dist = visibleH / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const eyeY = 1.1;
    camera.position.set(0, eyeY, dist);
    lookAt.set(0, -(0.5 - centerFrac) * visibleH + eyeY * 0.15, 0);
    camera.lookAt(lookAt);
    camera.updateProjectionMatrix();
    water.getRenderTarget().setSize(
      Math.round(w * quality * reflScale),
      Math.round(h * quality * reflScale),
    );
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // Souris
  const mouse = new THREE.Vector2();
  const target = new THREE.Vector2();
  function onPointer(e: PointerEvent) {
    const r = container.getBoundingClientRect();
    target.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
  }
  if (!opts.reducedMotion && !coarse) window.addEventListener("pointermove", onPointer, { passive: true });

  // Rendu
  const t0 = performance.now();
  let last = t0;
  const deltas: number[] = [];
  let raf = 0;
  let visible = true;
  let running = true;

  function frame() {
    const now = performance.now();
    const t = (now - t0) / 1000;
    timeUniform.value = opts.reducedMotion ? 0 : t;
    backdropMat.uniforms.uTime.value = t;
    waterUniforms.uTime.value = opts.reducedMotion ? 0 : t;
    partMat.uniforms.uTime.value = opts.reducedMotion ? 0 : t;

    mouse.lerp(target, 0.045);
    backdropMat.uniforms.uMouse.value.copy(mouse);
    const idle = opts.reducedMotion ? 0 : Math.sin(t * 0.32) * 0.09;
    pGroup.rotation.y = idle + mouse.x * 0.32;
    pGroup.rotation.x = -mouse.y * 0.08;
    pGroup.position.y = opts.reducedMotion ? 0 : Math.sin(t * 0.6) * 0.03;
    scan.position.y = clip.constant - pGroup.position.y;

    renderer.setRenderTarget(liquidRT);
    renderer.render(liquidScene, liquidCam);
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }

  // Qualité adaptative : si l'appareil peine, on réduit la résolution de rendu.
  function adapt(now: number) {
    deltas.push(now - last);
    last = now;
    if (deltas.length < 20) return;
    const sorted = [...deltas].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    deltas.length = 0;
    if (median <= 34) return;
    if (quality > 0.6) {
      quality = Math.max(0.6, quality - 0.25);
      renderer.setPixelRatio(quality);
      resize();
    } else if (median > 60) {
      // Même à basse résolution, l'appareil n'y arrive pas : on bascule sur le P vectoriel.
      opts.onTooSlow?.();
    }
  }

  function loop() {
    raf = requestAnimationFrame(loop);
    if (!visible || !running) {
      last = performance.now();
      return;
    }
    adapt(performance.now());
    frame();
  }

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  io.observe(container);
  const onVis = () => {
    running = document.visibilityState === "visible";
  };
  document.addEventListener("visibilitychange", onVis);

  // Chorégraphie d'entrée
  const bottom = -P_HEIGHT / 2 - 0.3;
  const top = P_HEIGHT / 2 + 0.35;
  const state = {
    back: 0, env: 0, part: 0, reveal: bottom, key: 0, core: 0, scan: 0, water: 0,
  };
  const apply = () => {
    backdropMat.uniforms.uIntensity.value = state.back;
    scene.environmentIntensity = state.env;
    partMat.uniforms.uOpacity.value = state.part;
    clip.constant = state.reveal;
    key.intensity = state.key * 2.2;
    rim.intensity = state.key * 9;
    under.intensity = state.key * 4;
    coreMat.opacity = state.core;
    scanMat.opacity = state.scan;
    waterUniforms.uIntensity.value = state.water;
  };

  let tl: gsap.core.Timeline | null = null;
  if (opts.reducedMotion) {
    Object.assign(state, { back: 1, env: 1, part: 0.8, reveal: top, key: 1, core: 0.55, scan: 0, water: 1 });
    apply();
    frame();
    opts.onReady?.();
    // Rendu statique : on rafraîchit seulement au redimensionnement.
    ro.disconnect();
    const ro2 = new ResizeObserver(() => {
      resize();
      frame();
    });
    ro2.observe(container);
    return {
      destroy() {
        ro2.disconnect();
        cleanup();
      },
    };
  }

  apply();
  // La chorégraphie suit le temps réel, même si quelques images sont lentes.
  gsap.ticker.lagSmoothing(0);
  tl = gsap.timeline({ onUpdate: apply, defaults: { ease: "power2.out" } });
  tl.to(state, { back: 1, water: 1, duration: 1.8, ease: "power1.inOut" }, 0)
    .to(state, { part: 1, duration: 1.6 }, 0.35)
    .to(state, { env: 0.35, duration: 1.2 }, 0.6)
    .to(state, { scan: 1, duration: 0.25 }, 0.75)
    .to(state, { reveal: top, duration: 2.0, ease: "power2.inOut" }, 0.8)
    .to(state, { scan: 0, duration: 0.5 }, 2.6)
    .to(state, { env: 1, key: 1, duration: 1.1, ease: "power3.out" }, 2.55)
    .to(state, { core: 0.6, duration: 1.4 }, 2.6)
    .call(() => opts.onReady?.(), [], 2.5);

  raf = requestAnimationFrame(loop);

  function cleanup() {
    cancelAnimationFrame(raf);
    tl?.kill();
    ro.disconnect();
    io.disconnect();
    window.removeEventListener("pointermove", onPointer);
    document.removeEventListener("visibilitychange", onVis);
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose?.();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose?.();
    });
    liquidScene.traverse((o) => (o as THREE.Mesh).geometry?.dispose?.());
    backdropMat.dispose();
    reflMat.dispose();
    water.dispose();
    envTex.dispose();
    liquidRT.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  }

  return { destroy: cleanup };
}

function radialTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(200,220,255,0.45)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function lineTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 16;
  const g = c.getContext("2d")!;
  const grd = g.createLinearGradient(0, 0, 256, 0);
  grd.addColorStop(0, "rgba(255,255,255,0)");
  grd.addColorStop(0.5, "rgba(255,255,255,1)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 6, 256, 4);
  g.globalAlpha = 0.35;
  g.fillRect(0, 2, 256, 12);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
