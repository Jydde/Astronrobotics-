export const LAYERS = [
  { id: "shell", label: "Ydre skal", swatch: "#8e949c" },
  { id: "skeleton", label: "Skelet/aktuatorer", swatch: "#7f93a8" },
  { id: "hands", label: "Hænder/sener", swatch: "#9fd4d8" },
  { id: "sensors", label: "Sensorer/kameraer", swatch: "#0A84FF" },
  { id: "power", label: "Batteri/power", swatch: "#c4843a" },
  { id: "compute", label: "Compute/AI", swatch: "#c8c0d8" },
];

export const LAYER_INFO = {
  shell: {
    name: "Ydre skal",
    fn: "Satin polymer og visorglas. Servicepaneler der unclippes langs normalen i eksploderet view.",
  },
  skeleton: {
    name: "Skelet/aktuatorer",
    fn: "Spars, motorhuse og lejestakke. Driver 30 DoF gennem kroppen.",
  },
  hands: {
    name: "Hænder/sener",
    fn: "Fem fingre, trisser i håndleddet og senekabler i kanaler. Fingertupper registrerer let tryk.",
  },
  sensors: {
    name: "Sensorer/kameraer",
    fn: "Stereo i visor, dybdemodul, brystkamera og håndfladekameraer til gang og greb.",
  },
  power: {
    name: "Batteri/power",
    fn: "Hovedpakke i torso, kobberbus og ladeport. Spoler i sålerne til trådløs ladning.",
  },
  compute: {
    name: "Compute/AI",
    fn: "Compute-beholder bag brystpladen. Båndkabel til hovedet. Svagt aktivitetslys ved isolering.",
  },
};

