import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

function noiseTex(size, amp, z) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = 128 + (Math.random() - 0.5) * amp;
    img.data[i] = n;
    img.data[i + 1] = n;
    img.data[i + 2] = z;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

function lathe(pairs, segs = 48, start = 0, length = Math.PI * 2) {
  return new THREE.LatheGeometry(
    pairs.map(([x, y]) => new THREE.Vector2(x, y)),
    segs,
    start,
    length
  );
}

export function createHumanoid() {
  const geos = [];
  const mats = [];
  const textures = [];
  const pickables = [];
  const emissives = [];
  const assemblies = [];

  const peel = noiseTex(256, 22, 255);
  peel.repeat.set(6, 8);
  const roughMap = noiseTex(128, 40, 128);
  roughMap.repeat.set(3, 4);
  textures.push(peel, roughMap);

  const geo = (g) => {
    geos.push(g);
    return g;
  };
  const mat = (m) => {
    mats.push(m);
    return m;
  };

  const shell = mat(
    new THREE.MeshPhysicalMaterial({
      color: 0xe6e2da,
      roughness: 0.42,
      metalness: 0.045,
      roughnessMap: roughMap,
      normalMap: peel,
      normalScale: new THREE.Vector2(0.14, 0.14),
      clearcoat: 0.18,
      clearcoatRoughness: 0.55,
      envMapIntensity: 0.85,
    })
  );
  const shellHi = mat(
    new THREE.MeshPhysicalMaterial({
      color: 0xeeeae3,
      roughness: 0.36,
      metalness: 0.05,
      normalMap: peel,
      normalScale: new THREE.Vector2(0.1, 0.1),
      clearcoat: 0.22,
      clearcoatRoughness: 0.48,
      envMapIntensity: 0.9,
    })
  );
  const gun = mat(
    new THREE.MeshPhysicalMaterial({
      color: 0x2c3036,
      metalness: 0.92,
      roughness: 0.28,
      anisotropy: 0.72,
      anisotropyRotation: Math.PI * 0.5,
      envMapIntensity: 1.25,
    })
  );
  const gunDark = mat(
    new THREE.MeshPhysicalMaterial({
      color: 0x1a1d21,
      metalness: 0.9,
      roughness: 0.34,
      anisotropy: 0.55,
      envMapIntensity: 1.05,
    })
  );
  const steel = mat(
    new THREE.MeshPhysicalMaterial({
      color: 0x6e757c,
      metalness: 0.82,
      roughness: 0.38,
      envMapIntensity: 1.05,
    })
  );
  const visorGlass = mat(
    new THREE.MeshPhysicalMaterial({
      color: 0x05070a,
      roughness: 0.02,
      metalness: 0,
      transmission: 0.82,
      thickness: 0.028,
      ior: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity: 1,
      envMapIntensity: 2.8,
      attenuationColor: new THREE.Color(0x101820),
      attenuationDistance: 0.08,
    })
  );
  const lens = mat(
    new THREE.MeshPhysicalMaterial({
      color: 0x0b1016,
      roughness: 0.04,
      metalness: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      envMapIntensity: 1.8,
    })
  );
  const foam = mat(
    new THREE.MeshPhysicalMaterial({
      color: 0x141416,
      roughness: 0.94,
      metalness: 0,
      sheen: 0.12,
      sheenColor: new THREE.Color(0x2a2a2c),
    })
  );
  const rubber = mat(
    new THREE.MeshPhysicalMaterial({
      color: 0x121214,
      roughness: 0.88,
      metalness: 0,
    })
  );
  const copper = mat(
    new THREE.MeshPhysicalMaterial({
      color: 0xb87333,
      metalness: 0.96,
      roughness: 0.26,
    })
  );
  const pcb = mat(
    new THREE.MeshPhysicalMaterial({
      color: 0x12181c,
      metalness: 0.18,
      roughness: 0.5,
    })
  );
  const tendon = mat(
    new THREE.MeshPhysicalMaterial({
      color: 0xc4b8a4,
      metalness: 0.35,
      roughness: 0.42,
    })
  );
  const led = mat(
    new THREE.MeshStandardMaterial({
      color: 0xd6e8ff,
      emissive: 0x5aa2ff,
      emissiveIntensity: 1.15,
      roughness: 0.22,
    })
  );
  emissives.push({ mat: led, base: 0.85, amp: 0.22 });

  const root = new THREE.Group();
  root.name = "astron-humanoid";
  root.rotation.y = 0.07;

  function mesh(geometry, material, part, layer) {
    const m = new THREE.Mesh(geometry, material);
    m.castShadow = true;
    m.receiveShadow = true;
    m.userData = { part, layer };
    pickables.push(m);
    return m;
  }

  function addAssembly(id, object, dir, dist) {
    const rest = object.position.clone();
    const n = new THREE.Vector3(...dir);
    if (n.lengthSq() === 0) n.set(0, 1, 0);
    n.normalize().multiplyScalar(dist);
    assemblies.push({ id, object, rest, exploded: rest.clone().add(n) });
    return object;
  }

  function bolt(size, part, layer) {
    return mesh(geo(new THREE.CylinderGeometry(size, size, size * 0.55, 6)), gunDark, part, layer);
  }

  function faceBolts(parent, spots, part, layer, size = 0.003) {
    for (const [x, y, z, rx = Math.PI / 2] of spots) {
      const b = bolt(size, part, layer);
      b.position.set(x, y, z);
      b.rotation.x = rx;
      parent.add(b);
    }
  }

  function groove(parent, w, h, d, x, y, z, part, layer, rot = [0, 0, 0]) {
    const g = mesh(geo(new RoundedBoxGeometry(w, h, d, 1, 0.0003)), gunDark, part, layer);
    g.position.set(x, y, z);
    g.rotation.set(...rot);
    parent.add(g);
    return g;
  }

  function vents(parent, n, w, h, d, x0, y0, z, dx, part, layer) {
    for (let i = 0; i < n; i++) {
      const slat = mesh(geo(new RoundedBoxGeometry(w, h, d, 1, 0.0004)), gunDark, part, layer);
      slat.position.set(x0 + i * dx, y0, z);
      parent.add(slat);
    }
  }

  function cable(points, radius, material, part, layer) {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    return mesh(geo(new THREE.TubeGeometry(curve, Math.max(10, points.length * 6), radius, 7, false)), material, part, layer);
  }

  function motor(r, h, part) {
    const g = new THREE.Group();
    g.add(mesh(geo(new THREE.CylinderGeometry(r, r * 1.02, h, 32)), gun, part, "skeleton"));
    const face = mesh(geo(new THREE.CylinderGeometry(r * 0.92, r * 0.92, 0.004, 32)), steel, part, "skeleton");
    face.position.y = h * 0.5 - 0.001;
    g.add(face);
    const ring = mesh(geo(new THREE.TorusGeometry(r * 0.78, r * 0.035, 10, 28)), steel, part, "skeleton");
    ring.rotation.x = Math.PI / 2;
    ring.position.y = h * 0.5;
    g.add(ring);
    const shaft = mesh(geo(new THREE.CylinderGeometry(r * 0.22, r * 0.22, h * 0.35, 16)), steel, part, "skeleton");
    shaft.position.y = h * 0.55;
    g.add(shaft);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const b = bolt(r * 0.07, part, "skeleton");
      b.position.set(Math.cos(a) * r * 0.62, h * 0.5 + 0.002, Math.sin(a) * r * 0.62);
      g.add(b);
    }
    for (let i = 0; i < 8; i++) {
      const fin = mesh(geo(new RoundedBoxGeometry(r * 0.06, h * 0.55, r * 0.16, 1, 0.001)), gunDark, part, "skeleton");
      const a = (i / 8) * Math.PI * 2;
      fin.position.set(Math.cos(a) * r * 1.02, 0, Math.sin(a) * r * 1.02);
      fin.rotation.y = -a;
      g.add(fin);
    }
    return g;
  }

  function panel(w, h, d, r, material, part, layer) {
    return mesh(geo(new RoundedBoxGeometry(w, h, d, 2, r)), material, part, layer);
  }

  // ——— Head ———
  const headG = new THREE.Group();
  headG.position.set(0.006, 1.52, 0.01);
  headG.rotation.y = 0.08;
  const cranium = mesh(
    geo(
      lathe(
        [
          [0.02, 0.0],
          [0.055, 0.012],
          [0.078, 0.04],
          [0.092, 0.078],
          [0.098, 0.118],
          [0.096, 0.152],
          [0.086, 0.178],
          [0.068, 0.196],
          [0.04, 0.21],
          [0.0, 0.216],
        ],
        64,
        Math.PI * 0.28,
        Math.PI * 1.44
      )
    ),
    shellHi,
    "head",
    "shell"
  );
  cranium.scale.set(0.98, 1, 1.06);
  headG.add(cranium);
  const crown = mesh(
    geo(
      lathe(
        [
          [0.0, 0.168],
          [0.05, 0.172],
          [0.078, 0.188],
          [0.05, 0.208],
          [0.0, 0.214],
        ],
        48
      )
    ),
    shell,
    "head",
    "shell"
  );
  headG.add(crown);
  const brow = panel(0.132, 0.018, 0.046, 0.004, gunDark, "head", "shell");
  brow.position.set(0, 0.148, 0.062);
  headG.add(brow);
  const cheekL = panel(0.028, 0.07, 0.05, 0.006, shell, "head", "shell");
  cheekL.position.set(-0.072, 0.1, 0.04);
  cheekL.rotation.y = 0.45;
  headG.add(cheekL);
  const cheekR = panel(0.028, 0.07, 0.05, 0.006, shell, "head", "shell");
  cheekR.position.set(0.072, 0.1, 0.04);
  cheekR.rotation.y = -0.45;
  headG.add(cheekR);
  faceBolts(
    headG,
    [
      [-0.07, 0.168, 0.05],
      [0.07, 0.168, 0.05],
      [-0.082, 0.08, 0.02, 0],
      [0.082, 0.08, 0.02, 0],
    ],
    "head",
    "shell",
    0.0032
  );
  groove(headG, 0.002, 0.09, 0.0016, 0, 0.12, -0.09, "head", "shell");

  const visor = mesh(
    geo(new THREE.SphereGeometry(0.112, 72, 48, Math.PI / 2 - 0.9, 1.8, 0.42, 1.08)),
    visorGlass,
    "visor",
    "sensors"
  );
  visor.scale.set(0.97, 1.03, 1.06);
  visor.position.set(0, 0.108, 0.012);
  visor.renderOrder = 2;
  headG.add(visor);
  const gasket = mesh(geo(new THREE.TorusGeometry(0.086, 0.0042, 10, 40, 2.2)), foam, "visor", "sensors");
  gasket.rotation.set(0.15, Math.PI / 2, 0);
  gasket.position.set(0, 0.108, 0.07);
  headG.add(gasket);

  function camBarrel(x) {
    const g = new THREE.Group();
    const body = mesh(geo(new THREE.CylinderGeometry(0.009, 0.01, 0.018, 20)), gun, "visor", "sensors");
    body.rotation.x = Math.PI / 2;
    g.add(body);
    const glass = mesh(geo(new THREE.CylinderGeometry(0.0072, 0.0072, 0.004, 20)), lens, "visor", "sensors");
    glass.rotation.x = Math.PI / 2;
    glass.position.z = 0.01;
    g.add(glass);
    const ring = mesh(geo(new THREE.TorusGeometry(0.0078, 0.0012, 8, 18)), steel, "visor", "sensors");
    ring.position.z = 0.008;
    g.add(ring);
    g.position.set(x, 0.108, 0.055);
    return g;
  }
  headG.add(camBarrel(-0.024));
  headG.add(camBarrel(0.024));
  const depth = mesh(geo(new THREE.CylinderGeometry(0.006, 0.0065, 0.012, 16)), gun, "visor", "sensors");
  depth.rotation.x = Math.PI / 2;
  depth.position.set(0, 0.092, 0.058);
  headG.add(depth);
  const status = mesh(geo(new THREE.BoxGeometry(0.018, 0.0032, 0.0022)), led, "visor", "sensors");
  status.position.set(0, 0.15, 0.086);
  headG.add(status);

  const headBoard = mesh(geo(new RoundedBoxGeometry(0.058, 0.028, 0.01, 1, 0.002)), pcb, "computeHead", "compute");
  headBoard.position.set(0, 0.11, -0.012);
  headG.add(headBoard);

  root.add(headG);
  addAssembly("head", headG, [0, 1, 0.15], 0.14);
  addAssembly("visor", visor, [0, 0.2, 1], 0.12);

  // ——— Neck ———
  const neckG = new THREE.Group();
  neckG.position.set(0, 1.498, 0.008);
  const collar = mesh(geo(new THREE.CylinderGeometry(0.046, 0.054, 0.038, 28, 1)), shell, "neck", "shell");
  neckG.add(collar);
  const foamRing = mesh(geo(new THREE.TorusGeometry(0.048, 0.007, 10, 24)), foam, "neck", "shell");
  foamRing.rotation.x = Math.PI / 2;
  foamRing.position.y = 0.012;
  neckG.add(foamRing);
  const nMot = motor(0.026, 0.028, "spine");
  nMot.position.y = -0.006;
  neckG.add(nMot);
  neckG.add(cable([[0, 0.01, -0.03], [0, 0.04, -0.04], [0, 0.08, -0.03]], 0.0032, copper, "bus", "power"));
  root.add(addAssembly("neck", neckG, [0, 1, 0], 0.1));

  // ——— Chest panels ———
  const chestG = new THREE.Group();
  chestG.position.set(0, 1.26, 0.02);
  const pec = panel(0.28, 0.186, 0.148, 0.012, shellHi, "chest", "shell");
  pec.position.set(0, 0.1, 0);
  chestG.add(pec);
  const abs = panel(0.248, 0.22, 0.136, 0.012, shell, "chest", "shell");
  abs.position.set(0, -0.108, -0.002);
  chestG.add(abs);
  groove(chestG, 0.22, 0.0022, 0.004, 0, 0.006, 0.064, "chest", "shell");
  groove(chestG, 0.0022, 0.14, 0.003, 0, 0.08, 0.066, "chest", "shell");
  faceBolts(
    chestG,
    [
      [-0.11, 0.15, 0.068],
      [0.11, 0.15, 0.068],
      [-0.1, 0.02, 0.068],
      [0.1, 0.02, 0.068],
      [-0.09, -0.12, 0.058],
      [0.09, -0.12, 0.058],
    ],
    "chest",
    "shell",
    0.0034
  );
  vents(chestG, 5, 0.028, 0.0036, 0.006, -0.056, -0.11, 0.062, 0.028, "chest", "shell");
  const chestCamBezel = mesh(geo(new THREE.CylinderGeometry(0.012, 0.013, 0.008, 20)), gun, "chest", "sensors");
  chestCamBezel.rotation.x = Math.PI / 2;
  chestCamBezel.position.set(0, 0.04, 0.07);
  chestG.add(chestCamBezel);
  const chestCam = mesh(geo(new THREE.CylinderGeometry(0.008, 0.008, 0.004, 20)), lens, "chest", "sensors");
  chestCam.rotation.x = Math.PI / 2;
  chestCam.position.set(0, 0.04, 0.075);
  chestG.add(chestCam);
  const ledDot = mesh(geo(new THREE.SphereGeometry(0.0024, 10, 8)), led, "chest", "sensors");
  ledDot.position.set(0.018, 0.04, 0.072);
  chestG.add(ledDot);
  root.add(addAssembly("chest", chestG, [0, 0.15, 1], 0.2));

  const backG = new THREE.Group();
  backG.position.set(0, 1.28, -0.02);
  const backU = panel(0.26, 0.16, 0.1, 0.012, shell, "back", "shell");
  backU.position.set(0, 0.08, -0.02);
  backG.add(backU);
  const backL = panel(0.22, 0.14, 0.09, 0.01, shell, "back", "shell");
  backL.position.set(0, -0.08, -0.016);
  backG.add(backL);
  groove(backG, 0.2, 0.002, 0.003, 0, 0.0, -0.07, "back", "shell");
  vents(backG, 6, 0.018, 0.048, 0.006, -0.06, 0.08, -0.072, 0.024, "back", "shell");
  faceBolts(
    backG,
    [
      [-0.1, 0.14, -0.07, 0],
      [0.1, 0.14, -0.07, 0],
      [-0.085, -0.12, -0.06, 0],
      [0.085, -0.12, -0.06, 0],
    ],
    "back",
    "shell",
    0.0032
  );
  root.add(addAssembly("back", backG, [0, 0.1, -1], 0.18));

  // ——— Internals ———
  const spineG = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const spar = mesh(geo(new THREE.CylinderGeometry(0.016, 0.018, 0.046, 14)), steel, "spine", "skeleton");
    spar.position.set(0, 1.08 + i * 0.052, -0.01);
    spineG.add(spar);
    const rib = mesh(geo(new RoundedBoxGeometry(0.12, 0.008, 0.04, 1, 0.002)), gun, "spine", "skeleton");
    rib.position.set(0, 1.08 + i * 0.052, 0.01);
    spineG.add(rib);
  }
  const imu = mesh(geo(new RoundedBoxGeometry(0.024, 0.014, 0.01, 1, 0.0015)), pcb, "imu", "sensors");
  imu.position.set(0.042, 1.26, 0.03);
  spineG.add(imu);
  root.add(addAssembly("spine", spineG, [0, 0, -1], 0.05));

  const battG = new THREE.Group();
  battG.position.set(0, 1.2, 0.0);
  const pack = panel(0.14, 0.14, 0.055, 0.008, steel, "battery", "power");
  battG.add(pack);
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const cell = mesh(geo(new THREE.CylinderGeometry(0.016, 0.016, 0.07, 16)), gunDark, "battery", "power");
      cell.rotation.z = Math.PI / 2;
      cell.position.set(-0.04 + c * 0.04, -0.04 + r * 0.08, 0.01);
      battG.add(cell);
    }
  }
  const term = mesh(geo(new THREE.CylinderGeometry(0.007, 0.007, 0.014, 12)), copper, "battery", "power");
  term.position.set(-0.04, 0.1, 0.03);
  battG.add(term);
  const term2 = mesh(geo(new THREE.CylinderGeometry(0.007, 0.007, 0.014, 12)), copper, "battery", "power");
  term2.position.set(0.04, 0.1, 0.03);
  battG.add(term2);
  const rail = panel(0.156, 0.01, 0.01, 0.002, gun, "battery", "power");
  rail.position.y = 0.1;
  battG.add(rail);
  root.add(addAssembly("battery", battG, [0, 0, 1], 0.26));

  const busG = new THREE.Group();
  busG.add(cable([[0.05, 1.18, 0.03], [0.14, 1.32, 0.02], [0.2, 1.42, 0.0]], 0.0042, copper, "bus", "power"));
  busG.add(cable([[-0.05, 1.18, 0.03], [-0.14, 1.32, 0.02], [-0.2, 1.42, 0.0]], 0.0042, copper, "bus", "power"));
  busG.add(cable([[0.03, 1.18, 0.02], [0.12, 1.3, 0.0], [0.18, 1.4, -0.01]], 0.003, tendon, "bus", "power"));
  busG.add(cable([[0, 1.04, 0.03], [0, 0.94, 0.01], [0, 0.86, 0]], 0.0048, copper, "bus", "power"));
  const gate = panel(0.04, 0.018, 0.012, 0.002, gun, "bus", "power");
  gate.position.set(0.16, 1.36, 0.01);
  busG.add(gate);
  root.add(addAssembly("bus", busG, [0, 0, 1], 0.16));

  const computeG = new THREE.Group();
  computeG.position.set(0, 1.3, 0.0);
  const tray = panel(0.118, 0.072, 0.046, 0.005, pcb, "compute", "compute");
  computeG.add(tray);
  for (const x of [-0.028, 0.028]) {
    const chip = panel(0.038, 0.006, 0.026, 0.001, gunDark, "compute", "compute");
    chip.position.set(x, 0.032, 0.004);
    computeG.add(chip);
  }
  for (let i = 0; i < 9; i++) {
    const fin = mesh(geo(new RoundedBoxGeometry(0.092, 0.0018, 0.028, 1, 0.0003)), steel, "compute", "compute");
    fin.position.set(0, 0.04 + i * 0.0032, 0.004);
    computeG.add(fin);
  }
  computeG.add(cable([[0, 0.04, -0.01], [0, 0.12, -0.028], [0, 0.2, -0.02]], 0.0034, tendon, "compute", "compute"));
  const cLed = mesh(geo(new THREE.BoxGeometry(0.006, 0.002, 0.002)), led, "compute", "compute");
  cLed.position.set(0.048, 0.02, 0.024);
  computeG.add(cLed);
  root.add(addAssembly("compute", computeG, [0, 0.1, 1], 0.22));

  // ——— Pelvis ———
  const pelvisG = new THREE.Group();
  pelvisG.position.set(0.008, 0.96, 0);
  const cowling = panel(0.255, 0.14, 0.16, 0.016, shell, "pelvis", "shell");
  pelvisG.add(cowling);
  const frame = panel(0.2, 0.08, 0.12, 0.006, steel, "pelvis", "skeleton");
  frame.position.y = -0.01;
  pelvisG.add(frame);
  groove(pelvisG, 0.18, 0.002, 0.003, 0, 0.02, 0.082, "pelvis", "shell");
  faceBolts(pelvisG, [[-0.1, 0.04, 0.082], [0.1, 0.04, 0.082]], "pelvis", "shell", 0.003);
  root.add(addAssembly("pelvis", pelvisG, [0, -1, 0], 0.08));

  function makeHand(sign, shellPart, tendonPart, palmPart) {
    const g = new THREE.Group();
    const palm = panel(0.076, 0.022, 0.09, 0.006, shellHi, shellPart, "shell");
    palm.position.y = -0.004;
    g.add(palm);
    groove(g, 0.05, 0.0016, 0.002, 0, -0.004, 0.046, shellPart, "shell");
    const well = mesh(geo(new THREE.CylinderGeometry(0.012, 0.013, 0.006, 20)), gun, palmPart, "sensors");
    well.rotation.x = Math.PI / 2;
    well.position.set(0, -0.012, 0.03);
    g.add(well);
    const cam = mesh(geo(new THREE.CylinderGeometry(0.0085, 0.0085, 0.0035, 20)), lens, palmPart, "sensors");
    cam.rotation.x = Math.PI / 2;
    cam.position.set(0, -0.012, 0.034);
    g.add(cam);

    const fingers = [
      { x: -0.028, z: 0.016, lens: [0.026, 0.02, 0.016], w: [0.013, 0.012, 0.011], curl: [0.18, 0.22, 0.28] },
      { x: -0.01, z: 0.022, lens: [0.03, 0.022, 0.017], w: [0.014, 0.0125, 0.011], curl: [0.12, 0.2, 0.26] },
      { x: 0.008, z: 0.022, lens: [0.029, 0.021, 0.016], w: [0.0135, 0.012, 0.0105], curl: [0.14, 0.22, 0.28] },
      { x: 0.026, z: 0.014, lens: [0.024, 0.018, 0.014], w: [0.012, 0.011, 0.01], curl: [0.2, 0.26, 0.32] },
    ];
    for (const f of fingers) {
      const chain = new THREE.Group();
      chain.position.set(f.x, 0.01, f.z);
      let parent = chain;
      for (let i = 0; i < 3; i++) {
        const bone = new THREE.Group();
        if (i === 0) parent.add(bone);
        else {
          bone.position.y = -f.lens[i - 1];
          parent.add(bone);
        }
        bone.rotation.x = f.curl[i];
        const ph = panel(f.w[i], f.lens[i] - 0.002, f.w[i] * 0.78, 0.0022, shell, shellPart, "shell");
        ph.position.y = -f.lens[i] * 0.5;
        bone.add(ph);
        const hinge = mesh(geo(new THREE.CylinderGeometry(f.w[i] * 0.36, f.w[i] * 0.36, f.w[i] * 0.92, 14)), gun, tendonPart, "hands");
        hinge.rotation.z = Math.PI / 2;
        bone.add(hinge);
        const ch = mesh(geo(new RoundedBoxGeometry(f.w[i] * 0.2, f.lens[i] * 0.62, 0.0018, 1, 0.0003)), gunDark, tendonPart, "hands");
        ch.position.set(0, -f.lens[i] * 0.48, -f.w[i] * 0.36);
        bone.add(ch);
        const cab = mesh(geo(new THREE.CylinderGeometry(0.001, 0.001, f.lens[i] * 0.55, 6)), tendon, tendonPart, "hands");
        cab.position.set(0, -f.lens[i] * 0.48, -f.w[i] * 0.3);
        bone.add(cab);
        if (i === 2) {
          const pad = mesh(geo(new THREE.SphereGeometry(f.w[i] * 0.4, 12, 10)), foam, tendonPart, "hands");
          pad.scale.set(1.05, 0.5, 1.2);
          pad.position.set(0, -f.lens[i] + 0.003, f.w[i] * 0.18);
          bone.add(pad);
        }
        parent = bone;
      }
      g.add(chain);
    }

    const thumb = new THREE.Group();
    thumb.position.set(sign * 0.034, -0.002, 0.008);
    thumb.rotation.set(-0.55, 0, sign * 1.05);
    const t1 = panel(0.016, 0.028, 0.014, 0.0024, shell, shellPart, "shell");
    t1.position.y = -0.016;
    thumb.add(t1);
    const th = mesh(geo(new THREE.CylinderGeometry(0.0055, 0.0055, 0.015, 12)), gun, tendonPart, "hands");
    th.rotation.z = Math.PI / 2;
    th.position.y = -0.03;
    thumb.add(th);
    const t2g = new THREE.Group();
    t2g.position.y = -0.03;
    t2g.rotation.x = 0.35;
    const t2 = panel(0.014, 0.022, 0.012, 0.002, shell, shellPart, "shell");
    t2.position.y = -0.012;
    t2g.add(t2);
    const tpad = mesh(geo(new THREE.SphereGeometry(0.006, 10, 8)), foam, tendonPart, "hands");
    tpad.scale.set(1, 0.5, 1.15);
    tpad.position.set(0, -0.024, 0.004);
    t2g.add(tpad);
    thumb.add(t2g);
    g.add(thumb);

    g.rotation.x = 0.22;
    g.rotation.z = sign * 0.1;
    g.rotation.y = sign * 0.12;
    g.scale.setScalar(1.28);
    return g;
  }

  function makeArm(sign, upperPart, shoulderPart, forearmPart, elbowPart, wristPart, handPart, tendonPart, palmPart) {
    const shoulder = new THREE.Group();
    shoulder.position.set(sign * 0.198, 1.38, 0.012);
    const cap = panel(0.088, 0.068, 0.078, 0.012, shell, shoulderPart, "shell");
    cap.rotation.z = sign * -0.18;
    shoulder.add(cap);
    const act = motor(0.034, 0.04, shoulderPart);
    act.rotation.z = sign * Math.PI / 2;
    act.position.x = sign * 0.012;
    shoulder.add(act);
    const pad = mesh(geo(new THREE.TorusGeometry(0.038, 0.009, 10, 20)), foam, shoulderPart, "shell");
    pad.rotation.z = sign * Math.PI / 2;
    pad.position.x = sign * 0.018;
    shoulder.add(pad);
    root.add(addAssembly(shoulderPart, shoulder, [sign, 0.2, 0], 0.09));

    const upper = new THREE.Group();
    upper.position.set(sign * 0.028, -0.1, 0.008);
    upper.rotation.z = sign * 0.06;
    upper.rotation.x = sign < 0 ? 0.12 : 0.05;
    const uFront = panel(0.07, 0.2, 0.032, 0.008, shell, upperPart, "shell");
    uFront.position.set(0, -0.1, 0.018);
    upper.add(uFront);
    const uBack = panel(0.07, 0.2, 0.032, 0.008, shell, upperPart, "shell");
    uBack.position.set(0, -0.1, -0.018);
    upper.add(uBack);
    groove(upper, 0.002, 0.16, 0.002, sign * 0.035, -0.1, 0, upperPart, "shell");
    faceBolts(upper, [[sign * 0.026, -0.02, 0.036], [sign * 0.026, -0.16, 0.036]], upperPart, "shell", 0.0028);
    const sparU = mesh(geo(new THREE.CylinderGeometry(0.014, 0.014, 0.2, 14)), steel, upperPart, "skeleton");
    sparU.position.y = -0.1;
    upper.add(sparU);
    shoulder.add(upper);
    addAssembly(upperPart, upper, [sign, 0, 0.25], 0.12);

    const elbow = new THREE.Group();
    elbow.position.set(0, -0.21, 0);
    const eMot = motor(0.026, 0.03, elbowPart);
    eMot.rotation.x = Math.PI / 2;
    elbow.add(eMot);
    const eFoam = mesh(geo(new THREE.TorusGeometry(0.03, 0.007, 8, 20)), foam, elbowPart, "shell");
    eFoam.rotation.x = Math.PI / 2;
    elbow.add(eFoam);
    upper.add(elbow);
    addAssembly(elbowPart, elbow, [0, 0, 1], 0.06);

    const forearm = new THREE.Group();
    forearm.rotation.x = sign < 0 ? 0.38 : 0.22;
    const faF = panel(0.058, 0.18, 0.026, 0.007, shell, forearmPart, "shell");
    faF.position.set(0, -0.11, 0.015);
    forearm.add(faF);
    const faB = panel(0.058, 0.18, 0.026, 0.007, shell, forearmPart, "shell");
    faB.position.set(0, -0.11, -0.015);
    forearm.add(faB);
    groove(forearm, 0.0018, 0.14, 0.002, sign * 0.029, -0.11, 0, forearmPart, "shell");
    faceBolts(forearm, [[0, -0.04, 0.03], [0, -0.17, 0.03]], forearmPart, "shell", 0.0026);
    const sparF = mesh(geo(new THREE.CylinderGeometry(0.012, 0.011, 0.17, 12)), steel, forearmPart, "skeleton");
    sparF.position.y = -0.11;
    forearm.add(sparF);
    const drums = mesh(geo(new THREE.CylinderGeometry(0.013, 0.013, 0.026, 16)), gun, tendonPart, "hands");
    drums.rotation.z = Math.PI / 2;
    drums.position.y = -0.19;
    forearm.add(drums);
    elbow.add(forearm);
    addAssembly(forearmPart, forearm, [0, 0, 1], 0.14);

    const wrist = new THREE.Group();
    wrist.position.set(0, -0.21, 0);
    const wMot = motor(0.018, 0.022, wristPart);
    wMot.scale.setScalar(0.9);
    wrist.add(wMot);
    const wGate = panel(0.018, 0.01, 0.01, 0.002, gun, wristPart, "skeleton");
    wGate.position.set(0, -0.014, 0.012);
    wrist.add(wGate);
    forearm.add(wrist);
    addAssembly(wristPart, wrist, [0, 0, 1], 0.05);

    const hand = makeHand(sign, handPart, tendonPart, palmPart);
    hand.position.set(0, -0.036, 0.012);
    wrist.add(hand);
    addAssembly(handPart, hand, [0, -0.15, 1], 0.1);
  }

  makeArm(-1, "armL", "shoulderL", "forearmL", "elbowL", "wristL", "handL", "tendonsL", "palmL");
  makeArm(1, "armR", "shoulderR", "forearmR", "elbowR", "wristR", "handR", "tendonsR", "palmR");

  function makeLeg(sign, hipPart, thighPart, kneePart, shinPart, anklePart, footPart) {
    const hip = new THREE.Group();
    hip.position.set(sign * 0.09, 0.92, 0.0);
    const hMot = motor(0.036, 0.038, hipPart);
    hMot.rotation.z = sign * Math.PI / 2;
    hip.add(hMot);
    const hCover = panel(0.068, 0.052, 0.068, 0.01, shell, hipPart, "shell");
    hCover.position.x = sign * 0.018;
    hip.add(hCover);
    root.add(addAssembly(hipPart, hip, [sign, 0, 0], 0.07));

    const thigh = new THREE.Group();
    thigh.position.set(sign * 0.008, -0.06, 0.01);
    thigh.rotation.x = sign < 0 ? -0.06 : -0.02;
    const tF = panel(0.09, 0.26, 0.038, 0.01, shell, thighPart, "shell");
    tF.position.set(0, -0.12, 0.02);
    thigh.add(tF);
    const tB = panel(0.09, 0.26, 0.038, 0.01, shell, thighPart, "shell");
    tB.position.set(0, -0.12, -0.02);
    thigh.add(tB);
    groove(thigh, 0.002, 0.2, 0.002, sign * 0.045, -0.12, 0, thighPart, "shell");
    faceBolts(thigh, [[sign * 0.034, -0.02, 0.042], [sign * 0.034, -0.2, 0.042]], thighPart, "shell", 0.003);
    const tSpar = mesh(geo(new THREE.CylinderGeometry(0.016, 0.016, 0.24, 14)), steel, thighPart, "skeleton");
    tSpar.position.y = -0.12;
    thigh.add(tSpar);
    hip.add(thigh);
    addAssembly(thighPart, thigh, [sign, 0, 0], 0.12);

    const knee = new THREE.Group();
    knee.position.set(0, -0.26, 0);
    const kMot = motor(0.028, 0.032, kneePart);
    kMot.rotation.x = Math.PI / 2;
    knee.add(kMot);
    const kFoam = mesh(geo(new THREE.TorusGeometry(0.032, 0.007, 8, 20)), foam, kneePart, "shell");
    kFoam.rotation.x = Math.PI / 2;
    knee.add(kFoam);
    thigh.add(knee);
    addAssembly(kneePart, knee, [0, 0, 1], 0.06);

    const shin = new THREE.Group();
    shin.rotation.x = sign < 0 ? 0.12 : 0.06;
    const sF = panel(0.07, 0.26, 0.03, 0.008, shell, shinPart, "shell");
    sF.position.set(0, -0.14, 0.016);
    shin.add(sF);
    const sB = panel(0.07, 0.26, 0.03, 0.008, shell, shinPart, "shell");
    sB.position.set(0, -0.14, -0.016);
    shin.add(sB);
    groove(shin, 0.0018, 0.2, 0.002, sign * 0.035, -0.14, 0, shinPart, "shell");
    faceBolts(shin, [[0, -0.04, 0.032], [0, -0.22, 0.032]], shinPart, "shell", 0.0026);
    const sSpar = mesh(geo(new THREE.CylinderGeometry(0.012, 0.012, 0.24, 12)), steel, shinPart, "skeleton");
    sSpar.position.y = -0.14;
    shin.add(sSpar);
    shin.add(cable([[0, -0.02, 0.02], [0, -0.12, 0.024], [0, -0.22, 0.01]], 0.003, copper, "bus", "power"));
    knee.add(shin);
    addAssembly(shinPart, shin, [0, 0, 1], 0.14);

    const ankle = new THREE.Group();
    ankle.position.set(0, -0.28, 0);
    const aMot = motor(0.02, 0.024, anklePart);
    aMot.rotation.x = Math.PI / 2;
    aMot.scale.setScalar(0.9);
    ankle.add(aMot);
    shin.add(ankle);
    addAssembly(anklePart, ankle, [0, 0, 1], 0.05);

    const foot = new THREE.Group();
    foot.position.set(0, -0.04, 0.045);
    foot.rotation.y = sign * 0.04;
    const last = panel(0.088, 0.044, 0.14, 0.01, shell, footPart, "shell");
    last.position.set(0, 0.012, 0.012);
    foot.add(last);
    const toe = panel(0.082, 0.03, 0.062, 0.01, shellHi, footPart, "shell");
    toe.position.set(0, 0.002, 0.112);
    foot.add(toe);
    const sole = panel(0.094, 0.014, 0.228, 0.005, rubber, footPart, "shell");
    sole.position.set(0, -0.024, 0.034);
    foot.add(sole);
    const heel = panel(0.082, 0.02, 0.05, 0.008, rubber, footPart, "shell");
    heel.position.set(0, -0.01, -0.055);
    foot.add(heel);
    groove(foot, 0.07, 0.0016, 0.002, 0, 0.018, 0.08, footPart, "shell");
    const coil = mesh(geo(new THREE.TorusGeometry(0.026, 0.0045, 8, 18)), copper, footPart, "power");
    coil.rotation.x = Math.PI / 2;
    coil.position.set(0, -0.02, 0.02);
    foot.add(coil);
    ankle.add(foot);
    addAssembly(footPart, foot, [0, -1, 0.4], 0.07);
  }

  makeLeg(-1, "hipL", "thighL", "kneeL", "shinL", "ankleL", "footL");
  makeLeg(1, "hipR", "thighR", "kneeR", "shinR", "ankleR", "footR");

  function setKnit() {}

  function dispose() {
    for (const g of geos) g.dispose();
    for (const m of mats) m.dispose();
    for (const t of textures) t.dispose();
  }

  return { root, pickables, emissives, assemblies, dispose, setKnit };
}

export function createStage() {
  const group = new THREE.Group();
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const grd = ctx.createRadialGradient(256, 256, 8, 256, 256, 240);
  grd.addColorStop(0, "rgba(160,160,166,0.55)");
  grd.addColorStop(0.35, "rgba(210,210,214,0.22)");
  grd.addColorStop(1, "rgba(245,245,247,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 512, 512);
  const tex = new THREE.CanvasTexture(canvas);
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(1.35, 64),
    new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      roughness: 1,
      metalness: 0,
      color: 0xf5f5f7,
      depthWrite: false,
    })
  );
  disc.rotation.x = -Math.PI / 2;
  disc.receiveShadow = true;
  disc.position.y = 0.001;
  group.add(disc);
  group.userData.dispose = () => {
    disc.geometry.dispose();
    disc.material.map.dispose();
    disc.material.dispose();
  };
  return group;
}
