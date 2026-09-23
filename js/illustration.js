/* ==========================================================================
   Byggerobotter — illustration.js
   Delt, skematisk SVG-kropsskabelon + relative hotspot-positioner (0-1,
   andel af viewBox). Illustrationen er GENEREL, ikke robot-specifik — den
   tegner GENERAL_ANATOMY (data.js) i sitets egen "Anatomi"-fane, ikke en
   bestemt robots data. buildIllustrationSVG(anatomyParts) tager derfor et
   anatomy-array direkte, ikke et robot-objekt.
   ========================================================================== */

var ANATOMY_VB = { w: 200, h: 320 };

var PART_LAYOUT = {
  head:    { cx: 0.500, cy: 0.125 },
  torso:   { cx: 0.500, cy: 0.281 },
  compute: { cx: 0.565, cy: 0.253 },
  arms:    { cx: 0.795, cy: 0.344 },
  hands:   { cx: 0.795, cy: 0.531 },
  legs:    { cx: 0.500, cy: 0.719 },
  power:   { cx: 0.500, cy: 0.438 }
};

function illuEsc(str) {
  return String(str).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}

function silhouetteSVG() {
  return (
    '<g class="illu-silhouette">' +
      '<rect x="76" y="18" width="48" height="44" rx="16"/>' +
      '<rect x="62" y="70" width="76" height="92" rx="16"/>' +
      '<rect x="26" y="76" width="30" height="98" rx="12"/>' +
      '<rect x="144" y="76" width="30" height="98" rx="12"/>' +
      '<rect x="66" y="168" width="30" height="120" rx="12"/>' +
      '<rect x="104" y="168" width="30" height="120" rx="12"/>' +
      '<rect x="82" y="128" width="36" height="24" rx="6" class="illu-power-badge"/>' +
      '<rect x="98" y="72" width="26" height="18" rx="5" class="illu-compute-badge"/>' +
      '<rect x="26" y="164" width="24" height="18" rx="7" class="illu-hand"/>' +
      '<rect x="150" y="164" width="24" height="18" rx="7" class="illu-hand"/>' +
    "</g>"
  );
}

function hotspotMarkers(anatomy) {
  return anatomy
    .map(function (part) {
      var pos = part.hotspot || PART_LAYOUT[part.id] || { cx: 0.5, cy: 0.5 };
      var x = (pos.cx * ANATOMY_VB.w).toFixed(1);
      var y = (pos.cy * ANATOMY_VB.h).toFixed(1);
      return (
        '<g class="illu-hotspot" data-part="' + illuEsc(part.id) + '" ' +
          'tabindex="0" role="button" aria-label="' + illuEsc(part.label) + '">' +
          '<circle cx="' + x + '" cy="' + y + '" r="9" class="illu-hotspot-ring"/>' +
          '<circle cx="' + x + '" cy="' + y + '" r="4" class="illu-hotspot-dot"/>' +
        "</g>"
      );
    })
    .join("");
}

function buildIllustrationSVG(anatomyParts) {
  return (
    '<svg class="illu-svg" viewBox="0 0 ' + ANATOMY_VB.w + " " + ANATOMY_VB.h + '" ' +
      'role="group" aria-label="Skematisk anatomi-tegning af en generisk humanoid robot">' +
      silhouetteSVG() +
      hotspotMarkers(anatomyParts) +
    "</svg>"
  );
}
