import {
  SEED,
  CURRENT_USER_ID,
  ROBOT_COLUMNS,
  EMPTY_COLUMNS,
  PROJECT_COLORS,
  PROJECT_ICONS,
  notifications,
} from "./data.js?v=30";
import { mountAnatomi, unmountAnatomi } from "./anatomi.js?v=30";

const BOARD_COLUMNS = [
  { id: "todo", name: "To Do" },
  { id: "progress", name: "In Progress" },
  { id: "testing", name: "Testing" },
  { id: "done", name: "Done" },
];

const STORAGE_KEY = "astronrobotics.v8";
const OLD_STORAGE_KEYS = [
  "astronrobotics.v1",
  "astronrobotics.v2",
  "astronrobotics.v3",
  "astronrobotics.v4",
  "astronrobotics.v5",
];
const COLUMN_MIGRATE = {
  backlog: "todo",
  research: "todo",
  design: "todo",
  prototype: "progress",
  deployment: "done",
};
const ASSIGNEE_MIGRATE = {
  freja: "jonathan",
  mads: "robert",
  amina: "marin",
  oliver: "marin",
  ida: "jonathan",
  kenji: "robert",
};
const PRIORITY_LABEL = { low: "Lav", medium: "Medium", high: "Høj", urgent: "Kritisk" };
const MONTHS = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
const DUE_FILTERS = [
  { id: "overdue", label: "Forfaldne" },
  { id: "week", label: "Denne uge" },
  { id: "none", label: "Uden deadline" },
];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `id-${Math.random().toString(36).slice(2, 10)}`;
}
function esc(v) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
function clone(v) {
  return JSON.parse(JSON.stringify(v));
}
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function parseISO(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function dayDiff(iso) {
  const date = parseISO(iso);
  if (!date) return null;
  return Math.round((date - parseISO(todayISO())) / 86400000);
}
function formatDue(iso) {
  if (!iso) return { text: "Ingen dato", cls: "" };
  const diff = dayDiff(iso);
  if (diff === 0) return { text: "I dag", cls: "is-today" };
  if (diff === 1) return { text: "I morgen", cls: "is-soon" };
  if (diff === -1) return { text: "I går", cls: "is-over" };
  if (diff < 0) return { text: `For ${Math.abs(diff)} dage siden`, cls: "is-over" };
  if (diff < 7) return { text: `Om ${diff} dage`, cls: "is-soon" };
  const d = parseISO(iso);
  return { text: `${d.getDate()}. ${MONTHS[d.getMonth()]}`, cls: "" };
}
function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function icon(name, size = 16) {
  const p = {
    plus: `<path d="M12 5v14M5 12h14"/>`,
    search: `<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>`,
    board: `<rect x="3" y="4" width="5" height="16" rx="1"/><rect x="10" y="4" width="5" height="11" rx="1"/><rect x="17" y="4" width="4" height="8" rx="1"/>`,
    list: `<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1.2"/><circle cx="4" cy="12" r="1.2"/><circle cx="4" cy="18" r="1.2"/>`,
    bell: `<path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>`,
    menu: `<path d="M4 7h16M4 12h16M4 17h16"/>`,
    more: `<circle cx="6" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18" cy="12" r="1.3"/>`,
    settings: `<circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>`,
    reset: `<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>`,
    check: `<path d="M5 12l5 5L20 7"/>`,
    x: `<path d="M6 6l12 12M18 6L6 18"/>`,
    cal: `<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>`,
    flag: `<path d="M6 4v16M6 5h11l-2 3 2 3H6"/>`,
    user: `<circle cx="12" cy="8" r="3.2"/><path d="M5 19c1.4-3.2 3.8-4.8 7-4.8S17.6 15.8 19 19"/>`,
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p[name] || ""}</svg>`;
}

function logoMark() {
  return `<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
    <rect x="1" y="1" width="30" height="30" rx="4" fill="none" stroke="#1d1d1f" stroke-width="1.3"/>
    <ellipse cx="16" cy="16" rx="10" ry="4.6" fill="none" stroke="#1d1d1f" stroke-width="1.15" transform="rotate(-28 16 16)"/>
    <circle cx="16" cy="16" r="2.3" fill="#0066CC"/>
  </svg>`;
}

function projectGlyph(type, size = 16) {
  const g = {
    walker: `<circle cx="12" cy="5" r="2.2"/><path d="M12 7.4v6M9 13l3 0.4 3-.4M9 22l3-8 3 8M8 16h8"/>`,
    rover: `<rect x="6" y="11" width="12" height="6" rx="1.5"/><circle cx="9" cy="18.5" r="2"/><circle cx="16" cy="18.5" r="2"/><path d="M12 11V7h4"/>`,
    swarm: `<circle cx="8" cy="9" r="2"/><circle cx="16" cy="8" r="2"/><circle cx="12" cy="16" r="2.2"/><path d="M9.5 10.5l2 4M14.5 10l-1.5 4"/>`,
    arm: `<path d="M6 18h5l3-6 4 2"/><circle cx="18" cy="14" r="2"/>`,
    sat: `<circle cx="12" cy="12" r="3"/><path d="M12 5v2M12 17v2M5 12h2M17 12h2M7 7l1.4 1.4M15.6 15.6L17 17M17 7l-1.4 1.4M8.4 15.6L7 17"/>`,
    chip: `<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M12 7V4M12 17v3M7 12H4M17 12h3"/>`,
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">${g[type] || g.sat}</svg>`;
}

function emptyRobot() {
  return `<svg class="empty-illus" viewBox="0 0 88 88" fill="none" stroke="currentColor" stroke-width="1.3">
    <rect x="22" y="30" width="44" height="34" rx="6"/>
    <circle cx="36" cy="46" r="3"/>
    <circle cx="52" cy="46" r="3"/>
    <path d="M36 56h16" stroke-linecap="round"/>
    <rect x="36" y="18" width="16" height="12" rx="2"/>
  </svg>`;
}

function migrateColumns(next) {
  next.members = clone(SEED.members);
  for (const task of next.tasks || []) {
    if (COLUMN_MIGRATE[task.columnId]) task.columnId = COLUMN_MIGRATE[task.columnId];
    if (ASSIGNEE_MIGRATE[task.assigneeId]) task.assigneeId = ASSIGNEE_MIGRATE[task.assigneeId];
    if (!SEED.members.some((m) => m.id === task.assigneeId)) task.assigneeId = CURRENT_USER_ID;
  }
  if (next.filter?.assignee && !SEED.members.some((m) => m.id === next.filter.assignee)) {
    next.filter.assignee = null;
  }
  for (const proj of next.projects || []) {
    proj.columns = BOARD_COLUMNS.map((c) => ({ ...c }));
  }
  return next;
}

function loadState() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      for (const key of OLD_STORAGE_KEYS) {
        raw = localStorage.getItem(key);
        if (raw) break;
      }
    }
    if (!raw) return migrateColumns(clone(SEED));
    const parsed = JSON.parse(raw);
    const next = {
      ...clone(SEED),
      ...parsed,
      members: clone(SEED.members),
      labels: parsed.labels?.length ? parsed.labels : clone(SEED.labels),
      projects: parsed.projects?.length ? parsed.projects : clone(SEED.projects),
      tasks: parsed.tasks || clone(SEED.tasks),
      filter: { ...clone(SEED.filter), ...(parsed.filter || {}) },
    };
    return migrateColumns(next);
  } catch {
    return migrateColumns(clone(SEED));
  }
}

