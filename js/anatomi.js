import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { LAYERS, LAYER_INFO, PARTS, layerLabel } from "./robots.js?v=30";
import { createStage } from "./robot-model.js?v=30";
import { createOptimus } from "./robot-optimus.js?v=2";

const ACCENT = 0x0066cc;
const CAM_POS = new THREE.Vector3(1.45, 1.18, 2.55);
const CAM_TARGET = new THREE.Vector3(0, 0.86, 0);
const EXPLODE_MS = 700;
const CAM_MS = 500;
const XRAY_MS = 280;
const XRAY_TINT = {
  skeleton: 0x7f93a8,
  hands: 0x9fd4d8,
  sensors: 0x0a84ff,
  power: 0xc4843a,
  compute: 0xc8c0d8,
};

let runtime = null;

function prefersReduced() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function appleEase(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function checkSvg() {
  return `<svg class="ri-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function partMeta(id) {
  return PARTS[id] || { name: id, layer: "shell", fn: "" };
}

export function unmountAnatomi() {
  if (!runtime) return;
  cancelAnimationFrame(runtime.raf);
  runtime.ro?.disconnect();
  window.removeEventListener("keydown", runtime.onKey);
  try {
    runtime.sfApi?.stop?.();
  } catch {
    /* ignore */
  }
  runtime.sfIframe?.remove();
  runtime.mixer?.stopAllAction();
  runtime.model?.dispose();
  runtime.stage?.userData.dispose?.();
  runtime.controls?.dispose();
  runtime.composer?.dispose();
  runtime.envTex?.dispose();
  runtime.pmrem?.dispose();
  runtime.renderer?.dispose();
  runtime.renderer?.domElement?.remove();
  runtime = null;
}

export function mountAnatomi(root) {
  unmountAnatomi();

  const state = {
    selected: null,
    selectedLayer: null,
    exploded: false,
    xray: false,
    explodeT: 0,
    explodeFrom: 0,
    explodeTo: 0,
    explodeClock: 0,
    camReset: false,
    camFrom: new THREE.Vector3(),
    camTo: CAM_POS.clone(),
    targetFrom: new THREE.Vector3(),
    targetTo: CAM_TARGET.clone(),
    camClock: 0,
    layers: Object.fromEntries(LAYERS.map((l) => [l.id, true])),
    hidden: new Set(),
    hover: null,
    knit: "home",
  };

  root.innerHTML = `
    <div class="ri">
      <a class="ri-skip" href="#robot-viewport">Spring til 3D-visning</a>
      <header class="ri-top">
        <h1>Robotinspektion</h1>
        <div class="ri-modes" role="toolbar" aria-label="Visning">
          <button type="button" class="ri-seg" data-tool="explode" aria-pressed="false">Eksploderet view</button>
          <button type="button" class="ri-seg" data-tool="xray" aria-pressed="false">Røntgen</button>
          <button type="button" class="ri-seg" data-tool="reset">Reset kamera</button>
        </div>
        <div class="ri-top-right">
          <button type="button" class="ri-text" data-help>Hjælp</button>
          <button type="button" class="ri-text" data-full>Fuld skærm</button>
        </div>
      </header>
      <div class="ri-layers" role="group" aria-label="Systemlag">
        ${LAYERS.map(
          (l, i) => `<button type="button" class="ri-chip is-on" data-layer="${l.id}" aria-pressed="true">
            ${checkSvg()}<span class="ri-chip-label">${l.label}</span>
            <span class="ri-chip-state">Aktiv</span>
            <span class="ri-sr">tast ${i + 1}</span>
          </button>`
        ).join("")}
      </div>
      <main class="ri-stage">
        <div id="robot-viewport" class="ri-canvas" tabindex="0" role="application" aria-label="3D-robotinspektion. Træk for at dreje, rul for at zoome."></div>
        <p class="ri-hint" data-hint>Træk for at dreje · Rul for at zoome</p>
        <p class="ri-caption" data-caption></p>
        <p class="ri-credit">Tesla BOT — eMirage, Sketchfab</p>
        <div class="ri-hover" data-hover hidden></div>
        <aside class="ri-sheet" data-sheet hidden role="complementary" aria-label="Komponent"></aside>
        <div class="ri-legend" data-legend hidden>
          ${LAYERS.map((l) => `<span><i style="background:${l.swatch}"></i>${l.label}</span>`).join("")}
        </div>
      </main>
      <div class="ri-help" data-help-dlg hidden>
        <div class="ri-help-card" role="dialog" aria-labelledby="ri-help-title" aria-modal="true">
          <h2 id="ri-help-title">Tastatur</h2>
          <dl>
            <dt>1–6</dt><dd>Lag</dd>
            <dt>E</dt><dd>Eksploderet view</dd>
            <dt>X</dt><dd>Røntgen</dd>
            <dt>R</dt><dd>Reset kamera</dd>
            <dt>F</dt><dd>Fokuser valgt del</dd>
            <dt>Esc</dt><dd>Fravælg</dd>
            <dt>← → / J L</dt><dd>Drej</dd>
          </dl>
          <div class="ri-actions"><button type="button" class="ri-btn" data-help-close>Luk</button></div>
        </div>
      </div>
      <div class="ri-live" data-live aria-live="polite" aria-atomic="true"></div>
    </div>`;

  const canvasHost = root.querySelector("#robot-viewport");
  const hint = root.querySelector("[data-hint]");
  const hoverEl = root.querySelector("[data-hover]");
  const sheet = root.querySelector("[data-sheet]");
  const legend = root.querySelector("[data-legend]");
  const live = root.querySelector("[data-live]");
  const caption = root.querySelector("[data-caption]");
  const helpDlg = root.querySelector("[data-help-dlg]");
  const modes = root.querySelector(".ri-modes");
  const layerRow = root.querySelector(".ri-layers");

  const reduced = prefersReduced();

  function announce(extra) {
    const bits = [];
    if (extra) bits.push(extra);
    bits.push(state.exploded ? "Eksploderet view slået til." : "Samlet view.");
    if (state.xray) bits.push("Røntgen slået til. Ydre skal gennemsigtig.");
    const off = LAYERS.filter((l) => !state.layers[l.id]).map((l) => l.label);
    if (off.length) bits.push(off.map((n) => `${n} skjult.`).join(" "));
    live.textContent = bits.join(" ");
    if (caption) {
      const on = LAYERS.filter((l) => state.layers[l.id]).map((l) => l.label).join(", ");
      caption.textContent = `${state.exploded ? "Eksploderet. " : ""}${state.xray ? "Røntgen. " : ""}Synlige lag: ${on || "ingen"}.`;
    }
  }

  function paintModes() {
    for (const btn of modes.querySelectorAll("[data-tool]")) {
      const tool = btn.dataset.tool;
      if (tool === "explode" || tool === "xray") {
        const on = tool === "explode" ? state.exploded : state.xray;
        btn.setAttribute("aria-pressed", on ? "true" : "false");
        btn.classList.toggle("is-on", on);
      }
    }
    legend.hidden = !(state.exploded || state.xray);
  }

  function paintLayers() {
    for (const btn of layerRow.querySelectorAll("[data-layer]")) {
      const on = state.layers[btn.dataset.layer];
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.classList.toggle("is-on", on);
      const st = btn.querySelector(".ri-chip-state");
      if (st) st.textContent = on ? "Aktiv" : "";
    }
  }

  function paintSheet() {
    const partId = state.selected;
    const layerId = partId ? partMeta(partId).layer : state.selectedLayer;
    if (!partId && !layerId) {
      sheet.hidden = true;
      sheet.innerHTML = "";
      return;
    }
    const hidden = partId ? state.hidden.has(partId) : false;
    const info = partId ? partMeta(partId) : LAYER_INFO[layerId];
    const sys = partId ? layerLabel(info.layer) : info.name;
    const status = hidden ? "Skjult" : "OK";
    const statusCls = hidden ? "is-hidden" : "is-ok";
    sheet.hidden = false;
    sheet.innerHTML = `
      <div class="ri-sheet-kicker">${sys}</div>
      <h2>${partId ? info.name : info.name}</h2>
      <p>${info.fn}</p>
      <p class="ri-status ${statusCls}">Status: ${status}</p>
      ${
        partId
          ? `<div class="ri-actions">
              <button type="button" class="ri-btn" data-act="focus">Fokuser</button>
              <button type="button" class="ri-btn" data-act="hide">${hidden ? "Vis del" : "Skjul del"}</button>
            </div>`
          : ""
      }`;
  }

  /* 1:1 — eMirage Tesla BOT on Sketchfab (uid 2421eadea6164f19b22451e5abf0578d). Not a copy. */
  const SF_UID = "2421eadea6164f19b22451e5abf0578d";
  if (caption) caption.textContent = "Tesla BOT — eMirage, Sketchfab";

  const iframe = document.createElement("iframe");
  iframe.title = "Tesla BOT af eMirage på Sketchfab";
  iframe.allow = "autoplay; fullscreen; xr-spatial-tracking";
  iframe.setAttribute("allowfullscreen", "");
  canvasHost.appendChild(iframe);

  let sfApi = null;
  const sfNodes = [];
  const sfMats = [];

  function sfExplode(on) {
    if (!sfApi || !sfNodes.length) return;
    for (const n of sfNodes) {
      const x = n.m[12] || 0;
      const y = n.m[13] || 0;
      const z = n.m[14] || 0;
      const len = Math.hypot(x, y, z) || 1;
      const d = on ? 0.45 : 0;
      sfApi.translate(n.id, [(x / len) * d, (y / len) * d, (z / len) * d], {
        duration: 0.65,
        easing: "easeOutQuad",
      });
    }
  }

  function sfXray(on) {
    if (!sfApi) return;
    for (const mat of sfMats) {
      if (!mat.channels) continue;
      if (!mat.channels.Opacity) mat.channels.Opacity = { enable: true, factor: 1, type: "alphaBlend" };
      mat.channels.Opacity.enable = on;
      mat.channels.Opacity.factor = on ? 0.22 : 1;
      sfApi.setMaterial(mat);
    }
  }

  function loadSf(done) {
    if (window.Sketchfab) return done();
    const s = document.createElement("script");
    s.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
    s.onload = done;
    document.head.appendChild(s);
  }

  loadSf(() => {
    const client = new window.Sketchfab("1.12.1", iframe);
    client.init(SF_UID, {
      autostart: 1,
      autospin: 0,
      ui_infos: 0,
      ui_watermark: 1,
      ui_controls: 1,
      ui_inspector: 0,
      ui_settings: 0,
      ui_vr: 0,
      ui_help: 0,
      ui_hint: 0,
      ui_stop: 0,
      camera: 0,
      success(api) {
        sfApi = api;
        if (runtime) runtime.sfApi = api;
        api.start();
        api.addEventListener("viewerready", () => {
          api.setBackground({ color: [0.96, 0.96, 0.97] });
          const idleCam = () => {
            api.setCameraLookAt([0, 1.05, 3.15], [0, 0.9, 0], 0);
          };
          const poseArmsDown = () => {
            api.getNodeMap((err, nodes) => {
              if (err || !nodes) return;
              for (const n of Object.values(nodes)) {
                if (n.type !== "MatrixTransform" || !n.instanceID) continue;
                const name = String(n.name || "")
                  .toLowerCase()
                  .replace(/mixamorig:?/g, "")
                  .replace(/[^a-z0-9]/g, "");
                const deg = (d, ax, ay, az) =>
                  api.rotate(n.instanceID, [(d * Math.PI) / 180, ax, ay, az], { duration: 0 });
                if (name === "leftarm" || name === "leftupperarm") deg(80, 0, 0, -1);
                else if (name === "rightarm" || name === "rightupperarm") deg(80, 0, 0, 1);
                else if (name === "leftforearm") deg(14, 0, 0, -1);
                else if (name === "rightforearm") deg(14, 0, 0, 1);
              }
            });
          };
          const afterAnims = (err, anims) => {
            const list = !err && Array.isArray(anims) ? anims : [];
            const idle = list.find((a) => /idle|stand|wait/i.test(String(a?.[1] ?? a?.name ?? a?.label ?? a)));
            if (idle) {
              const uid = Array.isArray(idle) ? idle[0] : idle.uid;
              if (uid) api.setCurrentAnimationByUID(uid);
              api.pause?.();
              api.seekTo?.(0);
            } else {
              poseArmsDown();
            }
            idleCam();
          };
          if (api.getAnimations) api.getAnimations(afterAnims);
          else if (api.getAnimationList) api.getAnimationList(afterAnims);
          else {
            poseArmsDown();
            idleCam();
          }
          setTimeout(() => {
            poseArmsDown();
            idleCam();
          }, 400);
          api.getNodeMap((err, nodes) => {
            if (err || !nodes) return;
            const list = Object.values(nodes).filter((n) => n.type === "MatrixTransform" && n.instanceID);
            list.forEach((n) => {
              api.getMatrix(n.instanceID, (e, m) => {
                if (!e && m) sfNodes.push({ id: n.instanceID, name: n.name, m: Array.from(m) });
              });
            });
          });
          api.getMaterialList((err, materials) => {
            if (!err && materials) sfMats.push(...materials);
          });
          announce("Tesla BOT — eMirage, Sketchfab.");
        });
      },
      error() {
        announce("Sketchfab-embed blokeret. Stop — ingen kopi-skulptur.");
      },
    });
  });

  modes.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tool]");
    if (!btn) return;
    if (btn.dataset.tool === "reset") {
      sfApi?.setCameraLookAt?.([0, 1.05, 3.15], [0, 0.9, 0], 0.45);
      sfExplode(false);
      state.exploded = false;
      state.xray = false;
      paintModes();
      announce("Kamera nulstillet.");
      return;
    }
    if (btn.dataset.tool === "explode") {
      state.exploded = !state.exploded;
      sfExplode(state.exploded);
      paintModes();
      announce(state.exploded ? "Eksploderet view slået til." : "Eksploderet view slået fra.");
    }
    if (btn.dataset.tool === "xray") {
      state.xray = !state.xray;
      sfXray(state.xray);
      paintModes();
      announce(state.xray ? "Røntgen slået til." : "Røntgen slået fra.");
    }
  });

  layerRow.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-layer]");
    if (!btn) return;
    const id = btn.dataset.layer;
    state.layers[id] = !state.layers[id];
    paintLayers();
    announce();
  });

  root.querySelector("[data-help]")?.addEventListener("click", () => {
    helpDlg.hidden = false;
  });
  root.querySelector("[data-help-close]")?.addEventListener("click", () => {
    helpDlg.hidden = true;
  });
  root.querySelector("[data-full]")?.addEventListener("click", () => {
    if (!document.fullscreenElement) root.querySelector(".ri")?.requestFullscreen?.();
    else document.exitFullscreen?.();
  });

  function onKey(e) {
    if (e.key === "Escape") helpDlg.hidden = true;
    if (e.key.toLowerCase() === "e") {
      state.exploded = !state.exploded;
      sfExplode(state.exploded);
      paintModes();
    }
    if (e.key.toLowerCase() === "x") {
      state.xray = !state.xray;
      sfXray(state.xray);
      paintModes();
    }
    if (e.key.toLowerCase() === "r") sfApi?.setCameraLookAt?.([0, 1.05, 3.15], [0, 0.9, 0], 0.45);
  }
  window.addEventListener("keydown", onKey);
  hint?.addEventListener("pointerdown", () => {
    hint.hidden = true;
  }, { once: true });

  paintModes();
  paintLayers();
  runtime = { root, sfApi, sfIframe: iframe, onKey };
  return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f7);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 40);
  camera.position.copy(CAM_POS);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);
  canvasHost.appendChild(renderer.domElement);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  const envTex = pmrem.fromScene(envScene, 0.04).texture;
  scene.environment = envTex;
  envScene.dispose?.();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 0.32;
  controls.maxDistance = 5.5;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.target.copy(CAM_TARGET);
  controls.update();

  const key = new THREE.DirectionalLight(0xffffff, 1.25);
  key.position.set(-2.4, 2.8, 2.2);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 14;
  key.shadow.camera.left = -2.2;
  key.shadow.camera.right = 2.2;
  key.shadow.camera.top = 3.2;
  key.shadow.camera.bottom = -0.4;
  key.shadow.bias = -0.00025;
  key.shadow.normalBias = 0.025;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xdce3ee, 0.45);
  rim.position.set(2.4, 1.8, -2.2);
  scene.add(rim);

  const fill = new THREE.DirectionalLight(0xf5f5f7, 0.28);
  fill.position.set(1.4, 1.2, 2.4);
  scene.add(fill);

  const hemi = new THREE.HemisphereLight(0xf5f5f7, 0x9a9aa0, 0.22);
  scene.add(hemi);

  const stage = createStage();
  scene.add(stage);

  const model = createOptimus();
  scene.add(model.root);
  if (caption) caption.textContent = "Inspireret af Tesla BOT · eMirage · Sketchfab. Eksploderet view skiller delene.";
  const origMat = new Map();
  let mixer = null;
  for (const obj of model.pickables) {
    const m = obj.material;
    if (!m) continue;
    origMat.set(obj, {
      color: m.color?.clone?.() ?? null,
      emissive: m.emissive?.clone?.() ?? null,
      emissiveIntensity: m.emissiveIntensity,
      opacity: m.opacity,
      transparent: m.transparent,
      depthWrite: m.depthWrite,
      transmission: m.transmission,
    });
  }

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  const outlinePass = new OutlinePass(new THREE.Vector2(1, 1), scene, camera);
  outlinePass.edgeStrength = 2.4;
  outlinePass.edgeGlow = 0.25;
  outlinePass.edgeThickness = 1.1;
  outlinePass.visibleEdgeColor.set(ACCENT);
  outlinePass.hiddenEdgeColor.set(0x0a3d7a);
  outlinePass.pulsePeriod = reduced ? 0 : 0;
  composer.addPass(outlinePass);
  composer.addPass(new OutputPass());

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const clock = new THREE.Clock();

  function fit() {
    const w = canvasHost.clientWidth || 1;
    const h = canvasHost.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    outlinePass.resolution.set(w, h);
  }

  function meshesOf(partId) {
    return model.pickables.filter((m) => m.userData.part === partId);
  }

  function applyVisibility() {
    const ghostShell = state.xray;
    const hideShellTravel = reduced && state.exploded;
    for (const obj of model.pickables) {
      const { part, layer } = obj.userData;
      const layerOn = state.layers[layer] !== false;
      const partOn = !state.hidden.has(part);
      const hideAsShell = hideShellTravel && layer === "shell";
      const hideTendons = layer === "hands" && /tendon/i.test(part) && state.layers.shell && !state.exploded && !state.xray;
      obj.visible = layerOn && partOn && !hideAsShell && !hideTendons;

      const mat = obj.material;
      const orig = origMat.get(obj);
      if (!mat || !orig) continue;

      if (orig.color && mat.color && layer !== "shell") mat.color.copy(orig.color);
      if (orig.emissive && mat.emissive) mat.emissive.copy(orig.emissive);
      if (orig.emissiveIntensity != null) mat.emissiveIntensity = orig.emissiveIntensity;
      mat.opacity = orig.opacity ?? 1;
      mat.transparent = orig.transparent ?? false;
      mat.depthWrite = orig.depthWrite ?? true;
      if ("transmission" in mat && orig.transmission != null) mat.transmission = orig.transmission;

      if (!obj.visible) continue;

      if (ghostShell && layer === "shell") {
        mat.transparent = true;
        mat.opacity = 0.15;
        mat.depthWrite = false;
        if ("transmission" in mat) mat.transmission = 0.08;
      } else if (ghostShell && layer !== "shell") {
        if (mat.color && XRAY_TINT[layer]) mat.color.set(XRAY_TINT[layer]);
        if (layer === "sensors" && mat.emissive) {
          mat.emissive.set(ACCENT);
          mat.emissiveIntensity = Math.max(mat.emissiveIntensity || 0, 0.7);
        }
      }
    }
  }

  function setExplode(on) {
    state.exploded = on;
    state.explodeFrom = state.explodeT;
    state.explodeTo = on ? 1 : 0;
    state.explodeClock = 0;
    if (reduced) {
      state.explodeT = state.explodeTo;
      for (const a of model.assemblies) a.object.position.copy(a.rest);
    }
    paintModes();
    applyVisibility();
    announce(on ? "Eksploderet view slået til." : "Eksploderet view slået fra.");
  }

  function setXray(on) {
    state.xray = on;
    paintModes();
    applyVisibility();
    announce(on ? "Røntgen slået til." : "Røntgen slået fra.");
  }

  function select(partId, layerId) {
    state.selected = partId;
    state.selectedLayer = partId ? partMeta(partId).layer : layerId;
    outlinePass.selectedObjects = partId ? meshesOf(partId) : [];
    paintSheet();
  }

  function framePart(partId) {
    const meshes = meshesOf(partId).filter((m) => m.visible);
    if (!meshes.length) return;
    const box = new THREE.Box3();
    for (const m of meshes) box.expandByObject(m);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();
    const dist = Math.max(0.55, Math.min(2.8, size * 2.1));
    const dir = camera.position.clone().sub(controls.target).normalize();
    beginCam(camera.position.clone().copy(center).add(dir.multiplyScalar(dist)), center);
  }

  function beginCam(toPos, toTarget) {
    state.camReset = true;
    state.camFrom.copy(camera.position);
    state.targetFrom.copy(controls.target);
    state.camTo.copy(toPos);
    state.targetTo.copy(toTarget);
    state.camClock = 0;
    if (reduced) {
      camera.position.copy(toPos);
      controls.target.copy(toTarget);
      state.camReset = false;
    }
  }

  function resetCam() {
    beginCam(CAM_POS, CAM_TARGET);
    announce("Kamera nulstillet.");
  }

  function toggleLayer(id) {
    state.layers[id] = !state.layers[id];
    state.selectedLayer = id;
    if (!state.selected) select(null, id);
    paintLayers();
    applyVisibility();
    paintSheet();
    announce(state.layers[id] ? `${layerLabel(id)} slået til.` : `${layerLabel(id)} skjult.`);
    const onLayers = LAYERS.filter((l) => state.layers[l.id]);
    if (onLayers.length === 1 && !reduced) {
      clearTimeout(state.frameTimer);
      state.frameTimer = setTimeout(() => {
        const meshes = model.pickables.filter((m) => m.visible && m.userData.layer === onLayers[0].id);
        if (!meshes.length) return;
        const box = new THREE.Box3();
        for (const m of meshes) box.expandByObject(m);
        const center = box.getCenter(new THREE.Vector3());
        const size = Math.max(0.6, box.getSize(new THREE.Vector3()).length());
        const dir = camera.position.clone().sub(controls.target).normalize();
        beginCam(center.clone().add(dir.multiplyScalar(size * 1.8)), center);
      }, 200);
    }
  }

  if (location.hash.includes("explode")) {
    state.exploded = true;
    state.explodeT = 1;
    state.explodeTo = 1;
    for (const a of model.assemblies) a.object.position.copy(a.exploded);
  }
  if (location.hash.includes("xray")) state.xray = true;

  applyVisibility();
  paintModes();
  paintLayers();

  const tmpSph = new THREE.Spherical();
  const tmpOff = new THREE.Vector3();

  function orbitBy(dx, dy) {
    tmpOff.copy(camera.position).sub(controls.target);
    tmpSph.setFromVector3(tmpOff);
    tmpSph.theta -= dx * 0.09;
    tmpSph.phi = THREE.MathUtils.clamp(tmpSph.phi - dy * 0.09, 0.12, Math.PI * 0.48);
    camera.position.copy(controls.target).add(tmpOff.setFromSpherical(tmpSph));
    controls.update();
  }

  function hitAt(clientX, clientY) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(model.pickables, false);
    for (const h of hits) {
      if (h.object.visible && h.object.userData.part) return h.object;
    }
    return null;
  }

  let ptr = null;
  renderer.domElement.addEventListener("pointerdown", (e) => {
    ptr = { x: e.clientX, y: e.clientY, t: performance.now() };
    hint.classList.add("is-gone");
  });
  renderer.domElement.addEventListener("pointermove", (e) => {
    if (ptr && Math.hypot(e.clientX - ptr.x, e.clientY - ptr.y) > 6) {
      ptr.drag = true;
      hoverEl.hidden = true;
      return;
    }
    const obj = hitAt(e.clientX, e.clientY);
    if (obj) {
      const meta = partMeta(obj.userData.part);
      hoverEl.hidden = false;
      hoverEl.textContent = meta.name;
      const rect = canvasHost.getBoundingClientRect();
      hoverEl.style.left = `${e.clientX - rect.left + 14}px`;
      hoverEl.style.top = `${e.clientY - rect.top + 14}px`;
      canvasHost.style.cursor = "pointer";
    } else {
      hoverEl.hidden = true;
      canvasHost.style.cursor = "grab";
    }
  });
  renderer.domElement.addEventListener("pointerleave", () => {
    hoverEl.hidden = true;
  });
  renderer.domElement.addEventListener("pointerup", (e) => {
    if (!ptr) return;
    const dt = performance.now() - ptr.t;
    const dist = Math.hypot(e.clientX - ptr.x, e.clientY - ptr.y);
    if (!ptr.drag && dist < 6 && dt < 500) {
      const obj = hitAt(e.clientX, e.clientY);
      if (obj) select(obj.userData.part, obj.userData.layer);
      else select(null, null);
    }
    ptr = null;
  });
  renderer.domElement.addEventListener("dblclick", (e) => {
    const obj = hitAt(e.clientX, e.clientY);
    if (obj) {
      select(obj.userData.part, obj.userData.layer);
      framePart(obj.userData.part);
    }
  });

  modes.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tool]");
    if (!btn) return;
    if (btn.dataset.tool === "explode") setExplode(!state.exploded);
    if (btn.dataset.tool === "xray") setXray(!state.xray);
    if (btn.dataset.tool === "reset") resetCam();
  });

  layerRow.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-layer]");
    if (!btn) return;
    toggleLayer(btn.dataset.layer);
  });

  sheet.addEventListener("click", (e) => {
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (!act) return;
    if (!state.selected) return;
    if (act === "focus") framePart(state.selected);
    if (act === "hide") {
      if (state.hidden.has(state.selected)) state.hidden.delete(state.selected);
      else state.hidden.add(state.selected);
      applyVisibility();
      paintSheet();
      announce(state.hidden.has(state.selected) ? `${partMeta(state.selected).name} skjult.` : `${partMeta(state.selected).name} synlig.`);
    }
  });

  function onKey(e) {
    if (e.target.closest?.("input, textarea, select")) return;
    const k = e.key;
    if (k >= "1" && k <= "6") {
      const layer = LAYERS[Number(k) - 1];
      if (layer) {
        e.preventDefault();
        toggleLayer(layer.id);
      }
    } else if (k === "e" || k === "E") {
      e.preventDefault();
      setExplode(!state.exploded);
    } else if (k === "x" || k === "X") {
      e.preventDefault();
      setXray(!state.xray);
    } else if (k === "r" || k === "R") {
      e.preventDefault();
      resetCam();
    } else if (k === "f" || k === "F") {
      e.preventDefault();
      if (state.selected) framePart(state.selected);
    } else if (k === "Escape") {
      e.preventDefault();
      if (helpDlg && !helpDlg.hidden) helpDlg.hidden = true;
      else select(null, null);
    } else if (k === "ArrowLeft" || k === "j" || k === "J") {
      e.preventDefault();
      orbitBy(-1, 0);
    } else if (k === "ArrowRight" || k === "l" || k === "L") {
      e.preventDefault();
      orbitBy(1, 0);
    } else if (k === "ArrowUp") {
      e.preventDefault();
      orbitBy(0, 1);
    } else if (k === "ArrowDown") {
      e.preventDefault();
      orbitBy(0, -1);
    }
  }

  const skip = root.querySelector(".ri-skip");
  skip.addEventListener("click", (e) => {
    e.preventDefault();
    canvasHost.focus();
  });
  root.querySelector("[data-help]")?.addEventListener("click", () => {
    helpDlg.hidden = false;
    helpDlg.querySelector("[data-help-close]")?.focus();
  });
  root.querySelector("[data-help-close]")?.addEventListener("click", () => {
    helpDlg.hidden = true;
  });
  helpDlg?.addEventListener("click", (e) => {
    if (e.target === helpDlg) helpDlg.hidden = true;
  });
  root.querySelector("[data-full]")?.addEventListener("click", () => {
    const el = root.closest(".anatomi-page") || root;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  });

  function tick() {
    const dt = clock.getDelta();
    const t = clock.elapsedTime;

    if (!reduced) {
      state.explodeClock += dt * 1000;
      const k = Math.min(1, state.explodeClock / EXPLODE_MS);
      state.explodeT = state.explodeFrom + (state.explodeTo - state.explodeFrom) * appleEase(k);
      const e = state.explodeT;
      for (const a of model.assemblies) {
        a.object.position.lerpVectors(a.rest, a.exploded, e);
      }
    }

    if (state.camReset) {
      state.camClock += dt * 1000;
      const k = Math.min(1, state.camClock / (reduced ? 200 : CAM_MS));
      const u = easeInOut(k);
      camera.position.lerpVectors(state.camFrom, state.camTo, u);
      controls.target.lerpVectors(state.targetFrom, state.targetTo, u);
      if (k >= 1) state.camReset = false;
    }

    if (!reduced) {
      mixer?.update(dt);
      for (const em of model.emissives) {
        em.mat.emissiveIntensity = em.base + Math.sin(t * 2.2) * em.amp;
      }
    }

    controls.update();
    composer.render();
    runtime.raf = requestAnimationFrame(tick);
  }

  const ro = new ResizeObserver(fit);
  ro.observe(canvasHost);
  window.addEventListener("keydown", onKey);

  runtime = {
    root,
    renderer,
    controls,
    composer,
    model,
    mixer,
    stage,
    pmrem,
    envTex,
    raf: 0,
    ro,
    onKey,
  };

  fit();
  tick();
  requestAnimationFrame(fit);
}
