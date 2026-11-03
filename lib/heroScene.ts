import * as THREE from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gsap } from "gsap";
import { radiusAt, samplePath, SYMBOL_CORE, SYMBOL_HEIGHT, SYMBOL_OFFSET_X } from "./pSymbol";

export type HeroSceneOptions = {
  reducedMotion: boolean;
  onReady?: () => void;
  /** Appelé si l'appareil ne parvient pas à afficher la scène de façon fluide. */
  onTooSlow?: () => void;
};

export type HeroScene = {
  destroy: () => void;
};

const WATER_Y = -2.55;

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
      float core = exp(-d2 / 2.6);
      float halo = exp(-d2 / 18.0);
      float far = exp(-d2 / 220.0);
      float beam = exp(-pow(p.x / 1.5, 2.0)) * smoothstep(-2.0, 9.0, p.y);

      vec3 night = vec3(0.004, 0.008, 0.02);
      vec3 steel = vec3(0.16, 0.22, 0.36);
      vec3 silver = vec3(0.78, 0.84, 0.96);
      vec3 cyan = vec3(0.2, 0.6, 0.66);

      vec3 col = night;
      col += steel * far * (0.18 + l * 0.15);
      col += steel * halo * (0.22 + l * 0.45);
      col += silver * core * (0.12 + l * 0.35);
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