const state = loadState();
for (const key of OLD_STORAGE_KEYS) localStorage.removeItem(key);
state.quickAdd = null;
state.renaming = null;
state.colMenu = null;
state.modal = null; // { type: 'task'|'project'|'settings', id? }
state.notifOpen = false;
state.appTab = /anatomi/.test(location.hash)
  ? "anatomi"
  : /board/.test(location.hash)
    ? "board"
    : "home";
state.drawer = false;
state.toasts = [];
state.sort = { key: "status", dir: 1 };
state.projectDraft = null;
state._focusSearch = false;

function persist() {
  const skip = [
    "quickAdd",
    "renaming",
    "colMenu",
    "modal",
    "notifOpen",
    "appTab",
    "drawer",
    "toasts",
    "sort",
    "projectDraft",
    "_focusSearch",
  ];
  const rest = {};
  for (const [k, v] of Object.entries(state)) if (!skip.includes(k)) rest[k] = v;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
}

function member(id) {
  return state.members.find((m) => m.id === id);
}
function label(id) {
  return state.labels.find((l) => l.id === id);
}
function projectById(id) {
  return state.projects.find((p) => p.id === id);
}
function project() {
  if (state.currentProjectId === "all") return null;
  return projectById(state.currentProjectId) || null;
}
function taskById(id) {
  return state.tasks.find((t) => t.id === id);
}
function columns() {
  return BOARD_COLUMNS.map((c) => ({ ...c }));
}
function avatar(user, size = "") {
  if (!user) return `<span class="avatar ${size}">—</span>`;
  return `<span class="avatar ${size}" style="--hue:${user.hue}" title="${esc(user.name)}">${esc(initials(user.name))}</span>`;
}

function matchesTask(task) {
  if (state.currentProjectId !== "all" && task.projectId !== state.currentProjectId) return false;
  const q = state.search.trim().toLowerCase();
  if (q) {
    const hay = [task.title, task.description, member(task.assigneeId)?.name, ...(task.labels || []).map((id) => label(id)?.name)]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!hay.includes(q)) return false;
  }
  const f = state.filter;
  if (f.priority && task.priority !== f.priority) return false;
  if (f.assignee && task.assigneeId !== f.assignee) return false;
  if (f.labels.length && !f.labels.every((id) => task.labels.includes(id))) return false;
  if (f.due === "overdue" && (!task.due || dayDiff(task.due) >= 0)) return false;
  if (f.due === "week" && (!task.due || dayDiff(task.due) < 0 || dayDiff(task.due) > 7)) return false;
  if (f.due === "none" && task.due) return false;
  return true;
}

function visibleTasks() {
  return state.tasks.filter(matchesTask);
}
function tasksInColumn(colId) {
  return visibleTasks()
    .filter((t) => t.columnId === colId)
    .sort((a, b) => a.order - b.order);
}
function countProject(id) {
  if (id === "all") return state.tasks.length;
  return state.tasks.filter((t) => t.projectId === id).length;
}

