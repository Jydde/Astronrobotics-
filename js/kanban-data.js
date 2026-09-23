var KANBAN_COLUMNS = [
  { id: "backlog", label: "Backlog", wip: null },
  { id: "doing", label: "I gang", wip: 3 },
  { id: "waiting", label: "Venter", wip: null },
  { id: "parked", label: "Parkeret", wip: null },
  { id: "done", label: "Færdigt", wip: null }
];

var KANBAN_PROJECTS = [
  "Command Center",
  "Robot Anatomi",
  "Producenter",
  "Use cases",
  "Mass production",
  "Moon Base Alpha",
  "Webshop",
  "Website",
  "Byggerobotter",
  "Firma"
];

var KANBAN_SEED = [
  {
    id: "kb-site",
    title: "Erstat Coming Soon med den rigtige forside",
    notes: "Live-sitet er stadig splash. Næste skridt er indhold, ikke et nyt katalog.",
    column: "doing",
    project: "Website",
    owner: "",
    priority: "high",
    order: 1
  },
  {
    id: "kb-byggerobotter",
    title: "Byggerobotter-kataloget klar til publicering",
    notes: "Selvstændigt produkt. Del ikke data med hjemmepleje-prototypen.",
    column: "doing",
    project: "Byggerobotter",
    owner: "",
    priority: "medium",
    order: 2
  },
  {
    id: "kb-brand",
    title: "Afklar brand og kontakt (mail, CVR, adresse)",
    notes: "Selskabet er Astron Robotics ApS. Live-sitet har endnu ingen kontaktsektion.",
    column: "backlog",
    project: "Firma",
    owner: "",
    priority: "medium",
    order: 0
  },
  {
    id: "kb-team-sync",
    title: "Aftal hvordan tavlen synces i teamet",
    notes: "Eksporter JSON, eller tjek js/kanban-data.js ind og deploy sammen med sitet.",
    column: "backlog",
    project: "Website",
    owner: "",
    priority: "low",
    order: 1
  },
  {
    id: "kb-coming-soon",
    title: "Coming Soon live på astronrobotics.dk",
    notes: "Vercel-splash med baggrund, partikler og tagline om construction humanoids.",
    column: "done",
    project: "Website",
    owner: "",
    priority: "medium",
    order: 0
  },
  {
    id: "kb-command-center",
    title: "Command Center — internt projekt-interface",
    notes:
      "Internt site bag login: idékatalog, hvor vi er, faser, Gantt og proces. " +
      "Det I fokuserer på nu. Lever på astronrobotics.dk.",
    column: "doing",
    project: "Command Center",
    owner: "",
    priority: "high",
    order: 0
  },
  {
    id: "kb-robot-anatomi",
    title: "Robot Anatomi",
    notes:
      "På standby efter mødet 1.9. Oplægget findes. Vi vender tilbage, når Command Center-interfacet kører.",
    column: "waiting",
    project: "Robot Anatomi",
    owner: "",
    priority: "medium",
    order: 0
  },
  {
    id: "kb-producenter",
    title: "Oversigt over producenter af humanoide robotter",
    notes: "Idé — senere, ét ad gangen fra køen.",
    column: "backlog",
    project: "Producenter",
    owner: "",
    priority: "low",
    order: 2
  },
  {
    id: "kb-use-cases",
    title: "Use cases i byggebranchen",
    notes: "Idé — senere, ét ad gangen fra køen.",
    column: "backlog",
    project: "Use cases",
    owner: "",
    priority: "low",
    order: 3
  },
  {
    id: "kb-mass-production",
    title: "Timeline for mass production",
    notes: "Hvor, hvornår, og hvordan robotterne fordeles. Idé — senere, ét ad gangen.",
    column: "backlog",
    project: "Mass production",
    owner: "",
    priority: "low",
    order: 4
  },
  {
    id: "kb-moon-base",
    title: "Humanoide robotter og Moon Base Alpha",
    notes: "Idé — senere, ét ad gangen fra køen.",
    column: "backlog",
    project: "Moon Base Alpha",
    owner: "",
    priority: "low",
    order: 5
  },
  {
    id: "kb-webshop",
    title: "Webshop med legetøjs-humanoide robotter",
    notes: "Parkeret. Ikke i den aktive kø.",
    column: "parked",
    project: "Webshop",
    owner: "",
    priority: "low",
    order: 0
  }
];
