(function () {
  "use strict";

  var STORAGE_KEY = "astron-live-kanban-v1";

  var boardEl = document.getElementById("board");
  var modal = document.getElementById("cardModal");
  var form = document.getElementById("cardForm");
  var titleEl = document.getElementById("cardModalTitle");
  var fieldId = document.getElementById("fieldId");
  var fieldTitle = document.getElementById("fieldTitle");
  var fieldNotes = document.getElementById("fieldNotes");
  var fieldColumn = document.getElementById("fieldColumn");
  var fieldProject = document.getElementById("fieldProject");
  var fieldOwner = document.getElementById("fieldOwner");
  var fieldPriority = document.getElementById("fieldPriority");
  var deleteBtn = document.getElementById("deleteCardBtn");
  var filterProject = document.getElementById("filterProject");
  var filterOwner = document.getElementById("filterOwner");
  var wipHint = document.getElementById("wipHint");
  var ownerList = document.getElementById("ownerList");
  var importInput = document.getElementById("importInput");

  var cards = [];
  var filters = { project: "alle", owner: "alle" };
  var dragId = null;

  function esc(str) {
    return String(str).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function uid() {
    return "kb-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function cloneSeed() {
    return KANBAN_SEED.map(function (c) {
      return {
        id: c.id,
        title: c.title,
        notes: c.notes || "",
        column: c.column,
        project: c.project,
        owner: c.owner || "",
        priority: c.priority || "medium",
        order: typeof c.order === "number" ? c.order : 0
      };
    });
  }

  function normalizeCard(c) {
    if (!c || !c.title) return null;
    var colIds = KANBAN_COLUMNS.map(function (col) { return col.id; });
    return {
      id: c.id || uid(),
      title: String(c.title).slice(0, 120),
      notes: String(c.notes || "").slice(0, 800),
      column: colIds.indexOf(c.column) >= 0 ? c.column : "backlog",
      project: KANBAN_PROJECTS.indexOf(c.project) >= 0 ? c.project : KANBAN_PROJECTS[0],
      owner: String(c.owner || "").slice(0, 40),
      priority: c.priority === "high" || c.priority === "low" ? c.priority : "medium",
      order: typeof c.order === "number" ? c.order : 0
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return cloneSeed();
      var parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.cards)) return cloneSeed();
      var stored = parsed.cards.map(normalizeCard).filter(Boolean);
      var have = {};
      stored.forEach(function (c) { have[c.id] = true; });
      cloneSeed().forEach(function (c) {
        if (!have[c.id]) stored.push(c);
      });
      return stored;
    } catch (err) {
      return cloneSeed();
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, cards: cards }));
    } catch (err) { /* localStorage kan være blokeret */ }
  }

  function columnMeta(id) {
    for (var i = 0; i < KANBAN_COLUMNS.length; i++) {
      if (KANBAN_COLUMNS[i].id === id) return KANBAN_COLUMNS[i];
    }
    return KANBAN_COLUMNS[0];
  }

  function cardsIn(columnId) {
    return cards
      .filter(function (c) { return c.column === columnId; })
      .sort(function (a, b) { return a.order - b.order; });
  }

  function visible(card) {
    if (filters.project !== "alle" && card.project !== filters.project) return false;
    if (filters.owner !== "alle" && card.owner !== filters.owner) return false;
    return true;
  }

  function uniqueOwners() {
    var seen = {};
    var out = [];
    cards.forEach(function (c) {
      var name = (c.owner || "").trim();
      if (name && !seen[name]) {
        seen[name] = true;
        out.push(name);
      }
    });
    out.sort();
    return out;
  }

  function priorityLabel(p) {
    return p === "high" ? "Høj" : p === "low" ? "Lav" : "Mellem";
  }

  function fillSelect(select, values, withAlle) {
    var html = withAlle ? '<option value="alle">Alle</option>' : "";
    values.forEach(function (v) {
      html += '<option value="' + esc(v) + '">' + esc(v) + "</option>";
    });
    select.innerHTML = html;
  }

  function fillColumnSelect() {
    fieldColumn.innerHTML = KANBAN_COLUMNS.map(function (col) {
      return '<option value="' + esc(col.id) + '">' + esc(col.label) + "</option>";
    }).join("");
  }

  function fillProjectSelect() {
    fieldProject.innerHTML = KANBAN_PROJECTS.map(function (p) {
      return '<option value="' + esc(p) + '">' + esc(p) + "</option>";
    }).join("");
  }

  function refreshFilterOptions() {
    var currentProject = filterProject.value || "alle";
    var currentOwner = filterOwner.value || "alle";
    fillSelect(filterProject, KANBAN_PROJECTS, true);
    fillSelect(filterOwner, uniqueOwners(), true);
    filterProject.value = currentProject;
    filterOwner.value = uniqueOwners().indexOf(currentOwner) >= 0 || currentOwner === "alle"
      ? currentOwner
      : "alle";
    filters.project = filterProject.value;
    filters.owner = filterOwner.value;
    ownerList.innerHTML = uniqueOwners().map(function (n) {
      return '<option value="' + esc(n) + '"></option>';
    }).join("");
  }

  function updateStats() {
    var doing = cards.filter(function (c) { return c.column === "doing"; }).length;
    var doingMeta = columnMeta("doing");
    if (doingMeta.wip && doing > doingMeta.wip) {
      wipHint.textContent = "WIP overskredet: " + doing + " i gang (grænse " + doingMeta.wip + ").";
      wipHint.classList.add("is-warn");
    } else if (doingMeta.wip) {
      wipHint.textContent = "WIP I gang: " + doing + " / " + doingMeta.wip;
      wipHint.classList.remove("is-warn");
    } else {
      wipHint.textContent = "";
    }
  }

  function cardHtml(card) {
    return (
      '<article class="kcard" draggable="true" data-id="' + esc(card.id) + '" tabindex="0">' +
        '<div class="kcard-top">' +
          '<span class="kcard-priority kcard-priority--' + esc(card.priority) + '">' +
            esc(priorityLabel(card.priority)) +
          "</span>" +
          '<span class="kcard-project">' + esc(card.project) + "</span>" +
        "</div>" +
        "<h3>" + esc(card.title) + "</h3>" +
        (card.notes ? '<p class="kcard-notes">' + esc(card.notes) + "</p>" : "") +
        '<div class="kcard-meta">' +
          "<span>" + (card.owner ? esc(card.owner) : "Ingen ansvarlig") + "</span>" +
          '<span class="kcard-move">' +
            '<button type="button" class="kcard-shift" data-dir="-1" aria-label="Flyt til forrige kolonne">←</button>' +
            '<button type="button" class="kcard-shift" data-dir="1" aria-label="Flyt til næste kolonne">→</button>' +
          "</span>" +
        "</div>" +
      "</article>"
    );
  }

  function renderBoard() {
    boardEl.innerHTML = KANBAN_COLUMNS.map(function (col) {
      var list = cardsIn(col.id).filter(visible);
      var total = cardsIn(col.id).length;
      var over = col.wip && total > col.wip;
      var count = col.wip ? total + " / " + col.wip : String(total);
      return (
        '<section class="kanban-col' + (over ? " is-over" : "") + '" data-column="' + esc(col.id) + '">' +
          '<header class="kanban-col-head">' +
            "<div>" +
              "<h2>" + esc(col.label) + "</h2>" +
              '<span class="kanban-col-count">' + esc(count) + "</span>" +
            "</div>" +
            '<button type="button" class="btn kanban-add" data-column="' + esc(col.id) + '">Nyt kort</button>' +
          "</header>" +
          '<div class="kanban-col-body" data-column="' + esc(col.id) + '">' +
            list.map(cardHtml).join("") +
          "</div>" +
        "</section>"
      );
    }).join("");
    updateStats();
  }

  function openModal(card, presetColumn) {
    fillColumnSelect();
    fillProjectSelect();
    if (card) {
      titleEl.textContent = "Rediger kort";
      fieldId.value = card.id;
      fieldTitle.value = card.title;
      fieldNotes.value = card.notes;
      fieldColumn.value = card.column;
      fieldProject.value = card.project;
      fieldOwner.value = card.owner;
      fieldPriority.value = card.priority;
      deleteBtn.hidden = false;
    } else {
      titleEl.textContent = "Nyt kort";
      form.reset();
      fieldId.value = "";
      fieldColumn.value = presetColumn || "backlog";
      fieldProject.value = filters.project !== "alle" ? filters.project : KANBAN_PROJECTS[0];
      fieldPriority.value = "medium";
      deleteBtn.hidden = true;
    }
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("is-open");
    setTimeout(function () { fieldTitle.focus(); }, 0);
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    modal.classList.remove("is-open");
  }

  function findCard(id) {
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].id === id) return cards[i];
    }
    return null;
  }

  function nextOrder(columnId) {
    var list = cardsIn(columnId);
    return list.length ? list[list.length - 1].order + 1 : 0;
  }

  function moveCard(id, columnId, beforeId) {
    var card = findCard(id);
    if (!card) return;
    card.column = columnId;
    var siblings = cardsIn(columnId).filter(function (c) { return c.id !== id; });
    var insertAt = siblings.length;
    if (beforeId) {
      for (var i = 0; i < siblings.length; i++) {
        if (siblings[i].id === beforeId) {
          insertAt = i;
          break;
        }
      }
    }
    siblings.splice(insertAt, 0, card);
    siblings.forEach(function (c, idx) { c.order = idx; });
    save();
    renderBoard();
  }

  function shiftCard(id, dir) {
    var card = findCard(id);
    if (!card) return;
    var idx = -1;
    for (var i = 0; i < KANBAN_COLUMNS.length; i++) {
      if (KANBAN_COLUMNS[i].id === card.column) idx = i;
    }
    var next = idx + dir;
    if (next < 0 || next >= KANBAN_COLUMNS.length) return;
    moveCard(id, KANBAN_COLUMNS[next].id, null);
  }

  document.getElementById("addCardBtn").addEventListener("click", function () {
    openModal(null, "backlog");
  });

  boardEl.addEventListener("click", function (e) {
    var add = e.target.closest(".kanban-add");
    if (add) {
      openModal(null, add.getAttribute("data-column"));
      return;
    }
    var shift = e.target.closest(".kcard-shift");
    if (shift) {
      e.stopPropagation();
      shiftCard(shift.closest(".kcard").getAttribute("data-id"), Number(shift.getAttribute("data-dir")));
      return;
    }
    var cardEl = e.target.closest(".kcard");
    if (cardEl) openModal(findCard(cardEl.getAttribute("data-id")));
  });

  boardEl.addEventListener("keydown", function (e) {
    var cardEl = e.target.closest(".kcard");
    if (!cardEl) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(findCard(cardEl.getAttribute("data-id")));
    }
  });

  boardEl.addEventListener("dragstart", function (e) {
    var cardEl = e.target.closest(".kcard");
    if (!cardEl) return;
    dragId = cardEl.getAttribute("data-id");
    cardEl.classList.add("is-dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", dragId);
  });

  boardEl.addEventListener("dragend", function () {
    boardEl.querySelectorAll(".is-dragging").forEach(function (el) {
      el.classList.remove("is-dragging");
    });
    boardEl.querySelectorAll(".is-drop").forEach(function (el) {
      el.classList.remove("is-drop");
    });
    dragId = null;
  });

  boardEl.addEventListener("dragover", function (e) {
    var body = e.target.closest(".kanban-col-body");
    if (!body) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    boardEl.querySelectorAll(".is-drop").forEach(function (el) {
      el.classList.remove("is-drop");
    });
    body.classList.add("is-drop");
  });

  boardEl.addEventListener("drop", function (e) {
    var body = e.target.closest(".kanban-col-body");
    if (!body || !dragId) return;
    e.preventDefault();
    var overCard = e.target.closest(".kcard");
    var beforeId = overCard && overCard.getAttribute("data-id") !== dragId
      ? overCard.getAttribute("data-id")
      : null;
    moveCard(dragId, body.getAttribute("data-column"), beforeId);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var title = fieldTitle.value.trim();
    if (!title) return;
    var existing = fieldId.value ? findCard(fieldId.value) : null;
    if (existing) {
      var columnChanged = existing.column !== fieldColumn.value;
      existing.title = title;
      existing.notes = fieldNotes.value.trim();
      existing.project = fieldProject.value;
      existing.owner = fieldOwner.value.trim();
      existing.priority = fieldPriority.value;
      if (columnChanged) {
        existing.column = fieldColumn.value;
        existing.order = nextOrder(existing.column);
      }
    } else {
      cards.push({
        id: uid(),
        title: title,
        notes: fieldNotes.value.trim(),
        column: fieldColumn.value,
        project: fieldProject.value,
        owner: fieldOwner.value.trim(),
        priority: fieldPriority.value,
        order: nextOrder(fieldColumn.value)
      });
    }
    save();
    refreshFilterOptions();
    renderBoard();
    closeModal();
  });

  deleteBtn.addEventListener("click", function () {
    var id = fieldId.value;
    if (!id) return;
    if (!window.confirm("Slet kortet? Det kan ikke fortrydes.")) return;
    cards = cards.filter(function (c) { return c.id !== id; });
    save();
    refreshFilterOptions();
    renderBoard();
    closeModal();
  });

  modal.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-close")) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  filterProject.addEventListener("change", function () {
    filters.project = filterProject.value;
    renderBoard();
  });
  filterOwner.addEventListener("change", function () {
    filters.owner = filterOwner.value;
    renderBoard();
  });

  document.getElementById("exportBtn").addEventListener("click", function () {
    var blob = new Blob(
      [JSON.stringify({ version: 1, cards: cards }, null, 2)],
      { type: "application/json" }
    );
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "astron-kanban.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  });

  importInput.addEventListener("change", function () {
    var file = importInput.files && importInput.files[0];
    importInput.value = "";
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(reader.result);
        var list = Array.isArray(parsed) ? parsed : parsed.cards;
        if (!Array.isArray(list)) throw new Error("ugyldig fil");
        cards = list.map(normalizeCard).filter(Boolean);
        save();
        refreshFilterOptions();
        renderBoard();
      } catch (err) {
        window.alert("Filen kunne ikke læses som en Kanban-tavle.");
      }
    };
    reader.readAsText(file);
  });

  document.getElementById("resetBtn").addEventListener("click", function () {
    if (!window.confirm("Overskriv den lokale tavle med den fælles starttavle?")) return;
    cards = cloneSeed();
    save();
    filters = { project: "alle", owner: "alle" };
    refreshFilterOptions();
    renderBoard();
  });

  cards = load();
  fillColumnSelect();
  fillProjectSelect();
  refreshFilterOptions();
  renderBoard();
})();
