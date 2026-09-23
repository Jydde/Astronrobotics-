/* ==========================================================================
   Byggerobotter — app.js
   Ren vanilla JS. Læser ROBOTS/GENERAL_ANATOMY/GENERAL_ANATOMY_SOURCES fra
   data.js og buildIllustrationSVG/PART_LAYOUT fra illustration.js. Ingen
   afhængigheder, intet build-step. Ingen localStorage — al UI-state lever i
   almindelige JS-variabler og nulstilles ved genindlæsning (se CLAUDE.md).

   To faner: "Robotter" (kataloget, #robotsView) og "Anatomi" (den generelle,
   robot-uafhængige anatomi-gennemgang, #anatomyView) — se initTabs(). Den
   interaktive illustration (SVG + valgfri 3D) findes ÉN gang i #anatomyView,
   ikke inde i hver robots detaljevisning.
   ========================================================================== */

(function () {
  "use strict";

  var humanoidGrid = document.getElementById("humanoidGrid");
  var jobsiteGrid = document.getElementById("jobsiteGrid");
  var modal = document.getElementById("modal");
  var modalContent = document.getElementById("modalContent");

  // 3D-blueprint-scenen mountes lazy, én gang, første gang brugeren skifter
  // til "Anatomi"-fanen — og lever derefter resten af sidens levetid (samme
  // rig, ikke noget der skal genopbygges). Render-loopet pauser sig selv via
  // IntersectionObserver, når #anatomyView er skjult (anatomy3d.js).
  var anatomyMounted = {};
  var anatomyKind = "humanoid";
  var ANATOMY_PANELS = ["humanoid", "spot", "brokk", "printer"];
  var introTimers = [];

  // Placeholder-ikon når en robot ikke har et billede endnu.
  var ROBOT_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="5" y="8" width="14" height="11" rx="3"/>' +
    '<path d="M12 8V5"/><circle cx="12" cy="4" r="1.4"/>' +
    '<circle cx="9.5" cy="13" r="1"/><circle cx="14.5" cy="13" r="1"/>' +
    '<path d="M9.5 16.5h5"/><path d="M3.5 12v3"/><path d="M20.5 12v3"/></svg>';

  function esc(str) {
    return String(str).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function thumb(robot) {
    if (robot.image) {
      return '<img src="' + esc(robot.image) + '" alt="' + esc(robot.name) + '" />';
    }
    return ROBOT_ICON;
  }

  function playBadge(robot) {
    if (!robot.youtube) return "";
    return (
      '<span class="card-play" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
          '<path d="M8 6.8v10.4L18.2 12z"/>' +
        "</svg>" +
        "Video" +
      "</span>"
    );
  }

  function clearIntroTimers() {
    introTimers.forEach(function (t) { clearTimeout(t); });
    introTimers = [];
  }

  function ytCommand(iframe, func) {
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage(JSON.stringify({
      event: "command",
      func: func,
      args: []
    }), "*");
  }

  function introEmbedUrl(id) {
    return "https://www.youtube.com/embed/" + encodeURIComponent(id) +
      "?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1";
  }

  function mountIntro(robot) {
    clearIntroTimers();
    if (!robot.youtube || location.protocol === "file:") return;
    var host = document.getElementById("introHost");
    if (!host) return;

    var iframe = document.createElement("iframe");
    iframe.id = "ytIntro";
    iframe.title = "Intro · " + robot.name;
    iframe.width = "920";
    iframe.height = "518";
    iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("playsinline", "true");
    host.insertBefore(iframe, host.firstChild);

    function kick() {
      ytCommand(iframe, "mute");
      ytCommand(iframe, "playVideo");
    }

    iframe.addEventListener("load", function () {
      kick();
      introTimers.push(setTimeout(kick, 200));
      introTimers.push(setTimeout(kick, 700));
      introTimers.push(setTimeout(kick, 1500));
    });

    // src sættes sidst, i samme klik, så autoplay får bruger-gestus + mute.
    iframe.src = introEmbedUrl(robot.youtube);
  }

  function videoHtml(robot) {
    if (!robot.youtube) return "";
    var id = esc(robot.youtube);
    var watch = "https://www.youtube.com/watch?v=" + id;
    var poster = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
    var title = esc("Intro · " + robot.name);
    var label = '<span class="m-video-label">Intro</span>';
    // file:// sender ingen Referer — YouTube viser så fejl 153.
    if (location.protocol === "file:") {
      return (
        '<a class="m-video m-video--link" href="' + watch + '" target="_blank" rel="noopener">' +
          '<img src="' + poster + '" alt="' + title + '">' +
          label +
        "</a>"
      );
    }
    return (
      '<div class="m-video" id="introHost">' +
        '<img class="m-video-poster" src="' + poster + '" alt="">' +
        label +
      "</div>"
    );
  }

  function robotCard(r) {
    return (
      '<button class="card" data-id="' + esc(r.id) + '">' +
        '<div class="card-thumb">' + thumb(r) + playBadge(r) + "</div>" +
        '<div class="card-top">' +
          '<span class="card-cat">' + esc(r.formFactor) + "</span>" +
          '<span class="badge status" data-s="' + esc(r.status) + '">' + esc(r.status) + "</span>" +
        "</div>" +
        "<h3>" + esc(r.name) + "</h3>" +
        '<p class="card-maker">' + esc(r.manufacturer) + " · " + esc(r.country) + "</p>" +
        '<p class="card-tagline">' + esc(r.tagline) + "</p>" +
      "</button>"
    );
  }

  function renderGrid() {
    var humanoids = ROBOTS.filter(function (r) { return r.category !== "jobsite"; });
    var jobsites = ROBOTS.filter(function (r) { return r.category === "jobsite"; });
    if (humanoidGrid) humanoidGrid.innerHTML = humanoids.map(robotCard).join("");
    if (jobsiteGrid) jobsiteGrid.innerHTML = jobsites.map(robotCard).join("");
    var countEl = document.getElementById("countRobots");
    if (countEl) countEl.textContent = String(ROBOTS.length);
  }

  /* ---------- Flad specs-tabel (samme mønster som Website Frontend) ---------- */
  function specRow(label, value) {
    if (!value || value === "—") return "";
    return '<div class="spec"><dt>' + esc(label) + "</dt><dd>" + esc(value) + "</dd></div>";
  }

  function specsHtml(specs) {
    return (
      specRow("Type", specs.type) +
      specRow("Højde", specs.height) +
      specRow("Vægt", specs.weight) +
      specRow("Frihedsgrader", specs.dof) +
      specRow("Nyttelast", specs.payload) +
      specRow("Batteri", specs.battery) +
      specRow("Hastighed", specs.speed)
    );
  }

  /* ---------- Detaljevisning (robotkatalog) ---------- */
  function openModal(id) {
    var r = ROBOTS.find(function (x) { return x.id === id; });
    if (!r) return;

    var verifiedBadge = r.verified
      ? '<span class="badge status">Data bekræftet af flere uafhængige kilder</span>'
      : '<span class="badge badge-unverified">Specs skal tjekkes hos producent</span>';

    var sources = r.sources.map(function (src) {
      return '<li><a href="' + esc(src.url) + '" target="_blank" rel="noopener">' + esc(src.label) + " ↗</a></li>";
    }).join("");

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    modalContent.innerHTML =
      '<div class="m-intro' + (r.youtube ? "" : " m-intro--plain") + '">' +
        videoHtml(r) +
        '<div class="m-intro-copy">' +
          '<p class="m-cat">' + esc(r.formFactor) + "</p>" +
          '<h2 class="m-title" id="modalTitle">' + esc(r.name) + "</h2>" +
          '<p class="m-maker">' + esc(r.manufacturer) + " · " + esc(r.country) + "</p>" +
          '<div class="m-badges">' +
            '<span class="badge status" data-s="' + esc(r.status) + '">' + esc(r.status) + "</span>" +
            verifiedBadge +
          "</div>" +
        "</div>" +
      "</div>" +
      '<p class="m-desc">' + esc(r.description) + "</p>" +
      '<p class="m-section-title">Rolle i byggebranchen</p>' +
      '<p class="m-care">' + esc(r.constructionUse) + "</p>" +
      '<p class="m-section-title">Specs</p>' +
      '<dl class="specs">' + specsHtml(r.specs) + "</dl>" +
      anatomyModalLink(r) +
      '<p class="m-section-title">Kilder</p>' +
      '<ul class="m-sources">' + sources + "</ul>";

    mountIntro(r);
  }

  function anatomyModalLink(r) {
    var links = {
      "boston-dynamics-spot": ["spot", "Se Spot-anatomien — krop, hofter og ben →"],
      brokk: ["brokk", "Se Brokk-anatomien — bælter, arm og hammer →"],
      "dusty-fieldprinter": ["printer", "Se FieldPrinter-anatomien — bælter, tracker og printhoved →"]
    };
    var spec = links[r.id];
    if (!spec && r.category === "jobsite") return "";
    var kind = spec ? spec[0] : "humanoid";
    var label = spec ? spec[1] : "Se den generelle anatomi-gennemgang for denne type robot →";
    return (
      '<button type="button" class="m-anatomy-link" data-goto-anatomy="' + kind + '">' +
      label +
      "</button>"
    );
  }

  function closeModal() {
    clearIntroTimers();
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modalContent.innerHTML = "";
  }

  /* ---------- Faner: Robotter / Anatomi ---------- */
  function showTab(name) {
    var robotsView = document.getElementById("robotsView");
    var anatomyView = document.getElementById("anatomyView");
    robotsView.hidden = name !== "robots";
    anatomyView.hidden = name !== "anatomy";
    document.querySelectorAll(".page-tab").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-tab") === name);
    });
    if (name === "anatomy") {
      showAnatomyKind(anatomyKind);
    }
  }

  function showAnatomyKind(kind) {
    if (ANATOMY_PANELS.indexOf(kind) < 0) kind = "humanoid";
    anatomyKind = kind;
    var ids = {
      humanoid: "anatomyHumanoid",
      spot: "anatomySpot",
      brokk: "anatomyBrokk",
      printer: "anatomyPrinter"
    };
    ANATOMY_PANELS.forEach(function (k) {
      var el = document.getElementById(ids[k]);
      if (el) el.hidden = k !== anatomyKind;
    });
    document.querySelectorAll("[data-anatomy]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-anatomy") === anatomyKind);
    });
    mountAnatomy(anatomyKind);
  }

  function initTabs() {
    document.querySelectorAll(".page-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.hasAttribute("data-anatomy")) {
          showAnatomyKind(btn.getAttribute("data-anatomy"));
          return;
        }
        showTab(btn.getAttribute("data-tab"));
      });
    });
  }

  /* ---------- Generel anatomi: 3D-humanoid ---------- */
  function loadScriptOnce(src, flag) {
    if (window[flag]) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error(src)); };
      document.body.appendChild(s);
    });
  }

  function anatomyMountSpec(kind) {
    if (kind === "spot") {
      return {
        wrap: "spotCanvasWrap",
        parts: SPOT_ANATOMY,
        fileJs: "js/spot-parts-data.js",
        b64: "SPOT_PARTS_B64",
        els: ["spotPanelSub", "spotPanelTitle", "spotPanelText", "spotPanelSpecs", "spotExplode"],
        opts: {
          kind: "quad",
          bin: "assets/spot-parts.bin",
          b64: "SPOT_PARTS_B64",
          intro: window.SPOT_ANATOMY_INTRO
        }
      };
    }
    if (kind === "brokk") {
      return {
        wrap: "brokkCanvasWrap",
        parts: BROKK_ANATOMY,
        fileJs: "js/brokk-parts-data.js",
        b64: "BROKK_PARTS_B64",
        els: ["brokkPanelSub", "brokkPanelTitle", "brokkPanelText", "brokkPanelSpecs", "brokkExplode"],
        opts: {
          kind: "biped",
          jointGap: 0.34,
          bin: "assets/brokk-parts.bin",
          b64: "BROKK_PARTS_B64",
          intro: window.BROKK_ANATOMY_INTRO,
          colors: {
            tracks: 0x2a2c2e,
            body: 0xe6b010,
            outrigger: 0xd69a0a,
            boom: 0xf2c220,
            stick: 0x1c1c1e,
            forearm: 0x3a3a3e,
            tool: 0xf5c414
          },
          unitParent: {
            "C:body": "",
            "L:tracks": "C:body",
            "R:tracks": "C:body",
            "L:outrigger": "C:body",
            "R:outrigger": "C:body",
            "C:boom": "C:body",
            "C:stick": "C:boom",
            "C:forearm": "C:stick",
            "C:tool": "C:forearm"
          },
          unitOrder: [
            "C:body", "L:tracks", "R:tracks", "L:outrigger", "R:outrigger",
            "C:boom", "C:stick", "C:forearm", "C:tool"
          ]
        }
      };
    }
    if (kind === "printer") {
      return {
        wrap: "printerCanvasWrap",
        parts: PRINTER_ANATOMY,
        fileJs: "js/printer-parts-data.js",
        b64: "PRINTER_PARTS_B64",
        els: ["printerPanelSub", "printerPanelTitle", "printerPanelText", "printerPanelSpecs", "printerExplode"],
        opts: {
          kind: "biped",
          jointGap: 0.28,
          bin: "assets/printer-parts.bin",
          b64: "PRINTER_PARTS_B64",
          intro: window.PRINTER_ANATOMY_INTRO,
          colors: {
            tracks: 0x2a2a2a,
            body: 0xe4e6ea,
            sensor: 0x4a5056,
            printarm: 0x3a3e42,
            printhead: 0x2c3034
          },
          unitParent: {
            "C:body": "",
            "L:tracks": "C:body",
            "R:tracks": "C:body",
            "C:sensor": "C:body",
            "C:printarm": "C:body",
            "C:printhead": "C:printarm"
          },
          unitOrder: [
            "C:body", "L:tracks", "R:tracks",
            "C:sensor", "C:printarm", "C:printhead"
          ]
        }
      };
    }
    return {
      wrap: "bpCanvasWrap",
      parts: GENERAL_ANATOMY,
      fileJs: "js/humanoid-parts-data.js",
      b64: "HUMANOID_PARTS_B64",
      els: ["bpPanelSub", "bpPanelTitle", "bpPanelText", "bpPanelSpecs", "bpExplode"],
      opts: null
    };
  }

  function mountAnatomy(kind) {
    if (anatomyMounted[kind]) return;
    var spec = anatomyMountSpec(kind);
    var wrap = document.getElementById(spec.wrap);
    if (!wrap) return;
    if (!window.AstronAnatomy3D || !window.THREE) {
      wrap.textContent = "3D kunne ikke starte (Three.js mangler).";
      return;
    }
    wrap.offsetHeight;
    wrap.innerHTML = '<p class="anatomy-status">Indlæser 3D-model…</p>';
    var embed = location.protocol === "file:"
      ? loadScriptOnce(spec.fileJs, spec.b64).catch(function () { return null; })
      : Promise.resolve();
    embed.then(function () {
      if (anatomyMounted[kind]) return;
      var els = {
        canvasWrap: wrap,
        panelSub: document.getElementById(spec.els[0]),
        panelTitle: document.getElementById(spec.els[1]),
        panelText: document.getElementById(spec.els[2]),
        panelSpecs: document.getElementById(spec.els[3]),
        explodeInput: document.getElementById(spec.els[4])
      };
      anatomyMounted[kind] = spec.opts
        ? window.AstronAnatomy3D.mount(els, spec.parts, spec.opts)
        : window.AstronAnatomy3D.mount(els, spec.parts);
    });
  }

  function initAnatomySection() {
    function fill(id, list) {
      var el = document.getElementById(id);
      if (!el || !list) return;
      el.innerHTML = list.map(function (src) {
        return '<li><a href="' + esc(src.url) + '" target="_blank" rel="noopener">' + esc(src.label) + " ↗</a></li>";
      }).join("");
    }
    fill("anatomySources", GENERAL_ANATOMY_SOURCES);
    fill("spotSources", SPOT_ANATOMY_SOURCES);
    fill("brokkSources", BROKK_ANATOMY_SOURCES);
    fill("printerSources", PRINTER_ANATOMY_SOURCES);
  }

  /* ---------- Events ---------- */
  function onGridClick(e) {
    var card = e.target.closest(".card");
    if (card) openModal(card.getAttribute("data-id"));
  }
  if (humanoidGrid) humanoidGrid.addEventListener("click", onGridClick);
  if (jobsiteGrid) jobsiteGrid.addEventListener("click", onGridClick);

  modal.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-close")) closeModal();
    if (e.target.hasAttribute("data-goto-anatomy")) {
      var kind = e.target.getAttribute("data-goto-anatomy") || "humanoid";
      closeModal();
      anatomyKind = kind === "spot" ? "spot" : "humanoid";
      showTab("anatomy");
      document.getElementById("anatomyView").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- Init ---------- */
  document.getElementById("countRobots").textContent = ROBOTS.length;
  initTabs();
  renderGrid();
  initAnatomySection();
})();