// Miroir liquide : reflet troublé par une houle lente et par des ondes circulaires.
const MAX_RIPPLES = 8;
const waterShader = {
  name: "ProspectoWater",
  uniforms: {
    color: { value: null },
    tDiffuse: { value: null },
    textureMatrix: { value: null },
    uTime: { value: 0 },
    uIntensity: { value: 0 },
    uRipples: { value: Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector4(0, 0, -100, 0)) },
    uLight: { value: new THREE.Vector2() },
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
    uniform vec4 uRipples[${MAX_RIPPLES}];
    uniform vec2 uLight;
    varying vec4 vUv;
    varying vec3 vWorld;

    void main() {
      vec2 p = vWorld.xz;
      float t = uTime;
      float w = sin(p.x * 2.1 + t * 0.7) * 0.5
              + sin(p.y * 6.5 - t * 1.2 + p.x * 1.3) * 0.35
              + sin((p.x - p.y) * 11.0 + t * 1.9) * 0.15;
      float near = smoothstep(9.0, 0.0, abs(p.y + 0.5));

      // Ondes circulaires : un front qui s'éloigne et s'amortit.
      vec2 rippleOffset = vec2(0.0);
      float crest = 0.0;
      for (int i = 0; i < ${MAX_RIPPLES}; i++) {
        vec4 r = uRipples[i];
        float age = t - r.z;
        if (age < 0.0 || age > 7.0) continue;
        vec2 d = p - r.xy;
        float dist = length(d);
        float front = age * 1.55;
        float env = exp(-pow((dist - front) * 1.35, 2.0)) * exp(-age * 0.55) * r.w;
        float phase = dist * 8.5 - age * 9.0;
        float h = cos(phase) * env;
        rippleOffset += (d / max(dist, 0.001)) * h;
        crest += max(0.0, sin(phase)) * env;
      }

      vec4 uv = vUv;
      uv.x += (w * 0.010 + rippleOffset.x * 0.05) * uv.w;
      uv.y += (w * (0.018 + 0.03 * (1.0 - near)) + rippleOffset.y * 0.05) * uv.w;
      vec3 refl = texture2DProj(tDiffuse, uv).rgb;

      float toward = exp(-max(vWorld.z, 0.0) * 0.8);
      float side = smoothstep(16.0, 3.0, abs(p.x));
      float sheen = pow(max(0.0, w), 6.0) * 0.05 * near;
      // Reflet de la lumière qui suit le curseur sur la surface.
      float glint = exp(-dot(p - uLight, p - uLight) * 0.35) * (0.5 + 0.5 * w);

      vec3 deep = vec3(0.006, 0.01, 0.022);
      vec3 silver = vec3(0.62, 0.72, 0.92);
      vec3 col = deep + refl * mix(0.06, 0.62, toward) * side;
      col += silver * (sheen + crest * 0.22 + glint * 0.05);
      float haze = smoothstep(-1.5, -8.5, vWorld.z) * smoothstep(30.0, 4.0, abs(p.x));
      col = mix(col, vec3(0.05, 0.075, 0.125), haze * 0.75);
      col *= uIntensity;
      gl_FragColor = vec4(col, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
};

// Éclaboussures : gouttelettes projetées puis retombant sous la gravité.
const splashShader = {
  uniforms: {
    uTime: { value: 0 },
    uBurst: { value: -100 },
    uPixelRatio: { value: 1 },
    uWaterY: { value: 0 },
  },
  vertexShader: /* glsl */ `
    uniform float uTime;
    uniform float uBurst;
    uniform float uPixelRatio;
    uniform float uWaterY;
    attribute vec3 aVel;
    attribute float aSeed;
    varying float vAlpha;
    void main() {
      float age = uTime - uBurst - aSeed * 0.12;
      vec3 p = position + aVel * age + vec3(0.0, -4.9, 0.0) * age * age;
      float alive = step(0.0, age) * step(uWaterY, p.y) * smoothstep(2.6, 1.6, age);
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = (2.5 + aSeed * 7.0) * uPixelRatio * (30.0 / -mv.z) * alive;
      vAlpha = alive;
    }`,
  fragmentShader: /* glsl */ `
    varying float vAlpha;
    void main() {
      vec2 c = gl_PointCoord - 0.5;
      float d = length(c);
      if (d > 0.5) discard;
      // Une goutte : bord lumineux, cœur plus transparent, petit éclat.
      float rim = smoothstep(0.5, 0.36, d) - smoothstep(0.34, 0.1, d) * 0.55;
      float spark = smoothstep(0.16, 0.0, length(c - vec2(-0.14, -0.14)));
      vec3 col = mix(vec3(0.6, 0.72, 0.95), vec3(1.0), spark);
      gl_FragColor = vec4(col, (rim * 0.75 + spark) * vAlpha);
    }`,
};

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

/** Balayage d'une section elliptique d'épaisseur variable le long du tracé du symbole. */
function buildSymbolGeometry(mobile: boolean) {
  const n = mobile ? 150 : 240;
  const m = mobile ? 22 : 34;
  const pts = samplePath(n);
  const positions = new Float32Array(n * m * 3);
  const up = new THREE.Vector3(0, 0, 1);
  const T = new THREE.Vector3();
  const N = new THREE.Vector3();
  const B = new THREE.Vector3();
  const P = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    T.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize();
    N.crossVectors(up, T).normalize();
    B.crossVectors(T, N).normalize();
    const r = radiusAt(i / (n - 1));
    const rw = r;
    const rd = r * 1.28;
    P.set(pts[i][0] + SYMBOL_OFFSET_X, pts[i][1] + 0.06, pts[i][2]);
    for (let j = 0; j < m; j++) {
      const th = (j / m) * Math.PI * 2;
      const k = (i * m + j) * 3;
      positions[k] = P.x + N.x * Math.cos(th) * rw + B.x * Math.sin(th) * rd;
      positions[k + 1] = P.y + N.y * Math.cos(th) * rw + B.y * Math.sin(th) * rd;
      positions[k + 2] = P.z + N.z * Math.cos(th) * rw + B.z * Math.sin(th) * rd;
    }
  }
  const index: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < m; j++) {
      const a = i * m + j;
      const b = i * m + ((j + 1) % m);
      const c = (i + 1) * m + j;
      const d = (i + 1) * m + ((j + 1) % m);
      index.push(a, c, b, b, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setIndex(index);
  geo.computeVertexNormals();
  const tip = new THREE.Vector3(pts[0][0] + SYMBOL_OFFSET_X, pts[0][1] + 0.06, pts[0][2]);
  return { geo, tip };
}

export function createHeroScene(container: HTMLElement, opts: HeroSceneOptions): HeroScene {
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const interactiveRoot = container.parentElement ?? container;

  const renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: false, powerPreference: "high-performance" });
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
  const lookAt = new THREE.Vector3();

  // Fond : lumière liquide calculée dans une petite texture partagée par tous les rendus.
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

  // Tout ce qui est sous la surface de l'eau est masqué.
  const surfaceClip = new THREE.Plane(new THREE.Vector3(0, 1, 0), -WATER_Y);

  // Le symbole
  const timeUniform = { value: 0 };
  const pulseUniform = { value: 0 };
  const pMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#eef3fb"),
    metalness: 0,
    roughness: 0.05,
    transmission: 1,
    thickness: 1.1,
    ior: 1.45,
    iridescence: 0.45,
    iridescenceIOR: 1.25,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    attenuationColor: new THREE.Color("#93abd9"),
    attenuationDistance: 2.2,
    specularIntensity: 1,
    envMapIntensity: 1.25,
    clippingPlanes: [surfaceClip],
  });
  pMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = timeUniform;
    shader.uniforms.uPulse = pulseUniform;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uTime;\nuniform float uPulse;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
         // Surface vivante : de lentes ondulations parcourent la matière.
         float wave = sin(position.y * 2.6 - uTime * 1.4) * 0.018
                    + sin(position.x * 3.1 + position.y * 1.7 + uTime * 0.9) * 0.012;
         transformed += normal * (wave + uPulse * 0.06 * sin(position.y * 6.0 - uTime * 8.0));`,
      );
  };

  const symbolGroup = new THREE.Group();
  const { geo: pGeo, tip } = buildSymbolGeometry(mobile);
  const pMesh = new THREE.Mesh<THREE.BufferGeometry, THREE.Material>(pGeo, pMat);
  symbolGroup.add(pMesh);

  // Le cœur : une goutte de lumière en suspension dans la boucle.
  const coreMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#e9f0ff"),
    emissive: new THREE.Color("#9cbcff"),
    emissiveIntensity: 0,
    roughness: 0.15,
    metalness: 0.1,
    clippingPlanes: [surfaceClip],
  });
  const coreMesh = new THREE.Mesh(new THREE.SphereGeometry(SYMBOL_CORE.r, 40, 28), coreMat);
  const corePos = new THREE.Vector3(SYMBOL_CORE.x + SYMBOL_OFFSET_X, SYMBOL_CORE.y + 0.06, 0.18);
  coreMesh.position.copy(corePos);
  symbolGroup.add(coreMesh);
  const glowMat = new THREE.SpriteMaterial({
    map: radialTexture(),
    color: new THREE.Color("#bcd2ff"),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0,
  });
  const glow = new THREE.Sprite(glowMat);
  glow.scale.set(1.9, 1.9, 1);
  glow.position.copy(corePos).add(new THREE.Vector3(0, 0, -0.4));
  symbolGroup.add(glow);
  scene.add(symbolGroup);

  // La masse d'eau qui se rassemble puis se retire : une peau liquide translucide
  // (bord lumineux, cœur transparent) qui laisse voir le symbole émerger à l'intérieur.
  const domeMat = new THREE.ShaderMaterial({
    uniforms: { uTime: timeUniform, uOpacity: { value: 1 } },
    transparent: true,
    depthWrite: false,
    clipping: true,
    clippingPlanes: [surfaceClip],
    vertexShader: /* glsl */ `
      #include <clipping_planes_pars_vertex>
      uniform float uTime;
      varying vec3 vN;
      varying vec3 vView;
      varying float vH;
      void main() {
        vec3 p = position;
        float n = sin(p.x * 2.6 + uTime * 2.4) * sin(p.y * 2.2 - uTime * 1.9) * sin(p.z * 2.8 + uTime * 1.5);
        float swirl = sin(p.y * 5.0 - uTime * 4.0) * 0.04;
        p += normal * (n * 0.17 + swirl);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vN = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        vH = position.y;
        #include <begin_vertex>
        #include <project_vertex>
        gl_Position = projectionMatrix * mv;
        #include <clipping_planes_vertex>
      }`,
    fragmentShader: /* glsl */ `
      #include <clipping_planes_pars_fragment>
      uniform float uOpacity;
      varying vec3 vN;
      varying vec3 vView;
      varying float vH;
      void main() {
        #include <clipping_planes_fragment>
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vView))), 2.2);
        vec3 l = normalize(vec3(0.4, 0.8, 0.5));
        vec3 h = normalize(l + normalize(vView));
        float spec = pow(max(dot(normalize(vN), h), 0.0), 60.0);
        vec3 deep = vec3(0.08, 0.13, 0.24);
        vec3 silver = vec3(0.75, 0.84, 1.0);
        vec3 col = mix(deep, silver, f) + spec * 0.9;
        float a = (0.12 + f * 0.7 + spec) * uOpacity;
        gl_FragColor = vec4(col, a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1, mobile ? 40 : 64, mobile ? 28 : 48), domeMat);
  dome.position.set(0, WATER_Y, 0.1);
  dome.scale.set(0.001, 0.001, 0.001);
  scene.add(dome);

  // Goutte qui se détache régulièrement de la pointe du symbole.
  const dropMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#dfe8fb"),
    roughness: 0.05,
    metalness: 0.4,
    emissive: new THREE.Color("#2b3f66"),
  });
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), dropMat);
  drop.visible = false;
  scene.add(drop);

  // Lumières
  const key = new THREE.DirectionalLight("#e8efff", 0);
  key.position.set(4, 6, 5);
  scene.add(key);
  const rim = new THREE.PointLight("#7fd4e0", 0, 14, 1.6);
  rim.position.set(-3.5, 1.5, -2.5);
  scene.add(rim);
  // Lumière qui suit le curseur : elle déplace les reflets sur le verre et sur l'eau.
  const cursorLight = new THREE.PointLight("#dfe9ff", 0, 12, 1.4);
  cursorLight.position.set(1.5, 1.5, 3.5);
  scene.add(cursorLight);

  // Eau
  const reflScale = mobile ? 0.3 : 0.4;
  const water = new Reflector(new THREE.PlaneGeometry(140, 90), {
    clipBias: 0.003,
    textureWidth: Math.round(window.innerWidth * dpr * reflScale),
    textureHeight: Math.round(window.innerHeight * dpr * reflScale),
    color: new THREE.Color(0x8899aa),
    multisample: 0,
    shader: waterShader,
  });
  const waterUniforms = (water.material as THREE.ShaderMaterial).uniforms;
  // Dans le reflet (flou), un verre simplifié suffit : pas de seconde passe de réfraction.
  const reflMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#c9d6ee"),
    roughness: 0.15,
    metalness: 0.2,
    transparent: true,
    opacity: 0.5,
    emissive: new THREE.Color("#2a3a5c"),
  });
  const reflectorRender = water.onBeforeRender;
  water.onBeforeRender = function (...args: Parameters<typeof reflectorRender>) {
    pMesh.material = reflMat;
    const domeVisible = dome.visible;
    dome.visible = false;
    particles.visible = false;
    splash.visible = false;
    reflectorRender.apply(this, args);
    pMesh.material = pMat;
    dome.visible = domeVisible;
    particles.visible = true;
    splash.visible = true;
  };
  water.rotation.x = -Math.PI / 2;
  water.position.y = WATER_Y;
  scene.add(water);

  // Ondes : tampon circulaire de sources (x, z, instant, amplitude).
  let rippleCursor = 0;
  const clock0 = performance.now();
  const now = () => (performance.now() - clock0) / 1000;
  function ripple(x: number, z: number, amp: number) {
    const r = waterUniforms.uRipples.value[rippleCursor] as THREE.Vector4;
    r.set(x, z, now(), amp);
    rippleCursor = (rippleCursor + 1) % MAX_RIPPLES;
  }

  // Particules d'ambiance
  const count = mobile ? 200 : coarse ? 320 : 480;
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
  const partGeo = new THREE.BufferGeometry();
  partGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  partGeo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  const partMat = new THREE.ShaderMaterial({
    ...particleShader,
    uniforms: THREE.UniformsUtils.clone(particleShader.uniforms),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  partMat.uniforms.uPixelRatio.value = dpr;
  const particles = new THREE.Points(partGeo, partMat);
  scene.add(particles);

  // Éclaboussures
  const sCount = mobile ? 150 : 280;
  const sPos = new Float32Array(sCount * 3);
  const sVel = new Float32Array(sCount * 3);
  const sSeed = new Float32Array(sCount);
  for (let i = 0; i < sCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const rr = 0.4 + Math.random() * 1.1;
    sPos[i * 3] = Math.cos(a) * rr * 0.9;
    sPos[i * 3 + 1] = WATER_Y + 0.4 + Math.random() * 2.6;
    sPos[i * 3 + 2] = Math.sin(a) * rr * 0.6 + 0.1;
    const out = 1.2 + Math.random() * 3.2;
    sVel[i * 3] = Math.cos(a) * out;
    sVel[i * 3 + 1] = 1.5 + Math.random() * 4.2;
    sVel[i * 3 + 2] = Math.sin(a) * out * 0.7;
    sSeed[i] = Math.random();
  }
  const splashGeo = new THREE.BufferGeometry();
  splashGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
  splashGeo.setAttribute("aVel", new THREE.BufferAttribute(sVel, 3));
  splashGeo.setAttribute("aSeed", new THREE.BufferAttribute(sSeed, 1));
  const splashMat = new THREE.ShaderMaterial({
    ...splashShader,
    uniforms: THREE.UniformsUtils.clone(splashShader.uniforms),
    transparent: true,
    depthWrite: false,
  });
  splashMat.uniforms.uPixelRatio.value = dpr;
  splashMat.uniforms.uWaterY.value = WATER_Y;
  const splash = new THREE.Points(splashGeo, splashMat);
  splash.frustumCulled = false;
  scene.add(splash);

  // Dimensionnement et cadrage
  const HOVER = 0.42;
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const a = camera.aspect;
    const pFrac = a < 0.75 ? 0.26 : a < 1.2 ? 0.31 : 0.35;
    const centerFrac = a < 0.75 ? 0.27 : a < 1.2 ? 0.29 : 0.31;
    let visibleH = (SYMBOL_HEIGHT + HOVER) / pFrac;
    const minVisibleW = 3.2 * 2.5;
    if (visibleH * a < minVisibleW) visibleH = minVisibleW / a;
    const dist = visibleH / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const eyeY = 1.1;
    camera.position.set(0, eyeY, dist);
    lookAt.set(0, HOVER / 2 - (0.5 - centerFrac) * visibleH + eyeY * 0.15, 0);
    camera.lookAt(lookAt);
    camera.updateProjectionMatrix();
    water.getRenderTarget().setSize(Math.round(w * quality * reflScale), Math.round(h * quality * reflScale));
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // Interactions
  const mouse = new THREE.Vector2();
  const target = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const waterPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -WATER_Y);
  const hit = new THREE.Vector3();
  const ndc = new THREE.Vector2();
  let introDone = false;

  function toNdc(e: PointerEvent) {
    const r = container.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    return ndc;
  }
  function onPointer(e: PointerEvent) {
    const n = toNdc(e);
    target.set(n.x, n.y);
  }
  let pulse = 0;
  function onPress(e: PointerEvent) {
    if (!introDone || opts.reducedMotion) return;
    if ((e.target as HTMLElement | null)?.closest("a, button, input, textarea, select")) return;
    raycaster.setFromCamera(toNdc(e), camera);
    if (raycaster.intersectObject(pMesh, false).length) {
      // Toucher le symbole : la matière vibre et une onde part de sa base.
      pulse = 1;
      ripple(tipWorld.x, tipWorld.z, 1.0);
      return;
    }
    if (raycaster.ray.intersectPlane(waterPlane, hit) && Math.abs(hit.z) < 30) {
      ripple(hit.x, hit.z, 0.9);
    }
  }
  if (!opts.reducedMotion && !coarse) window.addEventListener("pointermove", onPointer, { passive: true });
  if (!opts.reducedMotion) interactiveRoot.addEventListener("pointerdown", onPress);

  // État animé
  const state = {
    back: 0, env: 0, part: 0, water: 0, key: 0, core: 0,
    rise: -5.6, domeX: 0.001, domeY: 0.001,
  };
  const apply = () => {
    backdropMat.uniforms.uIntensity.value = state.back;
    scene.environmentIntensity = state.env;
    partMat.uniforms.uOpacity.value = state.part;
    waterUniforms.uIntensity.value = state.water;
    key.intensity = state.key * 2.2;
    rim.intensity = state.key * 9;
    cursorLight.intensity = state.key * 6;
    coreMat.emissiveIntensity = state.core * 2.2;
    glowMat.opacity = state.core * 0.55;
    dome.scale.set(state.domeX, state.domeY, state.domeX * 0.75);
    dome.visible = state.domeY > 0.01;
  };

  const tipWorld = new THREE.Vector3();
  const DRIP_PERIOD = 4.6;
  let lastDrip = -1;

  function frame() {
    const t = now();
    const tm = opts.reducedMotion ? 0 : t;
    timeUniform.value = tm;
    backdropMat.uniforms.uTime.value = t;
    waterUniforms.uTime.value = t;
    partMat.uniforms.uTime.value = tm;
    splashMat.uniforms.uTime.value = t;

    mouse.lerp(target, 0.05);
    backdropMat.uniforms.uMouse.value.copy(mouse);
    const idle = opts.reducedMotion ? 0 : Math.sin(t * 0.32) * 0.1;
    symbolGroup.rotation.y = idle + mouse.x * 0.35;
    symbolGroup.rotation.x = -mouse.y * 0.08;
    const bob = opts.reducedMotion || !introDone ? 0 : Math.sin(t * 0.7) * 0.05;
    symbolGroup.position.y = state.rise + bob;
    cursorLight.position.set(mouse.x * 5, 1.2 + mouse.y * 2.5, 3.5);
    waterUniforms.uLight.value.set(mouse.x * 3.5, 1.5 - mouse.y * 1.5);

    pulse *= 0.94;
    pulseUniform.value = pulse;
    coreMesh.position.y = corePos.y + (opts.reducedMotion ? 0 : Math.sin(t * 1.3) * 0.05);
    const breathe = 1 + (opts.reducedMotion ? 0 : Math.sin(t * 1.3) * 0.08) + pulse * 0.5;
    glow.scale.set(1.9 * breathe, 1.9 * breathe, 1);

    // Goutte : naît à la pointe, se détache, tombe, et laisse une onde.
    symbolGroup.updateMatrixWorld();
    tipWorld.copy(tip).applyMatrix4(symbolGroup.matrixWorld);
    if (introDone && !opts.reducedMotion) {
      const phase = (t % DRIP_PERIOD) / DRIP_PERIOD;
      const cycle = Math.floor(t / DRIP_PERIOD);
      const growEnd = 0.78;
      drop.visible = true;
      if (phase < growEnd) {
        const g = phase / growEnd;
        const s = g * g;
        drop.scale.set(s, s * (1 + g * 0.4), s);
        drop.position.set(tipWorld.x, tipWorld.y - 0.04 - s * 0.05, tipWorld.z);
      } else {
        const fall = ((phase - growEnd) * DRIP_PERIOD);
        const y = tipWorld.y - 0.09 - 4.9 * fall * fall;
        drop.scale.set(1, 1.25, 1);
        drop.position.set(tipWorld.x, y, tipWorld.z);
        if (y <= WATER_Y) {
          drop.visible = false;
          if (lastDrip !== cycle) {
            lastDrip = cycle;
            ripple(tipWorld.x, tipWorld.z, 0.55);
          }
        }
      }
    } else {
      drop.visible = false;
    }

    renderer.setRenderTarget(liquidRT);
    renderer.render(liquidScene, liquidCam);
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }

  // Boucle de rendu, en pause hors écran ou onglet masqué ; qualité adaptative.
  let raf = 0;
  let visible = true;
  let running = document.visibilityState === "visible";
  let last = performance.now();
  const deltas: number[] = [];
  const debug = new URLSearchParams(location.search).has("debug3d");
  function adapt(nowMs: number) {
    if (debug) return;
    if (!document.hasFocus()) {
      last = nowMs;
      deltas.length = 0;
      return;
    }
    deltas.push(nowMs - last);
    last = nowMs;
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

  function cleanup() {
    cancelAnimationFrame(raf);
    tl?.kill();
    ro.disconnect();
    io.disconnect();
    window.removeEventListener("pointermove", onPointer);
    interactiveRoot.removeEventListener("pointerdown", onPress);
    document.removeEventListener("visibilitychange", onVis);
    const dispose = (o: THREE.Object3D) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose?.();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose?.();
    };
    scene.traverse(dispose);
    liquidScene.traverse(dispose);
    pMat.dispose();
    reflMat.dispose();
    glowMat.map?.dispose();
    water.dispose();
    envTex.dispose();
    liquidRT.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  }

  let tl: gsap.core.Timeline | null = null;

  if (opts.reducedMotion) {
    Object.assign(state, { back: 1, env: 1, part: 0.8, water: 1, key: 1, core: 0.7, rise: HOVER, domeX: 0.001, domeY: 0.001 });
    introDone = true;
    apply();
    frame();
    opts.onReady?.();
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

  // Chorégraphie d'arrivée : obscurité, eau qui ondule, masse qui se rassemble,
  // émergence du symbole, éclaboussures, retrait de l'eau, suspension.
  apply();
  gsap.ticker.lagSmoothing(0);
  tl = gsap.timeline({ onUpdate: apply, defaults: { ease: "power2.out" } });
  tl.to(state, { back: 1, water: 1, duration: 1.6, ease: "power1.inOut" }, 0)
    .call(() => ripple(0, 0.1, 0.45), [], 0.35)
    .call(() => ripple(0.2, 0.0, 0.5), [], 0.8)
    .to(state, { part: 1, duration: 1.4 }, 0.4)
    .to(state, { env: 0.45, duration: 1.0 }, 0.6)
    // La masse d'eau se soulève et s'élève en colonne
    .to(state, { domeX: 1.35, domeY: 1.5, duration: 0.9, ease: "power2.inOut" }, 0.6)
    .to(state, { domeX: 2.15, domeY: 4.8, duration: 0.95, ease: "power2.inOut" }, 1.4)
    // Le symbole émerge à l'intérieur de la colonne
    .to(state, { rise: HOVER, duration: 1.25, ease: "power2.inOut" }, 1.45)
    // Rupture : l'eau éclate et retombe
    .call(() => {
      splashMat.uniforms.uBurst.value = now();
      ripple(0, 0.1, 1.2);
      pulse = 1;
    }, [], 2.35)
    .to(state, { domeY: 0.001, domeX: 2.8, duration: 0.45, ease: "power2.in" }, 2.35)
    .set(state, { domeX: 0.001 }, 2.85)
    .call(() => ripple(0.6, 0.6, 0.7), [], 2.8)
    // Lumière
    .to(state, { env: 1, key: 1, duration: 1.1, ease: "power3.out" }, 2.45)
    .to(state, { core: 1, duration: 1.2 }, 2.55)
    .call(() => {
      introDone = true;
      opts.onReady?.();
    }, [], 3.1);

  if (debug) {
    // Outil de test : ?debug3d expose la chronologie pour figer une image précise.
    (window as unknown as Record<string, unknown>).__hero = {
      frame,
      state,
      seek(p: number) {
        tl?.pause();
        tl?.progress(p);
        apply();
        if (p >= 1) introDone = true;
        frame();
      },
    };
  }
  raf = requestAnimationFrame(loop);
  return { destroy: cleanup };
}