function toast(message) {
  const id = uid();
  state.toasts.push({ id, message });
  renderToasts();
  setTimeout(() => {
    state.toasts = state.toasts.filter((t) => t.id !== id);
    renderToasts();
  }, 2400);
}
function renderToasts() {
  let wrap = $(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  wrap.innerHTML = state.toasts.map((t) => `<div class="toast">${esc(t.message)}</div>`).join("");
}

function activeChips() {
  const chips = [];
  if (state.search.trim()) chips.push({ key: "search", label: `“${state.search.trim()}”` });
  if (state.filter.priority) chips.push({ key: "priority", label: PRIORITY_LABEL[state.filter.priority] });
  if (state.filter.assignee) chips.push({ key: "assignee", label: member(state.filter.assignee)?.name });
  if (state.filter.due) chips.push({ key: "due", label: DUE_FILTERS.find((d) => d.id === state.filter.due)?.label });
  for (const id of state.filter.labels) {
    const l = label(id);
    if (l) chips.push({ key: `label:${id}`, label: l.name });
  }
  return chips.filter((c) => c.label);
}

function renderCard(task) {
  const due = formatDue(task.due);
  const tags = (task.labels || [])
    .map((id) => label(id))
    .filter(Boolean)
    .map((l) => `<span class="tag" style="--tag:${l.color}">${esc(l.name)}</span>`)
    .join("");
  const who = member(task.assigneeId);
  const proj = projectById(task.projectId);
  return `
    <article class="card" data-p="${esc(task.priority)}" data-id="${esc(task.id)}" tabindex="0">
      ${proj ? `<span class="proj-chip" style="--tag:${proj.color}">${esc(proj.name)}</span>` : ""}
      <h3>${esc(task.title)}</h3>
      ${task.description ? `<p>${esc(task.description)}</p>` : ""}
      ${tags ? `<div class="tags">${tags}</div>` : ""}
      ${typeof task.progress === "number" ? `<div class="progress" title="${task.progress}%"><span style="width:${task.progress}%"></span></div>` : ""}
      <div class="card-foot">
        <span class="prio" data-p="${esc(task.priority)}">${PRIORITY_LABEL[task.priority]}</span>
        ${task.due ? `<span class="due ${due.cls}">${icon("cal", 13)} ${esc(due.text)}</span>` : ""}
        <span class="who">${avatar(who)} <span>${esc(who?.name || "")}</span></span>
      </div>
    </article>`;
}

function renderColumn(col) {
  const items = tasksInColumn(col.id);
  const renaming = state.renaming === col.id;
  const menu = state.colMenu === col.id;
  return `
    <section class="column" data-col="${esc(col.id)}">
      <div class="column-head">
        ${
          renaming
            ? `<input class="col-rename" data-rename="${esc(col.id)}" value="${esc(col.name)}" />`
            : `<h2>${esc(col.name)}</h2>`
        }
        <span class="col-count">${items.length}</span>
        <button class="col-menu" data-col-menu="${esc(col.id)}" aria-label="Kolonne">${icon("more", 16)}
          ${
            menu
              ? `<div class="menu">
                  <button data-rename-start="${esc(col.id)}">Omdøb kolonne</button>
                  <button data-delete-col="${esc(col.id)}">Slet kolonne</button>
                </div>`
              : ""
          }
        </button>
      </div>
      <div class="cards" data-col-body="${esc(col.id)}">
        ${items.map(renderCard).join("") || `<div class="empty-col">Ingen opgaver</div>`}
        <button class="add-card" data-new-in="${esc(col.id)}">${icon("plus", 15)} Tilføj opgave</button>
      </div>
    </section>`;
}

function renderSidebar() {
  const proj = project();
  const onAll = state.currentProjectId === "all";
  const filtersPrio = Object.entries(PRIORITY_LABEL)
    .map(
      ([k, v]) => `
      <button class="nav-item ${state.filter.priority === k ? "is-on is-active" : ""}" data-filter-prio="${k}">
        <span class="check">${state.filter.priority === k ? icon("check", 11) : ""}</span>
        <span>${v}</span>
      </button>`
    )
    .join("");
  const dueItems = DUE_FILTERS.map(
    (d) => `
      <button class="nav-item ${state.filter.due === d.id ? "is-on is-active" : ""}" data-filter-due="${d.id}">
        <span class="check">${state.filter.due === d.id ? icon("check", 11) : ""}</span>
        <span>${d.label}</span>
      </button>`
  ).join("");
  const people = state.members
    .map(
      (m) => `
      <button class="nav-item ${state.filter.assignee === m.id ? "is-on is-active" : ""}" data-filter-who="${m.id}">
        ${avatar(m)}
        <span>${esc(m.name)}</span>
      </button>`
    )
    .join("");
  const labs = `<div class="tag-cloud">${state.labels
    .map((l) => {
      const on = state.filter.labels.includes(l.id);
      return `<button type="button" class="${on ? "is-on" : ""}" data-label="${l.id}" style="--tag:${l.color}">${esc(l.name)}</button>`;
    })
    .join("")}</div>`;

  return `
    <aside class="sidebar">
      <div class="traffic" aria-hidden="true">
        <span class="tl close"></span>
        <span class="tl min"></span>
        <span class="tl max"></span>
      </div>
      <a class="brand" href="#" data-action="home">
        ${logoMark()}
        <span class="brand-text">
          <strong>Astron<em>robotics</em></strong>
          <span>Workspace</span>
        </span>
      </a>
      <button class="cta-new" data-action="new-project">${icon("plus", 18)} Nyt projekt</button>
      <div>
        <div class="nav-label">Projekter</div>
        <button class="nav-item ${onAll ? "is-active" : ""}" data-project="all">
          ${icon("board", 16)}
          <span>Alle projekter</span>
          <em class="count">${countProject("all")}</em>
        </button>
        ${state.projects
          .map((p) => {
            const active = !onAll && proj && p.id === proj.id;
            return `<button class="nav-item ${active ? "is-active" : ""}" data-project="${p.id}">
              <span class="dot" style="background:${p.color}"></span>
              <span class="nav-copy">
                <span>${esc(p.name)}</span>
                <small>${esc(p.description || "")}</small>
              </span>
              <em class="count">${countProject(p.id)}</em>
            </button>`;
          })
          .join("")}
      </div>
      <div>
        <div class="nav-label">Tags</div>
        ${labs}
      </div>
      <div>
        <div class="nav-label">Prioritet</div>
        ${filtersPrio}
      </div>
      <div>
        <div class="nav-label">Deadline</div>
        ${dueItems}
      </div>
      <div>
        <div class="nav-label">Ansvarlig</div>
        ${people}
      </div>
      <div class="sidebar-foot">
        <button class="ghost-btn" data-action="settings">${icon("settings", 15)} Indstillinger</button>
        <button class="ghost-btn" data-action="reset">${icon("reset", 15)} Nulstil demo</button>
      </div>
    </aside>`;
}

function renderTopbar() {
  const proj = project();
  const me = member(CURRENT_USER_ID) || SEED.members[0];
  const vis = visibleTasks();
  const title = proj ? proj.name : "Alle projekter";
  const subtitle = proj ? proj.description : "Orion Walker, Luna Rover og Hive Swarm — samlet ét sted.";
  return `
    <header class="topbar">
      <button class="icon-btn sidebar-toggle" data-action="drawer" aria-label="Menu">${icon("menu")}</button>
      <div class="head-copy">
        <h1>${esc(title)}</h1>
        <p>${esc(subtitle)}</p>
      </div>
      <div class="search">
        <span class="search-icon">${icon("search", 16)}</span>
        <input id="search-input" type="search" placeholder="Søg i alle projekter…" value="${esc(state.search)}" autocomplete="off" />
      </div>
      <div class="top-actions">
        <div class="seg">
          <button class="${state.view === "board" ? "is-on" : ""}" data-view="board">${icon("board", 14)} <span>Board</span></button>
          <button class="${state.view === "list" ? "is-on" : ""}" data-view="list">${icon("list", 14)} <span>Liste</span></button>
        </div>
        <button class="icon-btn" data-action="notif" aria-label="Notifikationer">
          ${icon("bell")}
          <span class="badge"></span>
          ${
            state.notifOpen
              ? `<div class="notif-pop">${notifications
                  .map((n) => `<div class="notif-item"><strong>${esc(n.text)}</strong><span>${esc(n.time)}</span></div>`)
                  .join("")}</div>`
              : ""
          }
        </button>
        <button class="primary" data-action="new-task">${icon("plus", 16)} Ny opgave</button>
        <div class="profile">
          ${avatar(me, "lg")}
          <div class="profile-meta"><strong>${esc(me.name)}</strong><span>${esc(me.role)}</span></div>
        </div>
      </div>
    </header>
    <div class="board-meta">
      <div class="stats">
        <span><b>${vis.length}</b> synlige opgaver</span>
        <span><b>${vis.filter((t) => t.columnId !== "done").length}</b> åbne</span>
        <span><b>${vis.filter((t) => t.due && dayDiff(t.due) < 0 && t.columnId !== "done").length}</b> forfaldne</span>
      </div>
    </div>
    ${
      activeChips().length
        ? `<div class="chips">${activeChips()
            .map((c) => `<span class="chip">${esc(c.label)} <button data-clear="${esc(c.key)}" aria-label="Fjern">${icon("x", 12)}</button></span>`)
            .join("")}</div>`
        : ""
    }`;
}

function renderBoard() {
  const cols = columns();
  if (!cols.length) {
    return `<div class="empty-page">${emptyRobot()}<h3>Tomt board</h3><p>Tilføj en kolonne, eller opret den første robot-opgave.</p></div>`;
  }
  return `
    <div class="board">
      ${cols.map(renderColumn).join("")}
      <button class="add-column" data-action="add-column">${icon("plus", 16)} Ny kolonne</button>
    </div>`;
}

function sortedList() {
  const { key, dir } = state.sort;
  const copy = visibleTasks().slice();
  const rank = { low: 1, medium: 2, high: 3, urgent: 4 };
  copy.sort((a, b) => {
    let av, bv;
    if (key === "title") {
      av = a.title.toLowerCase();
      bv = b.title.toLowerCase();
    } else if (key === "priority") {
      av = rank[a.priority];
      bv = rank[b.priority];
    } else if (key === "due") {
      av = a.due || "9999";
      bv = b.due || "9999";
    } else if (key === "assignee") {
      av = member(a.assigneeId)?.name || "";
      bv = member(b.assigneeId)?.name || "";
    } else if (key === "project") {
      av = projectById(a.projectId)?.name || "";
      bv = projectById(b.projectId)?.name || "";
    } else {
      av = columns().findIndex((c) => c.id === a.columnId);
      bv = columns().findIndex((c) => c.id === b.columnId);
    }
    return av < bv ? -dir : av > bv ? dir : 0;
  });
  return copy;
}

function renderList() {
  const rows = sortedList();
  if (!rows.length) {
    return `<div class="empty-page">${emptyRobot()}<h3>Ingen opgaver at vise</h3><p>Prøv at fjerne et filter, eller opret den første robot-opgave.</p>
      <button class="primary" data-action="new-task" style="margin:16px auto">${icon("plus", 16)} Ny opgave</button></div>`;
  }
  const th = (key, label) =>
    `<th><button data-sort="${key}">${label}${state.sort.key === key ? (state.sort.dir === 1 ? " ↑" : " ↓") : ""}</button></th>`;
  return `<div class="list-wrap"><table class="list">
    <thead><tr>${th("title", "Opgave")}${th("project", "Projekt")}${th("status", "Status")}${th("priority", "Prioritet")}${th("due", "Deadline")}${th("assignee", "Ansvarlig")}</tr></thead>
    <tbody>${rows
      .map((t) => {
        const due = formatDue(t.due);
        const col = columns().find((c) => c.id === t.columnId);
        const m = member(t.assigneeId);
        const p = projectById(t.projectId);
        return `<tr data-id="${esc(t.id)}">
          <td class="title-cell">${esc(t.title)}<span class="sub">${esc(t.description || "")}</span></td>
          <td>${p ? `<span class="proj-chip" style="--tag:${p.color}">${esc(p.name)}</span>` : "—"}</td>
          <td>${esc(col?.name || "")}</td>
          <td><span class="prio" data-p="${esc(t.priority)}">${PRIORITY_LABEL[t.priority]}</span></td>
          <td class="due ${due.cls}">${t.due ? esc(due.text) : "—"}</td>
          <td>${m ? `${avatar(m)} <span style="margin-left:8px">${esc(m.name)}</span>` : "—"}</td>
        </tr>`;
      })
      .join("")}</tbody></table></div>`;
}

function renderHome() {
  return `
    <article class="home-page">
      <img
        class="home-photo"
        src="img/atlas.jpg"
        alt="Boston Dynamics Atlas"
        width="2945"
        height="3927"
      />
      <div class="home-copy">
        <h1>Coming Soon</h1>
        <p>Astron Robotics</p>
      </div>
      <p class="home-credit">Foto: Atlas, Boston Dynamics</p>
    </article>`;
}

function renderAppChrome() {
  return `
    <a class="skip-site" href="#main">Spring til indhold</a>
    <header class="site-nav">
      <a class="site-brand" href="#" data-action="home">
        ${logoMark()}
        <span>Astron Robotics</span>
      </a>
      <nav class="site-tabs" aria-label="Sider">
        <button class="${state.appTab === "home" ? "is-on" : ""}" data-app-tab="home">Hjem</button>
        <button class="${state.appTab === "board" ? "is-on" : ""}" data-app-tab="board">Board</button>
        <button class="${state.appTab === "anatomi" ? "is-on" : ""}" data-app-tab="anatomi">Anatomi 3</button>
      </nav>
      <button type="button" class="login-link" data-action="login">Log ind</button>
    </header>`;
}

function renderApp() {
  if (state.currentProjectId !== "all" && !projectById(state.currentProjectId)) {
    state.currentProjectId = "all";
  }
  unmountAnatomi();
  let body = "";
  if (state.appTab === "home") body = renderHome();
  else if (state.appTab === "anatomi") body = `<div id="anatomi-root" class="anatomi-page"></div>`;
  else
    body = `
        <div class="shell ${state.drawer ? "drawer-open" : ""}">
          ${state.drawer ? `<div class="drawer-scrim" data-action="drawer"></div>` : ""}
          ${renderSidebar()}
          <div class="main">
            ${renderTopbar()}
            ${state.view === "board" ? renderBoard() : renderList()}
          </div>
        </div>`;
  $("#app").innerHTML = `
    <div class="app-root">
      ${renderAppChrome()}
      <div id="main" class="app-main">${body}</div>
    </div>`;
  if (state.appTab === "anatomi") mountAnatomi(document.getElementById("anatomi-root"));
  bindDnD();
  if (state._focusSearch) {
    const el = $("#search-input");
    el?.focus();
    el?.setSelectionRange(el.value.length, el.value.length);
    state._focusSearch = false;
  }
  if (state.quickAdd) $(`form[data-quick="${state.quickAdd}"] input`)?.focus();
  if (state.renaming) {
    const input = $(`input[data-rename="${state.renaming}"]`);
    input?.focus();
    input?.select();
  }
  renderOverlay();
  renderToasts();
}

function optionList(items, value, lab, val) {
  return items.map((i) => `<option value="${esc(val(i))}" ${val(i) === value ? "selected" : ""}>${esc(lab(i))}</option>`).join("");
}

function renderOverlay() {
  const root = $("#overlay-root");
  if (!state.modal) {
    root.innerHTML = "";
    return;
  }
  if (state.modal.type === "project") return renderProjectModal();
  if (state.modal.type === "settings") return renderSettings();
  if (state.modal.type === "login") return renderLogin();
  renderTaskModal();
}

function renderLogin() {
  $("#overlay-root").innerHTML = `
    <div class="scrim" data-scrim>
      <form class="login-card" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <h2 id="login-title">Log ind</h2>
        <label for="login-email">E-mail</label>
        <input id="login-email" name="email" type="email" autocomplete="username" required />
        <label for="login-pass">Adgangskode</label>
        <input id="login-pass" name="password" type="password" autocomplete="current-password" required />
        <button type="submit" class="login-submit">Fortsæt</button>
      </form>
    </div>`;
  $("#login-email")?.focus();
}

function renderTaskModal() {
  const root = $("#overlay-root");
  const isNew = state.modal.id === "new";
  const defaultProjectId = state.currentProjectId === "all" ? state.projects[0]?.id : state.currentProjectId;
  const task = isNew
    ? {
        title: "",
        description: "",
        columnId: state.modal.columnId || columns()[0]?.id,
        projectId: defaultProjectId,
        priority: "medium",
        due: "",
        labels: [],
        assigneeId: CURRENT_USER_ID,
      }
    : { ...taskById(state.modal.id) };
  if (!isNew && !taskById(state.modal.id)) {
    state.modal = null;
    root.innerHTML = "";
    return;
  }
  root.innerHTML = `
    <div class="scrim" data-scrim>
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal-main">
          <p class="kicker">${esc(projectById(task.projectId)?.name || "Ny opgave")}</p>
          <textarea class="title" data-field="title" placeholder="Opgavens titel" rows="2">${esc(task.title)}</textarea>
          <textarea class="desc" data-field="description" placeholder="Kort beskrivelse — hvad skal ske, og hvornår ved vi at det er færdigt?">${esc(task.description || "")}</textarea>
        </div>
        <div class="modal-side">
          <div class="field"><label>Projekt</label>
            <select data-field="projectId">${optionList(state.projects, task.projectId, (p) => p.name, (p) => p.id)}</select></div>
          <div class="field"><label>Status</label>
            <select data-field="columnId">${optionList(columns(), task.columnId, (c) => c.name, (c) => c.id)}</select></div>
          <div class="field"><label>Prioritet</label>
            <select data-field="priority">${optionList(Object.keys(PRIORITY_LABEL), task.priority, (k) => PRIORITY_LABEL[k], (k) => k)}</select></div>
          <div class="field"><label>Deadline</label>
            <input type="date" data-field="due" value="${esc(task.due || "")}" /></div>
          <div class="field"><label>Ansvarlig</label>
            <select data-field="assigneeId">${optionList(state.members, task.assigneeId, (m) => m.name, (m) => m.id)}</select></div>
          <div class="field"><label>Tags</label>
            <div class="label-picker">${state.labels
              .map((l) => {
                const on = (task.labels || []).includes(l.id);
                return `<button type="button" class="${on ? "is-on" : ""}" data-toggle-label="${l.id}" style="--tag:${l.color}">${esc(l.name)}</button>`;
              })
              .join("")}</div></div>
          <div class="modal-actions">
            ${isNew ? `<span></span>` : `<button class="danger-btn" data-action="delete-task">Slet opgave</button>`}
            <button class="primary" data-action="save-task">${isNew ? "Opret opgave" : "Gem"}</button>
          </div>
        </div>
      </div>
    </div>`;
  root.querySelector("textarea.title")?.focus();
}

function renderProjectModal() {
  const d = state.projectDraft || {
    name: "",
    description: "",
    color: PROJECT_COLORS[0],
    icon: "walker",
    template: "robot",
  };
  state.projectDraft = d;
  $("#overlay-root").innerHTML = `
    <div class="scrim" data-scrim>
      <div class="modal narrow" role="dialog" aria-modal="true">
        <div class="modal-main">
          <p class="kicker">Nyt projekt</p>
          <div class="form-stack">
            <div class="field">
              <label>Projektnavn</label>
              <input type="text" data-draft="name" placeholder="f.eks. Nova Arm" value="${esc(d.name)}" />
            </div>
            <div class="field">
              <label>Kort beskrivelse</label>
              <textarea class="desc" data-draft="description" placeholder="Hvad bygger I, og hvem er det til?" style="min-height:88px">${esc(d.description)}</textarea>
            </div>
            <div class="field">
              <label>Farve</label>
              <div class="swatches">${PROJECT_COLORS.map(
                (c) => `<button type="button" class="swatch ${d.color === c ? "is-on" : ""}" data-draft-color="${c}" style="background:${c}"></button>`
              ).join("")}</div>
            </div>
            <div class="field">
              <label>Ikon</label>
              <div class="icon-pick">${PROJECT_ICONS.map(
                (ic) => `<button type="button" class="icon-choice ${d.icon === ic ? "is-on" : ""}" data-draft-icon="${ic}">${projectGlyph(ic, 18)}</button>`
              ).join("")}</div>
            </div>
            <div class="field">
              <label>Startskabelon</label>
              <div class="templates">
                <button type="button" class="tpl ${d.template === "robot" ? "is-on" : ""}" data-draft-tpl="robot">
                  <strong>Robot-standard</strong>
                  <span>To Do, In Progress, Testing, Done</span>
                </button>
                <button type="button" class="tpl ${d.template === "empty" ? "is-on" : ""}" data-draft-tpl="empty">
                  <strong>Tomt board</strong>
                  <span>To Do, In Progress, Testing og Done</span>
                </button>
              </div>
            </div>
            <button class="primary" data-action="create-project">${icon("plus", 16)} Opret projekt</button>
          </div>
        </div>
      </div>
    </div>`;
  $("#overlay-root").querySelector("[data-draft=name]")?.focus();
}

function renderSettings() {
  $("#overlay-root").innerHTML = `
    <div class="scrim" data-scrim>
      <div class="modal narrow" role="dialog">
        <div class="modal-main">
          <p class="kicker">Indstillinger</p>
          <h2 style="margin:0 0 8px;font-size:24px;letter-spacing:-.03em">Astronrobotics</h2>
          <p style="color:var(--text-2);line-height:1.55">Et lyst overblik over robotprojekter. Dummy-data bor i browseren. Nulstil når I vil starte forfra.</p>
          <p style="color:var(--text-3);font-size:13px;margin-top:18px">Genveje: N ny opgave · P nyt projekt · ⌘K søg · Esc luk</p>
          <div class="modal-actions" style="margin-top:24px">
            <button class="danger-btn" data-action="reset">Nulstil demo</button>
            <button class="primary ghost" data-action="close">Luk</button>
          </div>
        </div>
      </div>
    </div>`;
}

function closeOverlays() {
  state.modal = null;
  state.projectDraft = null;
  state.colMenu = null;
  state.notifOpen = false;
  renderApp();
}

function readTaskForm() {
  const root = $(".modal");
  if (!root) return null;
  const get = (f) => root.querySelector(`[data-field="${f}"]`)?.value ?? "";
  return {
    title: get("title").trim(),
    description: get("description").trim(),
    columnId: get("columnId"),
    projectId: get("projectId") || (state.currentProjectId === "all" ? state.projects[0]?.id : state.currentProjectId),
    priority: get("priority"),
    due: get("due") || null,
    assigneeId: get("assigneeId"),
    labels: $$(".label-picker button.is-on", root).map((b) => b.dataset.toggleLabel),
  };
}

function saveTask() {
  const data = readTaskForm();
  if (!data || !data.title) {
    toast("Giv opgaven en titel.");
    return;
  }
  if (state.modal.id === "new") {
    const projectId = data.projectId || state.projects[0]?.id;
    const colTasks = state.tasks.filter((t) => t.columnId === data.columnId);
    state.tasks.push({ id: uid(), order: colTasks.length, ...data, projectId });
    toast("Opgave oprettet.");
  } else {
    const t = taskById(state.modal.id);
    if (t) Object.assign(t, data);
    toast("Gemt.");
  }
  persist();
  state.modal = null;
  renderApp();
}

function createProject() {
  const d = state.projectDraft || {};
  if (!d.name?.trim()) {
    toast("Giv projektet et navn.");
    return;
  }
  const cols = (d.template === "empty" ? EMPTY_COLUMNS : ROBOT_COLUMNS).map((c) => ({ id: c.id, name: c.name }));
  const p = {
    id: uid(),
    name: d.name.trim(),
    description: (d.description || "").trim() || "Nyt robotprojekt.",
    color: d.color || PROJECT_COLORS[0],
    icon: d.icon || "walker",
    columns: cols,
  };
  state.projects.push(p);
  state.currentProjectId = "all";
  state.modal = null;
  state.projectDraft = null;
  persist();
  toast(`${p.name} er oprettet.`);
  renderApp();
}

function addColumn() {
  const p = project();
  p.columns.push({ id: uid().slice(0, 8), name: "Ny kolonne" });
  state.renaming = p.columns.at(-1).id;
  persist();
  renderApp();
}

function deleteColumn(id) {
  const p = project();
  if (p.columns.length <= 1) {
    toast("Mindst én kolonne skal blive.");
    return;
  }
  const fallback = p.columns.find((c) => c.id !== id).id;
  state.tasks.forEach((t) => {
    if (t.projectId === p.id && t.columnId === id) t.columnId = fallback;
  });
  p.columns = p.columns.filter((c) => c.id !== id);
  persist();
  toast("Kolonne slettet.");
  renderApp();
}

function clearFilter(key) {
  if (key === "search") state.search = "";
  else if (key === "priority") state.filter.priority = null;
  else if (key === "assignee") state.filter.assignee = null;
  else if (key === "due") state.filter.due = null;
  else if (key.startsWith("label:")) state.filter.labels = state.filter.labels.filter((x) => x !== key.slice(6));
  persist();
  renderApp();
}

let suppressClick = false;

function handleClick(e) {
  if (suppressClick) {
    suppressClick = false;
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  const t = e.target.closest(
    "[data-action], [data-project], [data-view], [data-id], [data-new-in], [data-col-menu], [data-rename-start], [data-delete-col], [data-clear], [data-sort], [data-toggle-label], [data-label], [data-filter-prio], [data-filter-due], [data-filter-who], [data-draft-color], [data-draft-icon], [data-draft-tpl], [data-scrim], [data-app-tab]"
  );
  if (!t) {
    if (!e.target.closest(".menu, .notif-pop") && (state.colMenu || state.notifOpen)) {
      state.colMenu = null;
      state.notifOpen = false;
      renderApp();
    }
    return;
  }
  if (t.dataset.scrim !== undefined && e.target === t) {
    closeOverlays();
    return;
  }

  const act = t.dataset.action;
  if (act === "new-project") {
    state.modal = { type: "project" };
    state.projectDraft = { name: "", description: "", color: PROJECT_COLORS[0], icon: "walker", template: "robot" };
    renderApp();
    return;
  }
  if (act === "new-task") {
    state.modal = { type: "task", id: "new" };
    renderApp();
    return;
  }
  if (act === "save-task") {
    saveTask();
    return;
  }
  if (act === "create-project") {
    createProject();
    return;
  }
  if (act === "delete-task") {
    if (state.modal?.id && state.modal.id !== "new") {
      state.tasks = state.tasks.filter((x) => x.id !== state.modal.id);
      persist();
      state.modal = null;
      toast("Opgaven er slettet.");
      renderApp();
    }
    return;
  }
  if (act === "add-column") {
    addColumn();
    return;
  }
  if (act === "drawer") {
    state.drawer = !state.drawer;
    renderApp();
    return;
  }
  if (act === "notif") {
    state.notifOpen = !state.notifOpen;
    renderApp();
    return;
  }
  if (act === "settings") {
    state.modal = { type: "settings" };
    renderApp();
    return;
  }
  if (act === "close") {
    closeOverlays();
    return;
  }
  if (act === "login") {
    state.modal = { type: "login" };
    renderApp();
    return;
  }
  if (act === "home") {
    e.preventDefault();
    state.appTab = "home";
    history.replaceState(null, "", "#home");
    renderApp();
    return;
  }
  if (act === "reset") {
    if (confirm("Nulstil boardet til det oprindelige robot-demo?")) {
      localStorage.removeItem(STORAGE_KEY);
      Object.assign(state, loadState());
      state.modal = null;
      state.quickAdd = null;
      renderApp();
      toast("Demoen er nulstillet.");
    }
    return;
  }
  if (t.dataset.project) {
    state.currentProjectId = t.dataset.project;
    state.drawer = false;
    persist();
    renderApp();
    return;
  }
  if (t.dataset.appTab) {
    state.appTab = t.dataset.appTab;
    const hash = { anatomi: "anatomi", home: "home", board: "board" }[state.appTab] || "anatomi";
    history.replaceState(null, "", `#${hash}`);
    renderApp();
    return;
  }
  if (t.dataset.view) {
    state.view = t.dataset.view;
    persist();
    renderApp();
    return;
  }
  if (t.dataset.newIn) {
    state.modal = { type: "task", id: "new", columnId: t.dataset.newIn };
    renderApp();
    return;
  }
  if (t.dataset.colMenu) {
    e.stopPropagation();
    state.colMenu = state.colMenu === t.dataset.colMenu ? null : t.dataset.colMenu;
    renderApp();
    return;
  }
  if (t.dataset.renameStart) {
    state.renaming = t.dataset.renameStart;
    state.colMenu = null;
    renderApp();
    return;
  }
  if (t.dataset.deleteCol) {
    deleteColumn(t.dataset.deleteCol);
    return;
  }
  if (t.dataset.clear) {
    clearFilter(t.dataset.clear);
    return;
  }
  if (t.dataset.sort) {
    if (state.sort.key === t.dataset.sort) state.sort.dir *= -1;
    else {
      state.sort.key = t.dataset.sort;
      state.sort.dir = 1;
    }
    renderApp();
    return;
  }
  if (t.dataset.toggleLabel) {
    t.classList.toggle("is-on");
    return;
  }
  if (t.dataset.label) {
    const set = new Set(state.filter.labels);
    if (set.has(t.dataset.label)) set.delete(t.dataset.label);
    else set.add(t.dataset.label);
    state.filter.labels = [...set];
    persist();
    renderApp();
    return;
  }
  if (t.dataset.filterPrio) {
    state.filter.priority = state.filter.priority === t.dataset.filterPrio ? null : t.dataset.filterPrio;
    persist();
    renderApp();
    return;
  }
  if (t.dataset.filterDue) {
    state.filter.due = state.filter.due === t.dataset.filterDue ? null : t.dataset.filterDue;
    persist();
    renderApp();
    return;
  }
  if (t.dataset.filterWho) {
    state.filter.assignee = state.filter.assignee === t.dataset.filterWho ? null : t.dataset.filterWho;
    persist();
    renderApp();
    return;
  }
  if (t.dataset.draftColor) {
    state.projectDraft.color = t.dataset.draftColor;
    renderOverlay();
    return;
  }
  if (t.dataset.draftIcon) {
    state.projectDraft.icon = t.dataset.draftIcon;
    renderOverlay();
    return;
  }
  if (t.dataset.draftTpl) {
    state.projectDraft.template = t.dataset.draftTpl;
    renderOverlay();
    return;
  }
  if (t.dataset.id && t.matches(".card, tr")) {
    state.modal = { type: "task", id: t.dataset.id };
    renderApp();
  }
}

function handleSubmit(e) {
  if (e.target.closest("form.login-card")) {
    e.preventDefault();
    state.modal = null;
    toast("Log ind er ikke åbent endnu.");
    renderApp();
    return;
  }
  const form = e.target.closest("form.quick-add");
  if (!form) return;
  e.preventDefault();
  const title = form.title.value.trim();
  const colId = form.dataset.quick;
  if (!title) {
    state.quickAdd = null;
    renderApp();
    return;
  }
  const projectId = state.currentProjectId === "all" ? state.projects[0]?.id : state.currentProjectId;
  const colTasks = state.tasks.filter((t) => t.columnId === colId);
  state.tasks.push({
    id: uid(),
    title,
    description: "",
    projectId,
    columnId: colId,
    priority: "medium",
    due: null,
    labels: [],
    assigneeId: CURRENT_USER_ID,
    order: colTasks.length,
  });
  state.quickAdd = null;
  persist();
  toast("Opgave tilføjet.");
  renderApp();
}

function handleChange(e) {
  if (e.target.matches("input.col-rename")) {
    const col = columns().find((c) => c.id === e.target.dataset.rename);
    if (col && e.target.value.trim()) col.name = e.target.value.trim();
    state.renaming = null;
    persist();
    renderApp();
  }
}

function handleInput(e) {
  if (e.target.id === "search-input") {
    state.search = e.target.value;
    persist();
    state._focusSearch = true;
    renderApp();
  }
  if (e.target.dataset.draft) {
    state.projectDraft[e.target.dataset.draft] = e.target.value;
  }
  if (e.target.matches("textarea.title, textarea.desc")) {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    if (state.modal?.type === "task" && state.modal.id !== "new") {
      const task = taskById(state.modal.id);
      if (task && e.target.dataset.field) {
        task[e.target.dataset.field] = e.target.dataset.field === "title" ? e.target.value.trim() : e.target.value;
        persist();
      }
    }
  }
}

function moveCardFocus(key) {
  const cols = $$(".board .column");
  if (!cols.length) return;
  const active = document.activeElement?.closest?.(".card");
  const col = active?.closest(".column") || cols[0];
  const ci = Math.max(0, cols.indexOf(col));
  const list = $$(".card", col);
  if (key === "ArrowDown" || key === "ArrowUp") {
    if (!list.length) return;
    const i = active ? list.indexOf(active) : key === "ArrowDown" ? -1 : 0;
    const next = key === "ArrowDown" ? Math.min(list.length - 1, i + 1) : Math.max(0, i <= 0 ? 0 : i - 1);
    list[next]?.focus();
    return;
  }
  const nextCi = key === "ArrowRight" ? Math.min(cols.length - 1, ci + (active ? 1 : 0)) : Math.max(0, ci - 1);
  const toList = $$(".card", cols[nextCi]);
  if (!toList.length) {
    cols[nextCi].querySelector(".add-card")?.focus();
    return;
  }
  const fromIdx = active ? Math.max(0, list.indexOf(active)) : 0;
  toList[Math.min(fromIdx, toList.length - 1)].focus();
}

function handleKey(e) {
  const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName);
  if (e.key === "Escape") {
    state.modal = null;
    state.quickAdd = null;
    state.renaming = null;
    state.drawer = false;
    state.notifOpen = false;
    state.projectDraft = null;
    renderApp();
    return;
  }
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    $("#search-input")?.focus();
    return;
  }
  if (!typing && !state.modal && state.appTab === "board" && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
    moveCardFocus(e.key);
    return;
  }
  if (!typing && !state.modal && e.key === "Enter" && e.target.matches(".card")) {
    e.preventDefault();
    state.modal = { type: "task", id: e.target.dataset.id };
    renderApp();
    return;
  }
  if (!typing && e.key.toLowerCase() === "n") {
    e.preventDefault();
    state.modal = { type: "task", id: "new" };
    renderApp();
  }
  if (!typing && e.key.toLowerCase() === "p") {
    e.preventDefault();
    state.modal = { type: "project" };
    state.projectDraft = { name: "", description: "", color: PROJECT_COLORS[0], icon: "walker", template: "robot" };
    renderApp();
  }
  if (e.target.matches("input.col-rename") && e.key === "Enter") e.target.blur();
  if (state.modal?.type === "task" && (e.metaKey || e.ctrlKey) && e.key === "Enter") {
    e.preventDefault();
    saveTask();
  }
}