export const PARTS = {
  head: {
    name: "Hjelm",
    layer: "shell",
    fn: "Satin polymerhjelm med visor-udskæring. Servicebolte i tindingen.",
  },
  visor: {
    name: "Visorglas",
    layer: "sensors",
    fn: "Røget optisk glas, IOR 1.5. Stereo-kameraer sidder bag glasset.",
  },
  neck: {
    name: "Nakkeled",
    layer: "shell",
    fn: "Pitch/yaw-hus med skumkrave. Skjuler kabelgland til hovedet.",
  },
  chest: {
    name: "Brystpaneler",
    layer: "shell",
    fn: "To serviceplader med 1–2 mm fuge. Unclippes fremad i eksploderet view.",
  },
  back: {
    name: "Rygpaneler",
    layer: "shell",
    fn: "Bagklapper over termik. Unclippes bagud langs normalen.",
  },
  spine: {
    name: "Torsoskelet",
    layer: "skeleton",
    fn: "Spars og ribbe. Bærer batteri, compute og skulderbånd.",
  },
  battery: {
    name: "Torsobatteri",
    layer: "power",
    fn: "Hovedpakke i bugten. Celler, klemmer og glideskinner.",
  },
  bus: {
    name: "Kabelvæv",
    layer: "power",
    fn: "Strøm- og datakabler i gates. 2 kW-sti til skuldre og hofter.",
  },
  compute: {
    name: "Compute-bakke",
    layer: "compute",
    fn: "Onboard inferens bag brystpladen. Kølefinner og bånd til visor.",
  },
  computeHead: {
    name: "Vision-board",
    layer: "compute",
    fn: "Lav-latens vision bag visor. Forbundet med båndkabel.",
  },
  imu: {
    name: "IMU",
    layer: "sensors",
    fn: "Vinkelhastighed og acceleration i torso til balance.",
  },
  shoulderL: {
    name: "Venstre skulderhus",
    layer: "skeleton",
    fn: "Tre-akset aktuator under skulderkappe. Bolte i endefladen.",
  },
  shoulderR: {
    name: "Højre skulderhus",
    layer: "skeleton",
    fn: "Tre-akset aktuator. Primær løfteakse.",
  },
  armL: {
    name: "Venstre overarm",
    layer: "shell",
    fn: "Clamshell-dæksler over spars. Fuge langs siden.",
  },
  armR: {
    name: "Højre overarm",
    layer: "shell",
    fn: "Clamshell-dæksler over spars. Fuge langs siden.",
  },
  forearmL: {
    name: "Venstre underarm",
    layer: "shell",
    fn: "To dæksler der unclippes. Senetromler i håndleddet.",
  },
  forearmR: {
    name: "Højre underarm",
    layer: "shell",
    fn: "To dæksler der unclippes. Senetromler i håndleddet.",
  },
  elbowL: {
    name: "Venstre albue",
    layer: "skeleton",
    fn: "Dobbelt aktuatorskive med synligt hængsel.",
  },
  elbowR: {
    name: "Højre albue",
    layer: "skeleton",
    fn: "Dobbelt aktuatorskive med synligt hængsel.",
  },
  wristL: {
    name: "Venstre håndled",
    layer: "skeleton",
    fn: "Pitch/yaw-hus. Kabelgate til palme.",
  },
  wristR: {
    name: "Højre håndled",
    layer: "skeleton",
    fn: "Pitch/yaw-hus. Kabelgate til palme.",
  },
  handL: {
    name: "Venstre hånd",
    layer: "shell",
    fn: "Palmeplade og fem fingre med knoled. Ikke en vante.",
  },
  handR: {
    name: "Højre hånd",
    layer: "shell",
    fn: "Palmeplade og fem fingre med knoled. Ikke en vante.",
  },
  palmL: {
    name: "Venstre palmekamera",
    layer: "sensors",
    fn: "Nærsyn i håndfladen når visor er tildækket.",
  },
  palmR: {
    name: "Højre palmekamera",
    layer: "sensors",
    fn: "Nærsyn i håndfladen når visor er tildækket.",
  },
  tendonsL: {
    name: "Venstre sener",
    layer: "hands",
    fn: "Senekabler i kanaler. Kraft fra underarmsmotor til fingre.",
  },
  tendonsR: {
    name: "Højre sener",
    layer: "hands",
    fn: "Senekabler i kanaler. Kraft fra underarmsmotor til fingre.",
  },
  pelvis: {
    name: "Bækkenramme",
    layer: "skeleton",
    fn: "Ramme under cowling. Fordeler last til hofteaktuatorer.",
  },
  hipL: {
    name: "Venstre hofte",
    layer: "skeleton",
    fn: "Aktuatorhus i bækkenet. Tre akser ind i låret.",
  },
  hipR: {
    name: "Højre hofte",
    layer: "skeleton",
    fn: "Aktuatorhus i bækkenet. Tre akser ind i låret.",
  },
  thighL: {
    name: "Venstre lårpaneler",
    layer: "shell",
    fn: "To dæksler med fuge. Over spars og knæaktuator.",
  },
  thighR: {
    name: "Højre lårpaneler",
    layer: "shell",
    fn: "To dæksler med fuge. Over spars og knæaktuator.",
  },
  kneeL: {
    name: "Venstre knæ",
    layer: "skeleton",
    fn: "Hængsel og aktuatorskive. Skum ved klem.",
  },
  kneeR: {
    name: "Højre knæ",
    layer: "skeleton",
    fn: "Hængsel og aktuatorskive. Skum ved klem.",
  },
  shinL: {
    name: "Venstre skinneben",
    layer: "shell",
    fn: "Dæksler der unclippes. Ankelmansjet nederst.",
  },
  shinR: {
    name: "Højre skinneben",
    layer: "shell",
    fn: "Dæksler der unclippes. Ankelmansjet nederst.",
  },
  ankleL: {
    name: "Venstre ankel",
    layer: "skeleton",
    fn: "Pitch-hus over skoen. Kabelgate til sål.",
  },
  ankleR: {
    name: "Højre ankel",
    layer: "skeleton",
    fn: "Pitch-hus over skoen. Kabelgate til sål.",
  },
  footL: {
    name: "Venstre sko",
    layer: "shell",
    fn: "Overlæder, tåkappe og gummisål. Ikke en kasse.",
  },
  footR: {
    name: "Højre sko",
    layer: "shell",
    fn: "Overlæder, tåkappe og gummisål. Ikke en kasse.",
  },
};

export function layerLabel(id) {
  return LAYERS.find((l) => l.id === id)?.label ?? id;
}
