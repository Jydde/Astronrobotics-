import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

/**
 * Explodable humanoid matching the 2021 Tesla Bot look
 * (eMirage “Tesla BOT” on Sketchfab, uid 2421eadea6164f19b22451e5abf0578d).
 * Original mesh. No Tesla wordmark.
 */
export function createOptimus() {
  const geos = [];
  const mats = [];
  const textures = [];
  const pickables = [];
  const assemblies = [];
  const geo = (g) => (geos.push(g), g);
  const mat = (m) => (mats.push(m), m);

  function peelTex() {
    const s = 256;
    const c = document.createElement("canvas");
    c.width = c.height = s;
    const ctx = c.getContext("2d");
    const img = ctx.createImageData(s, s);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = 128 + (Math.random() - 0.5) * 12;
      img.data[i] = n;
      img.data[i + 1] = n;
      img.data[i + 2] = 255;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(6, 8);
    t.colorSpace = THREE.NoColorSpace;
    textures.push(t);
    return t;
  }

  function hexKnitMaps() {
    const s = 512;
    const albedo = document.createElement("canvas");
    const bump = document.createElement("canvas");
    albedo.width = albedo.height = bump.width = bump.height = s;
    const a = albedo.getContext("2d");
    const b = bump.getContext("2d");
    a.fillStyle = "#1a1b1d";
    a.fillRect(0, 0, s, s);
    b.fillStyle = "#808080";
    b.fillRect(0, 0, s, s);
    const R = 11;
    const w = R * Math.sqrt(3);
    const h = R * 1.5;
    function hex(ctx, cx, cy, r) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (Math.PI / 180) * (60 * i - 30);
        const x = cx + r * Math.cos(ang);
        const y = cy + r * Math.sin(ang);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }
    for (let row = -1; row < s / h + 2; row++) {
      for (let col = -1; col < s / w + 2; col++) {
        const x = col * w + (row % 2) * (w * 0.5);
        const y = row * h;
        hex(a, x, y, R - 0.8);
        a.strokeStyle = "#2a2c30";
        a.lineWidth = 1.6;
        a.stroke();
        hex(b, x, y, R - 1.2);
        b.fillStyle = "#9a9a9a";
        b.fill();
        b.strokeStyle = "#505050";
        b.lineWidth = 2;
        b.stroke();
      }
    }
    const map = new THREE.CanvasTexture(albedo);
    const bumpMap = new THREE.CanvasTexture(bump);
    for (const t of [map, bumpMap]) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(3.2, 4.2);
      t.anisotropy = 8;
      t.colorSpace = t === map ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      textures.push(t);
    }
    return { map, bumpMap };
  }

  const peel = peelTex();
  const knitMaps = hexKnitMaps();

  const shell = mat(
    new THREE.MeshPhysicalMaterial({
      color: 0xf2eee8,
      roughness: 0.32,
      metalness: 0.07,
      clearcoat: 0.45,
      clearcoatRoughness: 0.22,
      normalMap: peel,
      normalScale: new THREE.Vector2(0.08, 0.08),
      envMapIntensity: 1.25,
    })
  );
  const helm = mat(
    new THREE.MeshPhysicalMaterial({
      color: 0x050507,
      roughness: 0.035,
      metalness: 0.28,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      envMapIntensity: 2.4,
    })
  );
  const knitMat = mat(
    new THREE.MeshPhysicalMaterial({
      map: knitMaps.map,
      bumpMap: knitMaps.bumpMap,
      bumpScale: 0.35,
      color: 0xffffff,
      roughness: 0.88,
      metalness: 0,
      sheen: 0.4,
      sheenColor: new THREE.Color(0x3a3a3e),
      sheenRoughness: 0.7,
    })
  );
  const joint = mat(
    new THREE.MeshPhysicalMaterial({
      color: 0x121214,
      roughness: 0.65,
      metalness: 0.1,
    })
  );
  const glove = mat(
    new THREE.MeshPhysicalMaterial({
      color: 0x2a2a2c,
      roughness: 0.48,
      metalness: 0.12,
      clearcoat: 0.1,
      envMapIntensity: 1.0,
    })
  );
  const metal = mat(
    new THREE.MeshPhysicalMaterial({
      color: 0x9aa0a6,
      metalness: 0.88,
      roughness: 0.22,
      envMapIntensity: 1.2,
    })
  );

  const root = new THREE.Group();
  root.name = "Optimus";
  root.rotation.y = 0.22;

  function mesh(g, m, part, layer) {
    const o = new THREE.Mesh(g, m);
    o.castShadow = true;
    o.receiveShadow = true;
    o.name = part;
    o.userData = { part, layer };
    pickables.push(o);
    return o;
  }

  function add(id, object, explode, dist = 0.24) {
    const rest = object.position.clone();
    const n = new THREE.Vector3(...explode);
    if (n.lengthSq() === 0) n.set(0, 1, 0);
    assemblies.push({
      id,
      object,
      rest,
      exploded: rest.clone().add(n.normalize().multiplyScalar(dist)),
    });
    root.add(object);
    return object;
  }

  function box(w, h, d, r, m, part, layer) {
    return mesh(geo(new RoundedBoxGeometry(w, h, d, 4, r)), m, part, layer);
  }

  function lathe(pairs, segs, m, part, layer) {
    return mesh(
      geo(new THREE.LatheGeometry(pairs.map(([x, y]) => new THREE.Vector2(x, y)), segs)),
      m,
      part,
      layer
    );
  }

  /* —— Head: full glossy black oval (eMirage Tesla BOT) —— */
  const headG = new THREE.Group();
  headG.position.set(0, 1.58, 0.025);
  const skull = lathe(
    [
      [0.0, 0.125],
      [0.028, 0.122],
      [0.055, 0.108],
      [0.075, 0.082],
      [0.086, 0.048],
      [0.09, 0.01],
      [0.088, -0.03],
      [0.078, -0.065],
      [0.058, -0.095],
      [0.03, -0.112],
      [0.0, -0.118],
    ],
    64,
    helm,
    "head",
    "shell"
  );
  skull.scale.set(0.96, 1.0, 1.12);
  headG.add(skull);
  const helmSeam = mesh(geo(new THREE.TorusGeometry(0.078, 0.0018, 8, 40, Math.PI)), joint, "head", "shell");
  helmSeam.rotation.set(0.2, Math.PI / 2, 0);
  helmSeam.position.set(0, 0.02, -0.02);
  headG.add(helmSeam);
  add("head", headG, [0, 1, 0.08], 0.2);

  /* —— Honeycomb knit: turtleneck into boat-neck yoke —— */
  const knitG = new THREE.Group();
  knitG.position.set(0, 1.43, 0.015);
  const collar = lathe(
    [
      [0.042, 0.11],
      [0.05, 0.1],
      [0.058, 0.07],
      [0.07, 0.02],
      [0.1, -0.05],
      [0.145, -0.11],
      [0.175, -0.155],
      [0.16, -0.175],
      [0.0, -0.175],
    ],
    48,
    knitMat,
    "neck",
    "shell"
  );
  collar.scale.set(1.12, 1.0, 0.86);
  knitG.add(collar);
  add("neck", knitG, [0, 0.8, 0], 0.16);

  /* —— White chest with Y pec seams —— */
  const chestG = new THREE.Group();
  chestG.position.set(0, 1.18, 0.03);
  const pecVol = lathe(
    [
      [0.0, 0.16],
      [0.12, 0.15],
      [0.16, 0.1],
      [0.175, 0.04],
      [0.17, -0.04],
      [0.15, -0.12],
      [0.12, -0.16],
      [0.0, -0.17],
    ],
    48,
    shell,
    "chest",
    "shell"
  );
  pecVol.scale.set(1.05, 1.0, 0.72);
  pecVol.position.y = 0.02;
  chestG.add(pecVol);
  const seamV = box(0.0028, 0.2, 0.004, 0.0004, joint, "chest", "shell");
  seamV.position.set(0, 0.03, 0.118);
  chestG.add(seamV);
  const seamL = box(0.0024, 0.15, 0.003, 0.0004, joint, "chest", "shell");
  seamL.position.set(-0.055, -0.02, 0.112);
  seamL.rotation.z = 0.42;
  chestG.add(seamL);
  const seamR = box(0.0024, 0.15, 0.003, 0.0004, joint, "chest", "shell");
  seamR.position.set(0.055, -0.02, 0.112);
  seamR.rotation.z = -0.42;
  chestG.add(seamR);
  add("chest", chestG, [0, 0.05, 1], 0.28);

  const absG = new THREE.Group();
  absG.position.set(0, 0.98, 0.02);
  const abs = lathe(
    [
      [0.0, 0.08],
      [0.1, 0.075],
      [0.12, 0.03],
      [0.118, -0.03],
      [0.1, -0.07],
      [0.0, -0.08],
    ],
    40,
    shell,
    "chest",
    "shell"
  );
  abs.scale.set(1.0, 1.0, 0.78);
  absG.add(abs);
  add("abs", absG, [0, -0.2, 1], 0.24);

  const batt = box(0.12, 0.08, 0.04, 0.008, metal, "battery", "power");
  batt.position.set(0, 1.08, -0.03);
  add("battery", batt, [0, 0, 1], 0.36);

  const compute = box(0.088, 0.048, 0.032, 0.006, metal, "compute", "compute");
  compute.position.set(0, 1.22, -0.04);
  add("compute", compute, [0, 0.12, 1], 0.32);

  const pelvis = lathe(
    [
      [0.0, 0.07],
      [0.11, 0.065],
      [0.13, 0.02],
      [0.125, -0.03],
      [0.1, -0.06],
      [0.0, -0.07],
    ],
    40,
    shell,
    "pelvis",
    "shell"
  );
  pelvis.position.set(0, 0.86, 0.01);
  pelvis.scale.set(1.05, 1.0, 0.82);
  add("pelvis", pelvis, [0, -1, 0], 0.18);

  function arm(sign) {
    const sh = new THREE.Group();
    sh.position.set(sign * 0.19, 1.28, 0.02);
    sh.add(
      mesh(geo(new THREE.SphereGeometry(0.048, 24, 18)), knitMat, sign < 0 ? "shoulderL" : "shoulderR", "skeleton")
    );
    add(sign < 0 ? "shoulderL" : "shoulderR", sh, [sign, 0.1, 0], 0.16);

    const upper = mesh(
      geo(new THREE.CapsuleGeometry(0.04, 0.2, 8, 20)),
      shell,
      sign < 0 ? "armL" : "armR",
      "shell"
    );
    upper.position.set(sign * 0.21, 1.12, 0.03);
    upper.rotation.z = sign * 0.08;
    upper.rotation.x = 0.04;
    add(sign < 0 ? "armL" : "armR", upper, [sign, 0, 0.2], 0.22);

    const elbow = mesh(
      geo(new THREE.SphereGeometry(0.034, 18, 14)),
      shell,
      sign < 0 ? "elbowL" : "elbowR",
      "skeleton"
    );
    elbow.position.set(sign * 0.22, 0.99, 0.04);
    add(sign < 0 ? "elbowL" : "elbowR", elbow, [sign, 0, 0.28], 0.18);

    const fore = mesh(
      geo(new THREE.CapsuleGeometry(0.034, 0.18, 8, 20)),
      shell,
      sign < 0 ? "forearmL" : "forearmR",
      "shell"
    );
    fore.position.set(sign * 0.228, 0.86, 0.055);
    fore.rotation.set(0.18, 0, sign * 0.05);
    add(sign < 0 ? "forearmL" : "forearmR", fore, [sign, 0, 0.38], 0.24);

    const hand = new THREE.Group();
    hand.position.set(sign * 0.235, 0.74, 0.08);
    hand.rotation.set(0.12, sign * 0.05, sign * 0.05);
    hand.add(box(0.06, 0.022, 0.075, 0.01, glove, sign < 0 ? "handL" : "handR", "hands"));
    [-0.02, -0.007, 0.006, 0.02].forEach((x, i) => {
      const f = box(0.01, 0.042 - i * 0.002, 0.01, 0.003, glove, sign < 0 ? "handL" : "handR", "hands");
      f.position.set(x, -0.03, 0.026);
      f.rotation.x = 0.1;
      hand.add(f);
    });
    const th = box(0.012, 0.03, 0.012, 0.003, glove, sign < 0 ? "handL" : "handR", "hands");
    th.position.set(sign * 0.032, -0.004, 0.002);
    th.rotation.z = sign * 0.68;
    hand.add(th);
    add(sign < 0 ? "handL" : "handR", hand, [sign, -0.1, 0.5], 0.26);
  }
  arm(-1);
  arm(1);

  function leg(sign) {
    const hip = mesh(geo(new THREE.SphereGeometry(0.046, 18, 14)), joint, sign < 0 ? "hipL" : "hipR", "skeleton");
    hip.position.set(sign * 0.082, 0.8, 0.008);
    add(sign < 0 ? "hipL" : "hipR", hip, [sign, 0, 0], 0.14);

    const thigh = mesh(
      geo(new THREE.CapsuleGeometry(0.048, 0.2, 8, 20)),
      shell,
      sign < 0 ? "thighL" : "thighR",
      "shell"
    );
    thigh.position.set(sign * 0.085, 0.65, 0.014);
    add(sign < 0 ? "thighL" : "thighR", thigh, [sign, -0.28, 0], 0.22);

    const knee = mesh(geo(new THREE.SphereGeometry(0.038, 16, 12)), shell, sign < 0 ? "kneeL" : "kneeR", "skeleton");
    knee.position.set(sign * 0.085, 0.52, 0.018);
    add(sign < 0 ? "kneeL" : "kneeR", knee, [sign, -0.26, 0.16], 0.16);

    const shin = mesh(
      geo(new THREE.CapsuleGeometry(0.04, 0.2, 8, 20)),
      shell,
      sign < 0 ? "shinL" : "shinR",
      "shell"
    );
    shin.position.set(sign * 0.085, 0.38, 0.02);
    add(sign < 0 ? "shinL" : "shinR", shin, [sign, -0.42, 0.1], 0.24);

    const foot = new THREE.Group();
    foot.position.set(sign * 0.085, 0.22, 0.048);
    foot.add(box(0.08, 0.046, 0.165, 0.016, joint, sign < 0 ? "footL" : "footR", "shell"));
    const sole = box(0.084, 0.012, 0.18, 0.005, shell, sign < 0 ? "footL" : "footR", "shell");
    sole.position.set(0, -0.026, 0.01);
    foot.add(sole);
    add(sign < 0 ? "footL" : "footR", foot, [sign, -1, 0.25], 0.18);
  }
  leg(-1);
  leg(1);

  return {
    root,
    pickables,
    assemblies,
    emissives: [],
    dispose() {
      for (const t of textures) t.dispose();
      for (const g of geos) g.dispose();
      for (const m of mats) m.dispose();
    },
  };
}