/* DnD */
const drag = { active: false, id: null, startX: 0, startY: 0, ghost: null, offsetX: 0, offsetY: 0 };

function bindDnD() {
  $$(".card").forEach((card) => card.addEventListener("pointerdown", onPointerDown));
}
function onPointerDown(e) {
  if (e.button !== 0) return;
  if (e.target.closest("button, a, input")) return;
  const card = e.target.closest(".card");
  if (!card) return;
  drag.id = card.dataset.id;
  drag.startX = e.clientX;
  drag.startY = e.clientY;
  const rect = card.getBoundingClientRect();
  drag.offsetX = e.clientX - rect.left;
  drag.offsetY = e.clientY - rect.top;
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp, { once: true });
}
function onPointerMove(e) {
  const dx = e.clientX - drag.startX;
  const dy = e.clientY - drag.startY;
  if (!drag.active && Math.hypot(dx, dy) < 6) return;
  if (!drag.active) startDrag();
  if (!drag.ghost) return;
  drag.ghost.style.left = `${e.clientX - drag.offsetX}px`;
  drag.ghost.style.top = `${e.clientY - drag.offsetY}px`;
  updateDropTarget(e.clientX, e.clientY);
}
function startDrag() {
  drag.active = true;
  const source = $(`.card[data-id="${drag.id}"]`);
  if (!source) return;
  source.classList.add("is-dragging");
  const ghost = source.cloneNode(true);
  ghost.classList.add("drag-ghost");
  ghost.style.width = `${source.getBoundingClientRect().width}px`;
  ghost.style.left = `${drag.startX - drag.offsetX}px`;
  ghost.style.top = `${drag.startY - drag.offsetY}px`;
  document.body.appendChild(ghost);
  drag.ghost = ghost;
  document.body.style.userSelect = "none";
}
function updateDropTarget(x, y) {
  $$(".column").forEach((c) => c.classList.remove("is-hot"));
  $$(".drop-line").forEach((n) => n.remove());
  const col = document.elementFromPoint(x, y)?.closest(".column");
  if (!col) return;
  col.classList.add("is-hot");
  const body = $("[data-col-body]", col);
  const cards = $$(".card:not(.is-dragging)", body);
  let insertBefore = null;
  for (const el of cards) {
    const r = el.getBoundingClientRect();
    if (y < r.top + r.height / 2) {
      insertBefore = el;
      break;
    }
  }
  const line = document.createElement("div");
  line.className = "drop-line";
  const add = $(".add-card, .quick-add", body);
  if (insertBefore) body.insertBefore(line, insertBefore);
  else if (add) body.insertBefore(line, add);
  else body.appendChild(line);
}
function onPointerUp() {
  window.removeEventListener("pointermove", onPointerMove);
  const was = drag.active;
  const id = drag.id;
  const hot = $(".column.is-hot");
  cleanupDrag();
  if (!was || !id) return;
  suppressClick = true;
  if (hot) {
    const colId = hot.dataset.col;
    const task = taskById(id);
    if (!task) return;
    const from = task.columnId;
    task.columnId = colId;
    const line = $(".drop-line");
    const siblings = $$(".card:not(.is-dragging), .drop-line", $("[data-col-body]", hot));
    let index = siblings.findIndex((n) => n.classList.contains("drop-line"));
    if (index < 0) index = siblings.filter((n) => n.classList.contains("card")).length;
    const inCol = state.tasks.filter((t) => t.projectId === task.projectId && t.columnId === colId && t.id !== id).sort((a, b) => a.order - b.order);
    inCol.splice(index, 0, task);
    inCol.forEach((t, i) => (t.order = i));
    persist();
    const colName = columns().find((c) => c.id === colId)?.name;
    if (from !== colId) toast(`Flyttet til ${colName}.`);
  }
  renderApp();
}
function cleanupDrag() {
  drag.ghost?.remove();
  drag.ghost = null;
  drag.active = false;
  drag.id = null;
  document.body.style.userSelect = "";
  $$(".column").forEach((c) => c.classList.remove("is-hot"));
  $$(".drop-line").forEach((n) => n.remove());
}

