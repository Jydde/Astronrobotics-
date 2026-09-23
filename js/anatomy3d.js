/* ==========================================================================
   Astron Robotics — anatomy3d.js
   AR3P v2: hundredvis af G1-stykker, pack'et explode, lag, søgning, isolér.
   ========================================================================== */

(function () {
  "use strict";

  var HUMANOID_COLOR = {
    head: 0xe4eef6,
    torso: 0xc5d0da,
    shoulder: 0x5ec8e4,
    arm: 0x4ab4d6,
    hand: 0x3aa0c4,
    hip: 0xb7c2cc,
    thigh: 0xa8b4c0,
    knee: 0x7ab4cc,
    foot: 0x6aa4bc
  };

  var SPOT_COLOR = {
    head: 0x3a3e44,
    torso: 0xe0b43c,
    hip: 0x2c3036,
    thigh: 0xc9a040,
    foot: 0x2a2e32
  };

  var BIPED_PARENT = {
    "C:head": "C:torso",
    "C:torso": "",
    "C:hip": "C:torso",
    "L:shoulder": "C:torso",
    "R:shoulder": "C:torso",
    "L:arm": "L:shoulder",
    "R:arm": "R:shoulder",
    "L:hand": "L:arm",
    "R:hand": "R:arm",
    "L:thigh": "C:hip",
    "R:thigh": "C:hip",
    "L:knee": "L:thigh",
    "R:knee": "R:thigh",
    "L:foot": "L:knee",
    "R:foot": "R:knee"
  };

  var QUAD_PARENT = {
    "C:head": "C:torso",
    "C:torso": "",
    "FL:hip": "C:torso",
    "FR:hip": "C:torso",
    "HL:hip": "C:torso",
    "HR:hip": "C:torso",
    "FL:thigh": "FL:hip",
    "FR:thigh": "FR:hip",
    "HL:thigh": "HL:hip",
    "HR:thigh": "HR:hip",
    "FL:foot": "FL:thigh",
    "FR:foot": "FR:thigh",
    "HL:foot": "HL:thigh",
    "HR:foot": "HR:thigh"
  };

  var BIPED_ORDER = [
    "C:torso", "C:head", "C:hip",
    "L:shoulder", "R:shoulder", "L:arm", "R:arm", "L:hand", "R:hand",
    "L:thigh", "R:thigh", "L:knee", "R:knee", "L:foot", "R:foot"
  ];

  var QUAD_ORDER = [
    "C:torso", "C:head",
    "FL:hip", "FR:hip", "HL:hip", "HR:hip",
    "FL:thigh", "FR:thigh", "HL:thigh", "HR:thigh",
    "FL:foot", "FR:foot", "HL:foot", "HR:foot"
  ];

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function readCString(u8, off, n) {
    var end = off;
    var last = off + n;
    while (end < last && u8[end] !== 0) end++;
    var s = "";
    var i;
    for (i = off; i < end; i++) s += String.fromCharCode(u8[i]);
    return s;
  }

  function prettyName(name) {
    return String(name || "")
      .replace(/\.\d+$/, "")
      .replace(/_link.*/g, "")
      .replace(/_rev_.*/g, "")
      .replace(/_/g, " ");
  }

  function mount(els, anatomyParts, opts) {
    opts = opts || {};
    var kind = opts.kind || "biped";
    var GROUP_COLOR = opts.colors || (kind === "quad" ? SPOT_COLOR : HUMANOID_COLOR);
    var UNIT_PARENT = opts.unitParent || (kind === "quad" ? QUAD_PARENT : BIPED_PARENT);
    var unitOrder = opts.unitOrder || (kind === "quad" ? QUAD_ORDER : BIPED_ORDER);
    var binUrl = opts.bin || "assets/humanoid-parts.bin";
    var b64Key = opts.b64 || "HUMANOID_PARTS_B64";
    var intro = opts.intro || window.GENERAL_ANATOMY_INTRO;
    var skipRe = opts.skip || /logo/i;
    var THREE = window.THREE;
    var wrap = els.canvasWrap;
    if (!THREE) {
      wrap.textContent = "Three.js mangler.";
      return { destroy: function () {} };
    }

    wrap.innerHTML = "";
    var status = document.createElement("p");
    status.className = "anatomy-status";
    status.textContent = "Indlæser atlas…";
    wrap.appendChild(status);

    var hud = document.createElement("div");
    hud.className = "anatomy-hud";
    wrap.appendChild(hud);

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x12161c);
    var camera = new THREE.PerspectiveCamera(36, 1, 0.05, 80);
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x12161c, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    wrap.appendChild(renderer.domElement);
    var dom = renderer.domElement;
    dom.style.display = "block";
    dom.style.width = "100%";
    dom.style.height = "100%";
    dom.style.touchAction = "none";

    scene.add(new THREE.HemisphereLight(0xf2f6fa, 0x22252a, 0.9));
    var key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(2.8, 4.6, 3.8);
    scene.add(key);
    var fill = new THREE.DirectionalLight(0xa8c4dc, 0.5);
    fill.position.set(-3.4, 1.4, 2.2);
    scene.add(fill);
    var rim = new THREE.DirectionalLight(0x00c3ff, 0.5);
    rim.position.set(0.2, 2.0, -4.6);
    scene.add(rim);

    var look = new THREE.Vector3(0, 0, 0);
    var robot = new THREE.Group();
    scene.add(robot);

    var partById = {};
    anatomyParts.forEach(function (p) { partById[p.id] = p; });

    var partMeshes = [];
    var unitDelta = {};
    var JOINT_GAP = opts.jointGap != null ? opts.jointGap : (kind === "quad" ? 0.22 : 0.17);
    var hiddenGroups = {};
    var active = "overview";
    var activeMesh = null;
    var isolated = false;
    var search = "";
    var explode = 0;
    var explodeTarget = 0;
    var theta = 0.28;
    var phi = Math.PI / 2.05;
    var radius = 4.8;
    var userZoomed = false;
    var meshReady = false;
    var drag = false;
    var last = { x: 0, y: 0 };
    var moved = 0;
    var ray = new THREE.Raycaster();
    var ndc = new THREE.Vector2();
    var rafId = null;
    var running = true;
    var hoverName = "";

    function placeCamera() {
      var s = Math.sin(phi);
      var r = radius * (1 + explode * 0.28);
      camera.position.set(
        r * s * Math.sin(theta),
        r * Math.cos(phi),
        r * s * Math.cos(theta)
      );
      camera.lookAt(look);
    }

    function fitRadiusToRobot() {
      if (userZoomed || !meshReady) return;
      var box = new THREE.Box3().setFromObject(robot);
      if (box.isEmpty()) return;
      var sphere = box.getBoundingSphere(new THREE.Sphere());
      look.copy(sphere.center);
      var fov = (camera.fov * Math.PI) / 180;
      var halfH = Math.tan(fov * 0.5);
      var halfW = halfH * Math.max(camera.aspect, 0.2);
      var dist = Math.max(sphere.radius / halfH, sphere.radius / halfW) * 1.16;
      radius = clamp(dist, 3.2, 14);
      placeCamera();
    }

    function resize() {
      var W = wrap.clientWidth;
      var H = wrap.clientHeight;
      if (!W || !H) return false;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H, false);
      if (!userZoomed) fitRadiusToRobot();
      else placeCamera();
      return true;
    }

    function fillSpecs(part) {
      var list = els.panelSpecs;
      if (!list) return;
      list.innerHTML = "";
      var specs = part.specs || [];
      if (!specs.length) {
        list.hidden = true;
        return;
      }
      specs.forEach(function (line) {
        var li = document.createElement("li");
        li.textContent = line;
        list.appendChild(li);
      });
      list.hidden = false;
    }

    function meshMatches(m) {
      if (hiddenGroups[m.userData.group]) return false;
      if (!search) return true;
      var n = (prettyName(m.userData.name) + " " + m.userData.group + " " + m.userData.name).toLowerCase();
      return n.indexOf(search) >= 0;
    }

    function applyHighlight() {
      partMeshes.forEach(function (m) {
        var match = meshMatches(m);
        var inGroup = !active || active === "overview" || m.userData.group === active;
        var show = match && (!isolated || inGroup);
        m.visible = show;
        var mat = m.material;
        var base = GROUP_COLOR[m.userData.group] || 0xd5dee6;
        if (!show) return;
        if (active && active !== "overview" && inGroup) {
          mat.color.setHex(0xd7f3ff);
          mat.emissive.setHex(0x082838);
          mat.opacity = 1;
          mat.transparent = false;
        } else if (active && active !== "overview") {
          mat.color.setHex(base);
          mat.emissive.setHex(0x000000);
          mat.opacity = isolated ? 0 : 0.16;
          mat.transparent = mat.opacity < 1;
          if (isolated) m.visible = false;
        } else if (search && match) {
          mat.color.setHex(0xeaf8ff);
          mat.emissive.setHex(0x0a3040);
          mat.opacity = 1;
          mat.transparent = false;
        } else if (search) {
          mat.color.setHex(base);
          mat.opacity = 0.12;
          mat.transparent = true;
          mat.emissive.setHex(0x000000);
        } else {
          mat.color.setHex(base);
          mat.emissive.setHex(0x000000);
          mat.opacity = 1;
          mat.transparent = false;
        }
      });
    }

    function sideLabel(name) {
      var n = String(name || "").toLowerCase();
      if (kind === "quad") {
        if (n.indexOf("fl_") === 0 || n.indexOf("front_left") >= 0) return "Venstre forben · ";
        if (n.indexOf("fr_") === 0 || n.indexOf("front_right") >= 0) return "Højre forben · ";
        if (n.indexOf("hl_") === 0 || n.indexOf("rear_left") >= 0) return "Venstre bagben · ";
        if (n.indexOf("hr_") === 0 || n.indexOf("rear_right") >= 0) return "Højre bagben · ";
        return "";
      }
      if (n.indexOf("left") >= 0) return kind === "quad" ? "Venstre " : "Venstre ";
      if (n.indexOf("right") >= 0) return "Højre ";
      return "";
    }

    function unitKey(ud) {
      var g = ud.group;
      var n = String(ud.name || "").toLowerCase();
      if (kind === "quad") {
        if (g === "head" || g === "torso") return "C:" + g;
        var q = "C";
        if (n.indexOf("fl_") === 0) q = "FL";
        else if (n.indexOf("fr_") === 0) q = "FR";
        else if (n.indexOf("hl_") === 0) q = "HL";
        else if (n.indexOf("hr_") === 0) q = "HR";
        else if (n.indexOf("front_left") >= 0) q = "FL";
        else if (n.indexOf("front_right") >= 0) q = "FR";
        else if (n.indexOf("rear_left") >= 0) q = "HL";
        else if (n.indexOf("rear_right") >= 0) q = "HR";
        return q + ":" + g;
      }
      if (g === "head" || g === "torso" || g === "hip") return "C:" + g;
      var side = n.indexOf("left") >= 0 ? "L" : n.indexOf("right") >= 0 ? "R" : "C";
      return side + ":" + g;
    }

    function buildUnitDeltas() {
      var sums = {};
      var counts = {};
      partMeshes.forEach(function (m) {
        var k = unitKey(m.userData);
        m.userData.unit = k;
        if (!sums[k]) {
          sums[k] = new THREE.Vector3();
          counts[k] = 0;
        }
        sums[k].add(m.userData.restPos);
        counts[k] += 1;
      });
      var centroid = {};
      Object.keys(sums).forEach(function (k) {
        centroid[k] = sums[k].multiplyScalar(1 / counts[k]);
      });
      var order = unitOrder;
      unitDelta = {};
      order.forEach(function (k) {
        if (!centroid[k]) return;
        var parent = UNIT_PARENT[k] || "";
        var local = new THREE.Vector3();
        if (parent && centroid[parent]) {
          local.copy(centroid[k]).sub(centroid[parent]);
          if (local.lengthSq() < 1e-8) {
            local.set(0, k.indexOf("head") >= 0 ? 1 : -1, 0);
          }
          local.normalize().multiplyScalar(JOINT_GAP);
          local.add(unitDelta[parent] || new THREE.Vector3());
        }
        unitDelta[k] = local;
      });
    }

    function applyExplode() {
      var t = explode;
      partMeshes.forEach(function (m) {
        var d = unitDelta[m.userData.unit];
        m.position.copy(m.userData.restPos);
        if (d && t) m.position.addScaledVector(d, t);
      });
      placeCamera();
    }

    function setHud(text) {
      hud.textContent = text || "";
      hud.style.opacity = text ? "1" : "0";
    }

    function select(part, meshName) {
      active = part.id;
      activeMesh = meshName || null;
      var sub = part.category || "";
      if (meshName) {
        sub = (sub ? sub + " · " : "") + sideLabel(meshName) + part.label;
      }
      els.panelSub.textContent = sub;
      els.panelTitle.textContent = part.label;
      els.panelText.textContent = part.description;
      fillSpecs(part);
      applyHighlight();
      setHud(els.panelSub.textContent || part.label);
    }

    if (intro) select(intro);

    function pickFromEvent(e) {
      var r = dom.getBoundingClientRect();
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(ndc, camera);
      var vis = [];
      var i;
      for (i = 0; i < partMeshes.length; i++) {
        if (partMeshes[i].visible) vis.push(partMeshes[i]);
      }
      return ray.intersectObjects(vis);
    }

    function onPointerDown(e) {
      drag = true;
      moved = 0;
      last.x = e.clientX;
      last.y = e.clientY;
      try { dom.setPointerCapture(e.pointerId); } catch (err) {}
    }
    function onPointerMove(e) {
      if (drag) {
        var dx = e.clientX - last.x;
        var dy = e.clientY - last.y;
        moved += Math.abs(dx) + Math.abs(dy);
        theta -= dx * 0.005;
        phi -= dy * 0.005;
        phi = clamp(phi, 0.12, Math.PI - 0.12);
        last.x = e.clientX;
        last.y = e.clientY;
        placeCamera();
        return;
      }
      if (!meshReady) return;
      var hit = pickFromEvent(e);
      if (hit.length) {
        var ud = hit[0].object.userData;
        var part = partById[ud.group];
        var n = sideLabel(ud.name) + (part ? part.label : prettyName(ud.name));
        if (n !== hoverName) {
          hoverName = n;
          setHud(n);
        }
        dom.style.cursor = "pointer";
      } else {
        hoverName = "";
        if (!activeMesh) setHud("");
        dom.style.cursor = "grab";
      }
    }
    function onPointerUp(e) {
      if (drag && moved < 6) {
        var hit = pickFromEvent(e);
        if (hit.length) {
          var g = hit[0].object.userData.group;
          var part = partById[g] || intro;
          if (part) select(part, hit[0].object.userData.name);
        }
      }
      drag = false;
    }
    function onWheel(e) {
      e.preventDefault();
      userZoomed = true;
      radius = clamp(radius + e.deltaY * 0.004, 2.4, 16.0);
      placeCamera();
    }

    dom.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    dom.addEventListener("wheel", onWheel, { passive: false });

    if (els.explodeInput) {
      els.explodeInput.addEventListener("input", function () {
        explodeTarget = Number(els.explodeInput.value) / 100;
      });
    }


    var resizeObserver = typeof ResizeObserver === "function" ? new ResizeObserver(resize) : null;
    if (resizeObserver) resizeObserver.observe(wrap);

    function frame() {
      if (!running) return;
      rafId = requestAnimationFrame(frame);
      if (Math.abs(explode - explodeTarget) > 0.001) {
        explode += (explodeTarget - explode) * 0.13;
        applyExplode();
      } else if (explode !== explodeTarget) {
        explode = explodeTarget;
        applyExplode();
      }
      renderer.render(scene, camera);
    }

    function kick() {
      wrap.offsetHeight;
      if (!resize()) {
        requestAnimationFrame(kick);
        return;
      }
      placeCamera();
      frame();
    }
    kick();

    function showParts(parts) {
      var i;
      for (i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (skipRe.test(p.name)) continue;
        var geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(p.pos, 3));
        geo.setAttribute("normal", new THREE.BufferAttribute(p.nor, 3));
        geo.setIndex(new THREE.BufferAttribute(p.idx, 1));
        var mat = new THREE.MeshStandardMaterial({
          color: GROUP_COLOR[p.group] || 0xd5dee6,
          metalness: 0.58,
          roughness: 0.38,
          side: THREE.DoubleSide,
          emissive: 0x000000
        });
        var mesh = new THREE.Mesh(geo, mat);
        var c = new THREE.Vector3(p.centroid[0], p.centroid[1], p.centroid[2]);
        var e = new THREE.Vector3(p.explode[0], p.explode[1], p.explode[2]);
        var arr = p.pos;
        var j;
        for (j = 0; j < arr.length; j += 3) {
          arr[j] -= c.x;
          arr[j + 1] -= c.y;
          arr[j + 2] -= c.z;
        }
        geo.attributes.position.needsUpdate = true;
        geo.computeBoundingSphere();
        mesh.position.copy(c);
        mesh.userData = {
          name: p.name,
          group: p.group,
          restPos: c.clone(),
          explodePos: e.clone()
        };
        robot.add(mesh);
        partMeshes.push(mesh);
      }
      buildUnitDeltas();
      robot.updateMatrixWorld(true);
      var fitted = new THREE.Box3().setFromObject(robot);
      var size = fitted.getSize(new THREE.Vector3());
      var center = fitted.getCenter(new THREE.Vector3());
      var s = 2.15 / Math.max(size.y, 0.001);
      robot.position.set(-center.x * s, -center.y * s, -center.z * s);
      robot.scale.setScalar(s);
      robot.updateMatrixWorld(true);
      meshReady = true;
      applyHighlight();
      applyExplode();
      fitRadiusToRobot();
      if (status.parentNode) status.parentNode.removeChild(status);
      if (els.countEl) els.countEl.textContent = String(anatomyParts.length);
    }

    function b64ToBuffer(s) {
      var bin = atob(s);
      var n = bin.length;
      var bytes = new Uint8Array(n);
      for (var i = 0; i < n; i++) bytes[i] = bin.charCodeAt(i);
      return bytes.buffer;
    }

    function parseAR3P(buf) {
      var u8 = new Uint8Array(buf);
      if (String.fromCharCode(u8[0], u8[1], u8[2], u8[3]) !== "AR3P") {
        throw new Error("forkert filformat");
      }
      var dv = new DataView(buf);
      var version = dv.getUint32(4, true);
      var nparts = dv.getUint32(8, true);
      var off = 12;
      var parts = [];
      var i;
      for (i = 0; i < nparts; i++) {
        var name = readCString(u8, off, 32); off += 32;
        var group = readCString(u8, off, 16); off += 16;
        var nverts = dv.getUint32(off, true); off += 4;
        var nfaces = dv.getUint32(off, true); off += 4;
        var cx = dv.getFloat32(off, true);
        var cy = dv.getFloat32(off + 4, true);
        var cz = dv.getFloat32(off + 8, true);
        off += 12;
        var ex = cx, ey = cy, ez = cz;
        if (version >= 2) {
          ex = dv.getFloat32(off, true);
          ey = dv.getFloat32(off + 4, true);
          ez = dv.getFloat32(off + 8, true);
          off += 12;
        }
        var pos = new Float32Array(buf.slice(off, off + nverts * 12));
        off += nverts * 12;
        var nor = new Float32Array(buf.slice(off, off + nverts * 12));
        off += nverts * 12;
        var idx = new Uint32Array(buf.slice(off, off + nfaces * 12));
        off += nfaces * 12;
        parts.push({
          name: name,
          group: group,
          centroid: [cx, cy, cz],
          explode: [ex, ey, ez],
          pos: pos,
          nor: nor,
          idx: idx
        });
      }
      return parts;
    }

    function loadPartsBuffer() {
      return fetch(binUrl).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.arrayBuffer();
      }).catch(function () {
        if (window[b64Key]) return b64ToBuffer(window[b64Key]);
        throw new Error("ingen 3D-data");
      });
    }

    loadPartsBuffer().then(function (buf) {
      showParts(parseAR3P(buf));
    }).catch(function (err) {
      status.textContent = "Kunne ikke indlæse 3D-modellen.";
      console.error(err);
    });

    return {
      destroy: function () {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        if (resizeObserver) resizeObserver.disconnect();
        dom.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        dom.removeEventListener("wheel", onWheel);
        renderer.dispose();
        if (dom.parentNode) dom.parentNode.removeChild(dom);
      }
    };
  }

  window.AstronAnatomy3D = { mount: mount };
  window.dispatchEvent(new Event("astron-anatomy3d-ready"));
})();