document.addEventListener("click", handleClick);
document.addEventListener("submit", handleSubmit);
document.addEventListener("change", handleChange);
document.addEventListener("input", handleInput);
document.addEventListener("keydown", handleKey);

const params = new URLSearchParams(location.search);
if (params.get("project") && state.projects.some((p) => p.id === params.get("project"))) state.currentProjectId = params.get("project");
if (["board", "list"].includes(params.get("view"))) state.view = params.get("view");
if (params.get("modal") === "project") {
  state.modal = { type: "project" };
  state.projectDraft = { name: "", description: "", color: PROJECT_COLORS[0], icon: "walker", template: "robot" };
}
if (params.get("modal") === "task") state.modal = { type: "task", id: params.get("id") || "new" };
if (params.get("task")) state.modal = { type: "task", id: params.get("task") };

try {
  persist();
  renderApp();
} catch (err) {
  console.error(err);
  if (!sessionStorage.getItem("astron-recovered")) {
    sessionStorage.setItem("astron-recovered", "1");
    localStorage.removeItem(STORAGE_KEY);
    for (const key of OLD_STORAGE_KEYS) localStorage.removeItem(key);
    location.reload();
  } else {
    document.getElementById("app").innerHTML =
      `<p style="padding:48px;font-family:Inter,sans-serif">Boardet kunne ikke indlæses. Prøv at opdatere siden.</p>`;
  }
}
