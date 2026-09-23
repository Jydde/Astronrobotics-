/*
 * Byggerobotter — robotdata
 * ---------------------------------------------------------------------------
 * Én robot = ét objekt i arrayet nedenfor. Tilføj en robot ved at kopiere
 * skabelonen nedenfor og udfylde felterne — kopiér ikke en eksisterende
 * robot (undgår at bære robot-specifik tekst videre ved en fejl).
 *
 * Felter:
 *   id             unik streng (kebab-case)
 *   name           robottens navn
 *   manufacturer   producent
 *   country        oprindelsesland
 *   formFactor     "Humanoid" | opgavetype for byggepladsrobotter
 *                  (Nedrivning, Layout, Boring, Armering, Murværk, Inspektion)
 *   category       "humanoid" | "jobsite" — styrer opdelingen på robotsiden
 *   status         modenhed: "Koncept" | "Prototype" | "Pilot" | "I brug"
 *   tagline        kort sætning der fanger essensen
 *   image          sti i assets/robots/ — tom = placeholder-ikon
 *   youtube        YouTube-video-id (officielt/producent, vises i detaljevisningen)
 *   specs          fysiske specs — flad, samme mønster som Website Frontend
 *   description    kort beskrivende afsnit om robotten generelt
 *   constructionUse hvad den konkret gør (eller er tiltænkt) i byggebranchen
 *   verified       true = tal bekræftet på tværs af flere uafhængige kilder
 *   sources        liste af {label, url}
 *
 * VIGTIGT: felter markeret verified:false bør bekræftes hos producenten før
 * de bruges offentligt. Flere af robotterne her er tidlige prototyper eller
 * pilotprojekter — status og kilder afspejler det ærligt, i stedet for at
 * overdrive hvor langt de reelt er.
 *
 * NB — anatomi er IKKE et felt her: den interaktive anatomi-illustration
 * (SVG + valgfri 3D) er bevidst generel, ikke robot-specifik — se
 * GENERAL_ANATOMY nederst i denne fil, og "Anatomi"-fanen i index.html/app.js.
 * Én robot arver ikke sin egen anatomi-tekst; alle 5 deler den samme
 * forklaring af, hvordan en humanoid robot generelt er bygget op.
 */

/*
ROBOT-SKABELON — kopiér denne, udfyld, og indsæt som et nyt objekt i ROBOTS.
{
  id: "producent-model",
  name: "",
  manufacturer: "",
  country: "",
  formFactor: "",                 // "Humanoid" | "Nedrivning" | "Layout" | "Boring" | "Armering" | "Murværk" | "Inspektion"
  category: "",                   // "humanoid" | "jobsite"
  status: "",                     // "Koncept" | "Prototype" | "Pilot" | "I brug"
  tagline: "",
  image: "",
  youtube: "",                   // YouTube-id, fx "dQw4w9WgXcQ"
  specs: {
    type: "", height: "", weight: "", dof: "", payload: "", battery: "", speed: ""
  },
  description: "",
  constructionUse: "",
  verified: false,
  sources: []
}
*/

var ROBOTS = [
  {
    id: "persona-humanoid",
    name: "Persona Humanoid",
    manufacturer: "Persona AI",
    country: "USA",
    formFactor: "Humanoid",
    category: "humanoid",
    status: "Prototype",
    tagline: "Bygget specifikt til svejsning og fabrikation på skibsværfter",
    image: "assets/robots/persona-humanoid.webp",
    youtube: "lDNrnmCj2DM",
    specs: {
      type: "To-benet humanoid robot",
      height: "175 cm",
      weight: "85 kg",
      dof: "Ikke offentliggjort for kroppen samlet — hånden alene har 12 frihedsgrader",
      payload: "Ikke offentliggjort",
      battery: "Ikke offentliggjort",
      speed: "Ikke offentliggjort"
    },
    description:
      "Persona AI er en Houston-baseret opstartsvirksomhed grundlagt i 2024 af Nic Radford " +
      "(tidligere NASA og grundlægger af Apptronik/Nauticus Robotics) og Jerry Pratt (tidligere " +
      "teknisk chef hos Figure AI). I modsætning til de fleste andre humanoide robotter er " +
      "Persona Humanoid designet fra bunden til én bestemt opgave: svejsning i tung industri.",
    constructionUse:
      "Skal udføre svejseopgaver på skibsværfter i et samarbejde med den sydkoreanske " +
      "skibsbygger HD Hyundai og stålproducenten POSCO — arbejde der i dag udføres af " +
      "faglærte svejsere under fysisk krævende forhold i trange stålsektioner. Et Gen 1-system " +
      "har allerede demonstreret, at det kan tænde en svejsebrænder, holde en stabil lysbue og " +
      "lægge en svejsesøm, hvilket ifølge Persona AI validerer den grundlæggende styring og " +
      "kinematik. De første egentlige prototyper ventes klar ved udgangen af 2026, med " +
      "feltafprøvning på et værft i 2027. Der er endnu ingen robot i faktisk drift. Persona " +
      "Humanoids fysiske design — bl.a. en teknisk tekstil-\"hud\" mod UV, svejsesprøjt og " +
      "saltvand, samt fodsåler tilpasset ujævnt beton, metalgitter og stilladser — er beskrevet " +
      "mere generelt i anatomi-gennemgangen under \"Anatomi\"-fanen.",
    verified: false,
    sources: [
      { label: "Persona AI — Humanoid Robots in Construction", url: "https://persona.ai/humanoid-robots-for-construction/" },
      { label: "Persona AI — First Spark: Hand on the Torch", url: "https://persona.ai/robot-welding-in-a-real-industrial-environment/" },
      { label: "Persona AI — Humanoid Robots For Pipe Welding and Fabrication", url: "https://persona.ai/pipe-welding-humanoids/" },
      { label: "IEEE Spectrum — How Persona AI Makes Humanoids Pay Off In Welding", url: "https://spectrum.ieee.org/persona-ai-humanoid-robot-welding" },
      { label: "The Robot Report — Persona AI rejser $27M til svejserobotter på skibsværfter", url: "https://www.therobotreport.com/persona-ai-raises-27m-develops-purpose-built-humanoid-robots-shipyards/" },
      { label: "PR Newswire — HD Hyundai og Persona AI-aftale om svejserobotter", url: "https://www.prnewswire.com/news-releases/hd-hyundai-and-persona-ai-sign-agreement-to-deploy-humanoid-welding-robots-for-shipbuilding-automation-302449258.html" }
    ]
  },
  {
    id: "apptronik-apollo",
    name: "Apollo",
    manufacturer: "Apptronik",
    country: "USA",
    formFactor: "Humanoid",
    category: "humanoid",
    status: "Pilot",
    tagline: "Fabriks- og lagerrobot, som Apptronik selv peger mod byggebranchen",
    image: "assets/robots/apptronik-apollo.jpg",
    youtube: "uJOA5IDaL5g",
    specs: {
      type: "To-benet humanoid robot",
      height: "173 cm",
      weight: "72,6 kg",
      dof: "Ikke officielt bekræftet af Apptronik (sekundære kilder nævner 28-71)",
      payload: "25 kg",
      battery: "Udskiftelige batteripakker, ca. 4 timer pr. pakke",
      speed: "Ikke offentliggjort"
    },
    description:
      "Apollo er Apptroniks generelle humanoide robot, i dag primært afprøvet i fabrikker og " +
      "lagre — blandt andet hos Mercedes-Benz og logistikvirksomheden GXO. Robottens ydre form " +
      "er bevidst designet af designbureauet argo design til at virke tilgængelig og " +
      "genkendelig, ikke bare funktionel.",
    constructionUse:
      "Apptronik har offentligt peget på byggebranchen som en kommende vertikal for Apollo, " +
      "herunder et strategisk samarbejde med Jabil om at videreudvikle robotten mod " +
      "industrielle og byggerelaterede opgaver. Der findes endnu ingen dokumenteret pilot på " +
      "en byggeplads — det nuværende arbejde foregår i fabriks- og lagermiljøer.",
    verified: false,
    sources: [
      { label: "Apptronik — Apollo (officiel produktside)", url: "https://apptronik.com/apollo" },
      { label: "Apptronik — Apptronik Unveils Apollo", url: "https://apptronik.com/news-collection/apptronik-unveils-apollo" },
      { label: "Designboom — Apollo: designet til opgaver mennesker helst undgår", url: "https://www.designboom.com/technology/humanoid-robot-apollo-hazardous-tasks-human-safety-apptronik-08-29-2023/" },
      { label: "QVIRO — Apptronik Apollo specifikationer", url: "https://qviro.com/product/apptronik/apollo/specifications" },
      { label: "RoboZaps — Apptronik Apollo Review 2026", url: "https://blog.robozaps.com/b/apptronik-apollo-review" }
    ]
  },
  {
    id: "boston-dynamics-atlas",
    name: "Atlas (elektrisk)",
    manufacturer: "Boston Dynamics",
    country: "USA / Sydkorea (ejet af Hyundai Motor Group)",
    formFactor: "Humanoid",
    category: "humanoid",
    status: "Prototype",
    tagline: "Hyundais roadmap nævner byggebranchen som en fremtidig vertikal for Atlas",
    image: "assets/robots/boston-dynamics-atlas.jpg",
    youtube: "29ECwExc-_M",
    specs: {
      type: "To-benet humanoid robot, fuldt elektrisk",
      height: "190 cm",
      weight: "90 kg",
      dof: "56 (fuldt roterende led, fordelt over hele kroppen)",
      payload: "50 kg (moment) / 30 kg (vedvarende)",
      battery: "Ca. 4 timer, hot-swap batteri",
      speed: "Ikke offentliggjort"
    },
    description:
      "Den nye, fuldt elektriske Atlas er Boston Dynamics' efterfølger til den tidligere " +
      "hydrauliske forskningsplatform — et skifte i aktuatorteknologi der uddybes generelt " +
      "under \"Anatomi\"-fanen. Produktion begyndte i 2026, og de første enheder går til " +
      "Hyundais eget Robotics Metaplant Application Center samt et samarbejde med Google " +
      "DeepMind — begge dele fabriksarbejde, ikke byggeri.",
    constructionUse:
      "Hyundai — som ejer Boston Dynamics — navngiver eksplicit byggebranchen som én af de " +
      "sektorer, Atlas skal udvides til efter den indledende fabriksfase i egne anlæg (planlagt " +
      "fra 2028), sammen med logistik, energi og facility management. Der findes endnu ingen " +
      "konkret pilot på en byggeplads.",
    verified: false,
    sources: [
      { label: "Boston Dynamics — Atlas afsløret til industrielt arbejde", url: "https://bostondynamics.com/blog/boston-dynamics-unveils-new-atlas-robot-to-revolutionize-industry/" },
      { label: "Boston Dynamics — An Electric New Era for Atlas", url: "https://bostondynamics.com/blog/electric-new-era-for-atlas/" },
      { label: "Humanoid Index — Atlas (Electric) specs & status", url: "https://humanoidindex.org/robots/atlas-electric" },
      { label: "Manufacturing Digital — Hyundais planer for Atlas, inkl. byggebranchen", url: "https://manufacturingdigital.com/news/boston-dynamics-hyundais-plans-for-humanoid-ai-robots" }
    ]
  },
  {
    id: "figure-03",
    name: "Figure 03",
    manufacturer: "Figure AI",
    country: "USA",
    formFactor: "Humanoid",
    category: "humanoid",
    status: "Pilot",
    tagline: "Bilfabriksrobot hvor byggeri og infrastruktur nævnes som fremvoksende anvendelse",
    image: "assets/robots/figure-03.webp",
    youtube: "Eu5mYMavctM",
    specs: {
      type: "To-benet humanoid robot",
      height: "173 cm",
      weight: "61 kg",
      dof: "Ikke offentliggjort",
      payload: "20 kg",
      battery: "5 timer (2,3 kWh strukturelt batteri i overkroppen)",
      speed: "1,2 m/s (gang)"
    },
    description:
      "Figure AI afsluttede en 11 måneder lang pilot med forgængeren Figure 02 på BMWs fabrik " +
      "i Spartanburg, USA. Figure 03 er den nyeste model, med et batteri integreret direkte i " +
      "kropsstrukturen frem for som en separat pakke, og hænder med mere taktil sensorik — begge " +
      "dele eksempler, der går igen i den generelle anatomi-gennemgang under \"Anatomi\"-fanen.",
    constructionUse:
      "Figures arbejde foregår i dag udelukkende på bilfabrikker (BMW Spartanburg, med en " +
      "testopstart i Leipzig fra april 2026 og en egentlig pilotfase ventet sommeren 2026). " +
      "Brancheanalytikere peger på byggeri og infrastrukturvedligehold som en fremvoksende " +
      "anvendelse, i takt med at robotten beviser sin pålidelighed i kontrollerede miljøer — " +
      "men der er endnu ingen dokumenteret byggeplads-pilot.",
    verified: false,
    sources: [
      { label: "Figure AI — Introducing Figure 03", url: "https://www.figure.ai/news/introducing-figure-03" },
      { label: "BMW Group — pilotprojekt med humanoide robotter", url: "https://www.press.bmwgroup.com/global/article/detail/T0455864EN/bmw-group-to-deploy-humanoid-robots-in-production-in-germany-for-the-first-time?language=en" },
      { label: "Humanoid.guide — Figure 03 specs & pris", url: "https://humanoid.guide/product/figure-03/" },
      { label: "QVIRO — Figure 02 specifikationer", url: "https://qviro.com/product/figure/figure-02/specifications" }
    ]
  },
  {
    id: "unitree-g1",
    name: "Unitree G1 (\"Douglas\")",
    manufacturer: "Unitree Robotics",
    country: "Kina",
    formFactor: "Humanoid",
    category: "humanoid",
    status: "I brug",
    tagline: "Allerede i drift på en levende byggeplads — til dokumentation, ikke fysisk arbejde",
    image: "assets/robots/unitree-g1.jpg",
    youtube: "CIkdq7Zf4Zw",
    specs: {
      type: "To-benet humanoid robot",
      height: "127 cm",
      weight: "35 kg (den konkrete robot hos Tilbury Douglas vejer ca. 30 kg)",
      dof: "23-43 for kroppen, afhængig af konfiguration",
      payload: "2 kg",
      battery: "Ca. 2 timer"
    },
    description:
      "Unitree G1 er en relativt kompakt og billig forsknings- og udviklingsplatform fra det " +
      "kinesiske robotfirma Unitree — ikke bygget specifikt til byggebranchen, men allerede " +
      "taget i brug der af en konkret entreprenør. Platformen sælges med udskiftelige " +
      "hånd-moduler (se \"Anatomi\"-fanen for hvordan det generelt adskiller sig fra en " +
      "fastmonteret hånd), så samme robot kan konfigureres meget forskelligt afhængigt af opgaven.",
    constructionUse:
      "Den britiske entreprenør Tilbury Douglas blev i april 2026 den første tier-1-entreprenør " +
      "til at sætte en humanoid robot i drift på en levende byggeplads: en Unitree G1, tilpasset " +
      "med Tilbury Douglas' egen AI og døbt »Douglas«. Robotten navigerer selvstændigt rundt på " +
      "pladsen med 360°-kamera, LiDAR og dybdekamera for at indsamle fremdrifts- og " +
      "sikkerhedsdata, og kan bruge trapper, elevatorer og døre uden hjælp. Efter 10 ugers " +
      "afprøvning forventede firmaet en besparelse på ca. 40 timer om måneden i administrativt " +
      "arbejde. Robotten udfører ikke selv fysisk byggearbejde — den dokumenterer og overvåger.",
    verified: true,
    sources: [
      { label: "Tilbury Douglas — første entreprenør med humanoid robot på byggeplads", url: "https://www.tilburydouglas.co.uk/tilbury-douglas-becomes-first-contractor-to-launch-a-humanoid-robot-on-construction-site/" },
      { label: "Construction News — Tilbury Douglas sætter robot i drift på levende byggeplads", url: "https://www.constructionnews.co.uk/tech/tilbury-douglas-deploys-humanoid-robot-on-live-construction-site-21-04-2026/" },
      { label: "Construction Enquirer — Humanoid robot i arbejde på Tilbury Douglas' byggeplads", url: "https://www.constructionenquirer.com/2026/04/21/humanoid-robot-goes-to-work-on-tilbury-douglas-site/" },
      { label: "Interesting Engineering — UK-entreprenør sætter humanoid robot til site-tilsyn", url: "https://interestingengineering.com/ai-robotics/humanoid-robot-administrative-job-uk-construction-site" },
      { label: "Unitree — G1-D end-to-end platform (hånd-moduler)", url: "https://www.unitree.com/mobile/G1-D/" }
    ]
  },
  {
    id: "brokk",
    name: "Brokk",
    manufacturer: "Brokk AB",
    country: "Sverige",
    formFactor: "Nedrivning",
    category: "jobsite",
    status: "I brug",
    tagline: "Fjernstyret nedrivning i rum, hvor en gravemaskine ikke kan være",
    image: "assets/robots/brokk.jpg",
    youtube: "izJ1G0JqZUo",
    specs: {
      type: "Fjernstyret bælterobot med treleddet arm og udskifteligt værktøj",
      height: "Fra ca. 88 cm (Brokk 70+) til over 2,5 m (de største modeller)",
      weight: "Fra 560 kg (Brokk 70+) til over 11 t (Brokk 800/900)",
      dof: "Treleddet arm; værktøjsskift (hammer, knuser, saks, grab, bor)",
      payload: "Værktøj typisk 105–1.200 kg afhængig af model",
      battery: "El (ABB-motor) eller diesel på udvalgte modeller",
      speed: "Ca. 2–3 km/t"
    },
    description:
      "Brokk har bygget fjernstyrede nedrivningsrobotter siden 1970'erne og er den mest " +
      "modne robotkategori på byggepladsen. Maskinerne er kompakte bælterobotter med en " +
      "treleddet arm, som en operatør styrer på afstand — op til ca. 300 m. De bruges, " +
      "når et rum er for trangt, et dæk for svagt, eller støv, varme og faldende beton " +
      "gør det uforsvarligt at sende folk ind med hammer.",
    constructionUse:
      "Entreprenører som AMG i USA har brugt Brokk 300 til top-ned-nedrivning inde i " +
      "etagebyggeri, hvor etagebelastningen forbød en almindelig gravemaskine, og Brokk 110 " +
      "til indvendig nedrivning, hvor selv en minilæsser var for tung. Frederico Demolition " +
      "i New York har kørt Brokk 800S som den største Brokk i Nordamerika. Typiske opgaver: " +
      "betonnedbrydning, åbninger i dæk, strip-out i hospitaler og indkøbscentre, og arbejde " +
      "i varme eller forurenede zoner. Operatøren står uden for farezonen.",
    verified: true,
    sources: [
      { label: "Brokk — sammenligning af modeller", url: "https://www.brokk.com/us/compare-models/" },
      { label: "Brokk 200 — produktspecifikationer", url: "https://www.brokk.com/us/product/brokk-200/" },
      { label: "ACP — AMG nedriver etagebyggeri med Brokk 300 og 110", url: "https://acppubs.com/BE/article/C1C7A7CE-demolition-doctors" },
      { label: "KHL — Frederico Demolition kører Brokk 800S", url: "https://www.demolitionandrecycling.media/news/us-demolition-contractor-operates-north-americas-largest-brokk/8013428.article" }
    ]
  },
  {
    id: "dusty-fieldprinter",
    name: "FieldPrinter",
    manufacturer: "Dusty Robotics",
    country: "USA",
    formFactor: "Layout",
    category: "jobsite",
    status: "I brug",
    tagline: "Printer BIM-layout direkte på betondækket — vægge, åbninger og MEP",
    image: "assets/robots/dusty-fieldprinter.jpg",
    youtube: "cT_hoqj8f40",
    specs: {
      type: "Autonom layout-robot til betondæk",
      height: "Lav, gulvkørende platform",
      weight: "Ikke offentliggjort",
      dof: "Ikke relevant — printer i ét plan",
      payload: "Printer væglinjer, åbninger, MEP-punkter, tekst og QR-koder",
      battery: "Ikke offentliggjort",
      speed: "Layout-tid typisk 50–75 % lavere end manuel udsætning (entreprenør-rapporter)"
    },
    description:
      "FieldPrinter tager et BIM- eller CAD-underlag og printer 1:1-layout direkte på " +
      "betondækket, så tømrere, VVS og el læser de samme streger i stedet for at tolke " +
      "mål på en tegning. Dusty leaser systemet brugsbaseret; entreprenøren kører det " +
      "selv. Det er den byggepladsrobot, der oftest nævnes som gået fra pilot til fast " +
      "værktøj på store erhvervsbyggerier i Nordamerika.",
    constructionUse:
      "Dusty oplyser over 300 millioner kvadratfod printet på mere end 1.000 bygninger. " +
      "Kunder tæller DPR, JE Dunn, Skanska, McCarthy, Mortenson, Swinerton og Barton Malow. " +
      "McCarthy har rapporteret ca. 3.000 sparet layout-timer på Kaiser Roseville Medical " +
      "Center. RG Construction brugte robotten på en hospitaludvidelse i Chicago til " +
      "framing, MEP og HVAC med anslået ca. 300.000 USD sparet. Typisk: hospitaler, " +
      "datacentre og komplekse erhvervsbyggerier, hvor koordinering mellem fagene er " +
      "den store tidsrisiko.",
    verified: true,
    sources: [
      { label: "Dusty Robotics — Construction Robot", url: "https://www.dustyrobotics.com/discover/construction-robot" },
      { label: "Robots in Construction — FieldPrinter 2", url: "https://www.robotsinconstruction.com/robots/dusty-fieldprinter/" },
      { label: "Offsite Builder — Automation on the Jobsite", url: "https://offsitebuilder.com/automation-on-the-jobsite/" },
      { label: "Projul — Construction Robotics and Automation", url: "https://projul.com/blog/construction-robotics-automation-guide/" }
    ]
  },
  {
    id: "hilti-jaibot",
    name: "Jaibot",
    manufacturer: "Hilti",
    country: "Liechtenstein",
    formFactor: "Boring",
    category: "jobsite",
    status: "I brug",
    tagline: "Semi-autonom loftboring til VVS, el og ventilation ud fra BIM",
    image: "assets/robots/hilti-jaibot.jpg",
    youtube: "WYf-o8c1ijc",
    specs: {
      type: "Semi-autonom mobil borerobot til loft og væg",
      height: "167 cm (chassis); borer i loft 2,65–5,0 m og væg 1,2–4,8 m",
      weight: "850 kg (1.150 kg med transportkasse)",
      dof: "Arm til loft/væg; positionering via totalstation (±5 mm)",
      payload: "Huldiameter 6–16 mm, dybde 0–100 mm",
      battery: "Op til 8 timer; fuld opladning ca. 6 timer, kan køre under ladning",
      speed: "Hilti oplyser ca. 500 lofthuller pr. dag; kunder har rapporteret over 1.000"
    },
    description:
      "Jaibot er Hiltis første byggepladsrobot: en batteridrevet, semi-autonom borerobot " +
      "der slår ankerhuller i betonloft og -væg ud fra et digitalt boreplan. En operatør " +
      "kører den på plads med fjernbetjening og Hilti PLT 300-totalstation; inden for " +
      "rækkevidde borer og mærker den selv. Støvsugning er indbygget. Den er bygget til " +
      "det mest skulderødelæggende arbejde på pladsen — at stå med hammerbor over hovedet.",
    constructionUse:
      "Skanska brugte Jaibot på et nyt hospitalsbyggeri i Malmö (2021) specifikt for at " +
      "skåne folk for overhead-arbejde. ALEC borede med Jaibot i et tårnprojekt i Dubai " +
      "(2020). Geiger i Tyskland rapporterede ca. 15.500 lofthuller på kontorbyggeriet " +
      "Welle 2 i Reutlingen og over 1.000 huller pr. dag. Hilti har omtalt brug på over " +
      "100 projekter. Opgaver: ankerhuller til VVS, el, ventilation og indvendig finish.",
    verified: true,
    sources: [
      { label: "Hilti USA — Jaibot Drilling Robot", url: "https://www.hilti.com/content/hilti/W1/US/en/business/business/trends/jaibot.html" },
      { label: "Hilti — Jaibot saves workers' shoulders (Skanska Malmö)", url: "https://reports.hilti.group/2021/our-strategy/direct-customer-relationship/jaibot-saves-workers-shoulders" },
      { label: "Motek — tekniske data for Jaibot", url: "https://www.motek.no/kunnskapssenter/produktnyheter/hilti-jaibot" },
      { label: "ResearchGate — Jaibot case, ALEC Dubai", url: "https://www.researchgate.net/publication/360584023_Implementation_of_a_Robotic_System_for_Overhead_Drilling_Operations_A_Case_Study_of_the_Jaibot_in_the_UAE" }
    ]
  },
  {
    id: "acr-tybot",
    name: "TyBOT",
    manufacturer: "Advanced Construction Robotics",
    country: "USA",
    formFactor: "Armering",
    category: "jobsite",
    status: "I brug",
    tagline: "Binder armeringsjern på brodæk — uden BIM og uden forprogrammering",
    image: "assets/robots/acr-tybot.jpg",
    youtube: "uS7WuM1c5iU",
    specs: {
      type: "Autonom armeringsbinder på skinne/gantry over brodæk",
      height: "Ikke offentliggjort som enkelt tal — kører på eksisterende kantforskalling",
      weight: "Ikke offentliggjort",
      dof: "Ikke relevant — scanner kryds og binder",
      payload: "Min. 900 bindinger/t, observeret 1.200+; trådrulle ca. 3.000 bindinger",
      battery: "Generator, op til ca. 10–12 timers kørsel",
      speed: "Arbejdsbredde typisk 10–117 ft (ca. 3–36 m)"
    },
    description:
      "TyBOT er en armeringsrobot fra Advanced Construction Robotics. Den kører på " +
      "brodækkets kantforskalling, finder jernkryds med kamera og binder dem selv — " +
      "sort jern, epoxy, galvaniseret, rustfrit eller glasfiber. Den kræver ikke BIM " +
      "eller forprogrammering. Søsterproduktet IronBOT løfter og lægger jernbundter " +
      "(op til ca. 2,3 t). Begge sælges som Robot-as-a-Service og efterhånden også " +
      "til køb.",
    constructionUse:
      "På I-30 Crossing i Little Rock, Arkansas, kørte D.T. Read tre TyBOT-enheder; " +
      "ACR oplyser 165.779 bindinger på de første to broenheder og kortere tidsplan. " +
      "På I-40 Gorge Bridge i North Carolina (Kiewit) lavede TyBOT 58.215 bindinger " +
      "på 25.154 sq ft. ACR har oplyst over 4,2 millioner bindinger på 60+ projekter " +
      "i 14 amerikanske delstater. Typisk opgave: horisontale brodæk og store plader, " +
      "hvor folk ellers kravler og binder i timevis.",
    verified: true,
    sources: [
      { label: "ACR — TyBOT produktside", url: "https://www.constructionrobots.com/tybot" },
      { label: "ACR — TyBOT på I-30 Crossing, Arkansas", url: "https://constructionrobots.com/news/tybot-r-helps-d-t-read-accelerate-progress-on-arkansas-i-30-crossing-project" },
      { label: "ACR — TyBOT på I-40 Gorge Bridge, North Carolina", url: "https://www.constructionrobots.com/news/advanced-construction-robotics-delivers-dt-read-steel-co-incs-tybot-units-to-support-their-southeast-infrastructure-work" },
      { label: "IRONPROS — TyBOT specs og brug", url: "https://www.ironpros.com/product-categories/technology-and-software/equipment-automation/construction-robotics/product/22906485/advanced-construction-robotics-tybot" }
    ]
  },
  {
    id: "sam100",
    name: "SAM100",
    manufacturer: "Construction Robotics",
    country: "USA",
    formFactor: "Murværk",
    category: "jobsite",
    status: "I brug",
    tagline: "Semi-automatisk murer: lægger sten, mureren færdiggør fuger og hjørner",
    image: "assets/robots/sam100.jpg",
    youtube: "G_Pj2GI6-xc",
    specs: {
      type: "Semi-autonom mure-robot (transportbånd, mørtelpumpe, robotarm)",
      height: "Står på stillads / langs væggen",
      weight: "Ca. 1.360 kg (sekundær kilde)",
      dof: "Robotarm til at smøre mørtel og sætte sten",
      payload: "Producenten oplyser 2.000–3.000 sten/dag på lange, rette vægge",
      battery: "Propangenerator (sekundær kilde)",
      speed: "300–400 sten/t ifølge ældre producenttalsæt; en murer lægger typisk 300–600/dag"
    },
    description:
      "SAM (Semi-Automated Mason) er en af de første kommercielle mure-robotter til " +
      "brug ude på pladsen. Den måler sten med laser, smører mørtel og sætter dem i " +
      "væggen. En murer går ved siden af, fuger og tager hjørner, døre og vinduer. " +
      "Construction Robotics beskriver den som et værktøj til mureren, ikke en " +
      "erstatning. Produktivitetstallene er primært producentens egne.",
    constructionUse:
      "SAM har været i kommerciel brug i USA i omtrent et årti. Dokumenterede " +
      "byggerier tæller blandt andet Purdue Flex Lab, University of Nevada (over " +
      "60.000 sten på et 35,5 mio. USD-byggeri), Auburn Universitys Gogue Performing " +
      "Arts Center (BL Harbert, første SAM i Alabama) og en rekord på 3.270 sten på " +
      "otte timer ved Shenandoah University. Bedst på lange, rette facader; svagere " +
      "på krumme og detaljerede partier.",
    verified: false,
    sources: [
      { label: "Construction Robotics (firmaets site)", url: "https://www.construction-robotics.com/" },
      { label: "RobotToday — SAM100, murværk og feltbrug", url: "https://robottoday.com/article/construction-robotics-masonry-and-bricklaying-robots-the-poster-child-that-still-has-walls-to-climb" },
      { label: "DataDrivenAEC — SAM og MULE", url: "https://datadrivenaec.com/tools/construction-robotics" },
      { label: "Brick Architecture — SAM100 på Purdue Flex Lab", url: "https://brickarchitecture.com/about-brick/technology/your-next-home-could-be-built-by-robots" }
    ]
  },
  {
    id: "boston-dynamics-spot",
    name: "Spot",
    manufacturer: "Boston Dynamics",
    country: "USA / Sydkorea (ejet af Hyundai Motor Group)",
    formFactor: "Inspektion",
    category: "jobsite",
    status: "I brug",
    tagline: "Firbenet inspektionsrobot — den mest udbredte robot på byggepladser i 2026",
    image: "assets/robots/boston-dynamics-spot.jpg",
    youtube: "0NYJ_9FIHZA",
    specs: {
      type: "Firbenet inspektions- og dokumentationsrobot",
      height: "Ca. 84 cm (stående)",
      weight: "Ca. 32,5 kg (base, uden payload)",
      dof: "12 (tre led pr. ben)",
      payload: "Ca. 14 kg",
      battery: "Ca. 90 minutter pr. batteri, hot-swap",
      speed: "Op til 1,6 m/s"
    },
    description:
      "Spot er Boston Dynamics' firbenede robot — ikke humanoid, men den robot der " +
      "ifølge BuiltWorlds' 2026-benchmark er den mest adopterede på byggepladser. Den " +
      "bærer kamera, LiDAR og 360°-rig og går trapper, grus og ufærdige dæk, som et " +
      "hjulkøretøj ikke kan. Opgaver er dokumentation og tilsyn, ikke at mure eller bore.",
    constructionUse:
      "Entreprenører bruger Spot til daglig fremdriftsdokumentation, sikkerhedsrundering " +
      "og sammenligning med BIM — så projektledelsen ser, hvad der reelt er bygget, uden " +
      "at sende folk ind i uafsluttede zoner. BuiltWorlds' 2026 Equipment & Robotics " +
      "Benchmarking Report peger på Boston Dynamics som den mest adopterede robotleverandør " +
      "blandt de adspurgte entreprenører (79 % brugte i et eller andet omfang jobsite-robotik). " +
      "Det er den praktiske pendant til Unitree G1 hos Tilbury Douglas: samme type opgave, " +
      "anden kropsform.",
    verified: false,
    sources: [
      { label: "Boston Dynamics — Spot", url: "https://bostondynamics.com/products/spot/" },
      { label: "BuiltWorlds / BD+C — jobsite robotics 2026 (Spot mest adopteret)", url: "https://www.bdcnetwork.com/aec-tech/article/55395870/adoption-of-jobsite-robotics-doubles-in-2026-builtworlds-report" },
      { label: "Dusty Robotics — oversigt over robottyper på pladsen, inkl. Spot", url: "https://www.dustyrobotics.com/discover/construction-robot" }
    ]
  }
];

/*
 * GENERAL_ANATOMY — den generelle, robot-uafhængige anatomi-gennemgang.
 * ÉN fælles forklaring af, hvordan en humanoid typisk er bygget op.
 *
 * Dybden i led, aktuatorer, proprioception og sim-to-real kommer fra
 * Liao et al., Berkeley Humanoid (arXiv:2407.21781) — et mid-scale
 * forskningsdesign, hvor aktuatoren ER leddet. 3D-modellen på siden er
 * Unitree G1 visual meshes, ikke Berkeley-robotten. Tal i specs[] er
 * mærket som forskningsplatform-eksempel, aldrig som G1-specifikation.
 *
 * Øvrigt grundlag: humanoid.guide, Persona AI industrial design, kataloget.
 * Se GENERAL_ANATOMY_SOURCES.
 *
 * Felter: id, label, category, description (afsnit), specs (korte punkter).
 * x/y beholdes for kompatibilitet med ældre SVG-illustration.
 */
var GENERAL_ANATOMY_INTRO = {
  id: "overview",
  label: "Humanoid anatomi",
  category: "Oversigt",
  description:
    "En humanoid er et skelet af led, og i et moderne elektrisk design er hvert led " +
    "i praksis en aktuator. Berkeley Humanoid (Liao et al., 2024) er det tætteste " +
    "offentlige kig på, hvordan man bygger det til læringsbaseret styring: 12 QDD-" +
    "aktuatorer som to 6-DoF-ben, aktuator = led, EtherCAT i kilohertz, IMU og " +
    "proprioception i stedet for dyre kraftsensorer, og en ramme der overlever fald. " +
    "3D-modellen her er Unitree G1-visuals — ikke Berkeley-robotten. Tallene i " +
    "panelet er mærket som forskningsplatform-eksempel.",
  specs: [
    "6 DoF pr. ben: hofterotation, abduktion/adduktion, hoftefleksion, knæ, ankel-pitch, ankel-roll — samme akser som et menneskeben",
    "QDD-planetgear 9:1, hulaksel og crossed-roller bearing, så aktuatoren kan monteres direkte som led",
    "EtherCAT 1–4 kHz; RL-policy 50 Hz; state estimator 1 kHz; PD på motordriveren 25 kHz",
    "Ingen fjedre eller dæmpere; ankel-pitch (FFE) er den eneste ledstang",
    "3D-mesh: Unitree G1. Tekniske tal: Berkeley Humanoid, medmindre andet er nævnt"
  ]
};

var GENERAL_ANATOMY = [
  {
    id: "head",
    label: "Hoved",
    category: "Sansning",
    x: 50.0,
    y: 17.2,
    description:
      "Hovedet er den eksteroceptive sensorpakke — det der ser og hører omverdenen, " +
      "i modsætning til proprioceptionen i led og IMU, som kun mærker robottens egen " +
      "krop. Typisk sidder stereo- eller dybdekameraer her, nogle gange LiDAR og " +
      "mikrofoner. På forskningsplatforme som Berkeley Humanoid er perception et " +
      "valgfrit modul: gang-policyen i papiret kører uden kamera, kun på IMU, " +
      "ledpositioner og -hastigheder. USB og Ethernet i torsoen gør det muligt at " +
      "hænge dybdekamera eller LiDAR på senere, uden at ændre kinematikken.",
    specs: [
      "Eksteroception: kamera, dybde, evt. LiDAR og mikrofon — adskilt fra ledencodere og IMU",
      "Berkeley Humanoid: perception-mount reserveret, men ikke brugt i locomotionspapiret",
      "USB/Ethernet i torsoen til eksterne sensorer; læring tillader billigere, støjende sensorer",
      "Katalog-eksempel: Unitree G1 hos Tilbury Douglas bruger 360°-kamera + LiDAR + dybde til pladskortlægning"
    ]
  },
  {
    id: "torso",
    label: "Torso",
    category: "Styring",
    x: 50.0,
    y: 28.0,
    description:
      "Torsoen er skelet, computer og strømforsyning i ét. I et mid-scale design som " +
      "Berkeley Humanoid sidder onboard-PC, power-management, IMU og to udskiftelige " +
      "batterier i et beskyttet rum — så tyngdepunktet ligger tæt på hoften, og et fald " +
      "ikke smadrer elektronikken. PC'en er EtherCAT-master og taler med " +
      "motorcontrollere og IMU ved 1–4 kHz, så forsinkelsen er 0,5–2 ms. Materialerne " +
      "er 7075- og 6061-aluminium i rammen og SKD11-stål i gear og ledstænger: let nok " +
      "til at én person kan løfte robotten, stiv nok til gentagne fald.",
    specs: [
      "Berkeley Humanoid (eksempel): 16 kg, 0,85 m — mid-scale, ca. et 5-årigt barns proportioner",
      "Onboard-PC (Intel i7-1255U) som EtherCAT-master, 1–4 kHz; router i torsoen til debug",
      "To udskiftelige batterier (DJI TB50) i beskyttet rum; separat power-management-board",
      "IMU i torsoen (ICM-42688, mobiltelefon-klasse) — læring erstatter dyre inertial-pakker",
      "7075/6061 aluminium + SKD11-stål; hulaksel i leddene, så kabler ikke slides ved rotation"
    ]
  },
  {
    id: "shoulder",
    label: "Skulder",
    category: "Aktuering",
    x: 47.0,
    y: 30.4,
    description:
      "Skulderen er armens første led og typisk tre akser: pitch, roll og yaw. Samme " +
      "designfilosofi som benene i Berkeley-papiret: aktuatoren er leddet. Et QDD-" +
      "planetgear med 9:1 og et crossed-roller bearing lader motoren sidde direkte i " +
      "leddet, så man undgår fjedre, sener og lukkede kinematik-kæder, som er svære at " +
      "simulere ærligt. Hulakslen fører strøm- og datakabler gennem leddet, så de ikke " +
      "slides ved rotation. Berkeley Humanoid designede 4-DoF-arme, men lod dem ude af " +
      "den første generation for at isolere gang.",
    specs: [
      "Typisk 3 frihedsgrader i skulderen (pitch, roll, yaw)",
      "Aktuator = led: QDD 9:1, crossed-roller bearing, hulaksel til kabler",
      "Berkeley Humanoid: 4-DoF-arme var tegnet, men udeladt for at fokusere på locomotion",
      "Papiret peger fremad på 4 eller 6 DoF pr. arm, når overkroppen kommer på"
    ]
  },
  {
    id: "arm",
    label: "Arm",
    category: "Aktuering",
    x: 53.9,
    y: 37.8,
    description:
      "Armen er en kæde af elektriske aktuatorer med gearreduktion. To skoler: høj-ratio " +
      "harmoniske drev (kraft og stivhed, men mere friktion og backlash) versus quasi-" +
      "direct drive med lavt gearforhold, som Berkeley Humanoid bruger. QDD giver " +
      "gennemsigtig momentkontrol — det moment, driveren befaler, er tæt på det leddet " +
      "faktisk leverer — og det er præcis det, der gør sim-to-real-gabet småt. Fire " +
      "motorstørrelser dækker leddene, fra 9,7 Nm spids i den mindste til 81,1 Nm i den " +
      "største. Motordriveren sidder i aktuatoren; PD-loopet kører ved 25 kHz, torque-" +
      "loopet ved 1 kHz.",
    specs: [
      "QDD-planetgear 9:1 — lav gearing, lille friktion, aktuator-dynamik der kan modelleres som selve leddet",
      "Berkeley-aktuatorer: 5013 / 8513 / 8518 / 10413 (251–1011 g, spidstmoment 9,7–81,1 Nm)",
      "Hulaksel: strøm og EtherCAT gennem leddets akse, så kabler ikke slides",
      "Torque-kontrol 1 kHz, PD på driveren 25 kHz — aktuatoren simuleres som en forsinkelsesfri momentkilde"
    ]
  },
  {
    id: "hand",
    label: "Hånd",
    category: "Greb",
    x: 45.7,
    y: 53.8,
    description:
      "Hånden er end-effectoren og ofte en selvstændig anatomisk kategori, adskilt fra " +
      "armen. Industrielle humanoider spænder fra en 2-finger-grib til en 12–20 DoF " +
      "dexterøs hånd med taktil sensorik i fingerspidserne. Berkeley-platformen har " +
      "ingen hænder i den publicerede generation — begrænsningen er bevidst: mid-scale-" +
      "forskning har indtil videre handlet om gang. Når armene kommer på, er det samme " +
      "trick som i benene, der tæller: QDD-momentet kan estimere kontaktkraft uden " +
      "strain gauges. I kataloget er Unitree-hånden et udskifteligt modul, mens Persona " +
      "bygger en senedrevet 12-DoF-hånd til svejsning.",
    specs: [
      "End-effector: fra 2-finger-grib til dexterøs 5-finger-hånd med egne 12–20 DoF",
      "Taktil eksteroception i fingerspidser — mærker greb og begyndende glidning",
      "Berkeley Humanoid: arme og hænder bevidst udeladt i denne generation",
      "Katalog: Unitree G1-D har udskiftelige håndmoduler; Persona har 12-DoF senedrevet svejsehånd"
    ]
  },
  {
    id: "hip",
    label: "Hofte",
    category: "Aktuering",
    x: 50.0,
    y: 47.4,
    description:
      "Hoften er gangens første led og typisk tre frihedsgrader: rotation (HR), " +
      "abduktion/adduktion (HAA) og fleksion/ekstension (HFE). Berkeley Humanoid lægger " +
      "aktuatorerne direkte ind som de tre led, med menneskelignende anslag — HFE dækker " +
      "ca. 93 % af et menneskes bevægelsesområde. HFE er et af de hårdeste led " +
      "(spidstmoment 62,6 Nm på deres 8518-aktuator). Uden hofte-roll og ankel-roll " +
      "bliver en humanoid hurtigt en 2D-gænger; papiret fremhæver netop roll-akserne " +
      "som det, der giver statisk balance og chance for at stå på ét ben.",
    specs: [
      "3 DoF: HR, HAA, HFE — aktuatorerne sidder som selve leddene",
      "Berkeley-område (højre ben): HR ±35°, HAA ±35°, HFE −100° til +30°",
      "Dækning vs. menneske: HR 78 %, HAA 92 %, HFE 93 %",
      "HFE-aktuator 8518: 62,6 Nm spids / 26,1 Nm kontinuerligt ved 48 V"
    ]
  },
  {
    id: "thigh",
    label: "Lår",
    category: "Aktuering",
    x: 52.7,
    y: 63.2,
    description:
      "Låret er det stive led mellem hofte og knæ. På Berkeley Humanoid er låret 220 mm " +
      "og læggen 180 mm — kort skridtlængde, derfor kræves hurtigere fodplacering og høj " +
      "båndbredde i aktuatorerne. Fordi aktuatorerne sidder som led, er låret primært " +
      "struktur plus kabelføring gennem hulaksler. CAD-massen og rotorinerti er kendt " +
      "led for led, så domain randomization i simulationen kan holdes snæver (link-masse " +
      "×0,9–1,1) i stedet for at gætte på en løs 'motorstyrke'-faktor. Det er en af " +
      "grundene til, at en minimal PPO-policy kan overføres zero-shot.",
    specs: [
      "Berkeley Humanoid: lår 220 mm, læg 180 mm, samlet højde 0,85 m",
      "Kort skridt → højere skridtfrekvens og strammere krav til aktuator-båndbredde",
      "Rotorinerti lægges på diagonalen af leddets massematrix — aktuatoren modelleres som leddet",
      "Domain randomization på link-masse kun ×0,9–1,1, fordi CAD-parametrene er kendte"
    ]
  },
  {
    id: "knee",
    label: "Knæ",
    category: "Aktuering",
    x: 47.3,
    y: 71.6,
    description:
      "Knæet er ét led: fleksion/ekstension (KFE). Det er det stærkeste led på Berkeley-" +
      "platformen — 10413-aktuatoren, 81,1 Nm spids, 34,2 Nm kontinuerligt — fordi knæet " +
      "bærer både kropsvægt og den impuls, der skal til hopping. Bevægelsesområdet er " +
      "0–120° (ca. 80 % af et menneskeknæ). Ingen fjedre, ingen parallelle stænger: " +
      "aktuatoren er leddet. Det gør knæet trivielt at simulere som en momentkilde, og " +
      "det er derfor en simpel PPO-policy kan hoppe på ét ben efter træning i Isaac Lab. " +
      "Proprioceptionen er encoder + IMU, ikke en separat knæ-kraftsensor.",
    specs: [
      "1 DoF: KFE. Berkeley-område 0–120° (menneske typisk 0–150°, dækning 80 %)",
      "10413-aktuator: 81,1 Nm spids / 34,2 Nm kontinuerligt — højeste moment på platformen",
      "Aktuator = led: ingen fjeder, ingen closed-chain. Simuleres som torque-source",
      "Policy 50 Hz → ønsket ledvinkel; PD på driveren omsætter til moment ved 25 kHz"
    ]
  },
  {
    id: "foot",
    label: "Fod",
    category: "Aktuering",
    x: 52.5,
    y: 86.8,
    description:
      "Foden er to led: fleksion/ekstension (FFE) og abduktion/adduktion (FAA). FAA — " +
      "ankel-roll — er det, papiret fremhæver som forskellen på en statisk stabil " +
      "humanoid og en, der vælter på skråt underlag. FFE er den eneste undtagelse fra " +
      "aktuator-som-led: en ledstang giver lineær mapping og højere moment, koblet til " +
      "knæet. Fødderne er små og flade. Der sidder ikke kraftsensorer i sålen; " +
      "kontaktvridningen estimeres fra ledmoment via en momentum-observer. Det er " +
      "derfor robotten kan gå 20° grusstier og 4 cm klippestenstrapper uden at være " +
      "'følsom' i fodsålen.",
    specs: [
      "2 DoF: FFE (ankel-pitch) og FAA (ankel-roll). FAA giver étbens-balance og skråt underlag",
      "Berkeley-område: FFE −30° til +70°, FAA ±30° — 100 % dækning vs. et menneskes ankel",
      "FFE er den eneste ledstang (lineær aktuator-led-mapping, koblet til KFE); FAA er direkte",
      "Ingen sålesensorer: kontaktwrench estimeres fra QDD-ledmoment (momentum-observer)",
      "Felt: 20° grussti (stejlere end ankel-pitch), 4 cm trin ≈ 10 % af benlængden"
    ]
  }
];

var GENERAL_ANATOMY_SOURCES = [
  { label: "Liao et al. — Berkeley Humanoid: A Research Platform for Learning-based Control (arXiv:2407.21781)", url: "https://arxiv.org/abs/2407.21781" },
  { label: "3D-mesh: Unitree G1 visual meshes (BSD-3-Clause), via MuJoCo Menagerie", url: "https://github.com/google-deepmind/mujoco_menagerie/tree/main/unitree_g1" },
  { label: "Humanoid.guide — What Is a Humanoid (generel anatomi-taksonomi)", url: "https://humanoid.guide/what-is-a-humanoid/" },
  { label: "Persona AI — Industrial Design for Heavy-Industry Humanoids", url: "https://persona.ai/industrial-design-for-heavy-industry-humanoids/" },
  { label: "Boston Dynamics — An Electric New Era for Atlas", url: "https://bostondynamics.com/blog/electric-new-era-for-atlas/" },
  { label: "Figure AI — Introducing Figure 03", url: "https://www.figure.ai/news/introducing-figure-03" },
  { label: "Unitree — G1-D end-to-end platform (hånd-moduler)", url: "https://www.unitree.com/mobile/G1-D/" },
  { label: "Tilbury Douglas — første entreprenør med humanoid robot på byggeplads", url: "https://www.tilburydouglas.co.uk/tilbury-douglas-becomes-first-contractor-to-launch-a-humanoid-robot-on-construction-site/" }
];

/*
 * SPOT_ANATOMY — firbenet anatomi-gennemgang, samme mønster som GENERAL_ANATOMY.
 * 3D-modellen er Boston Dynamics Spot visual meshes via MuJoCo Menagerie
 * (BSD-3-Clause, afledt af den offentlige URDF). Den er IKKE et officielt
 * Boston Dynamics-produktbillede. Tal i specs[] er fra Spot SDK / support-
 * artikler og mærkes som sådan. Katalogets G1-mesh og Berkeley-tal hører
 * ikke til her.
 */
var SPOT_ANATOMY_INTRO = {
  id: "overview",
  label: "Spot anatomi",
  category: "Oversigt",
  description:
    "Spot er en firbenet robot med 12 frihedsgrader: tre led pr. ben, ingen ryg, " +
    "ingen nakke. Kroppen er en aflang kasse med computere, batteri og fem stereo-" +
    "kamerapar. Hvert ben er en kæde — hofte (HX + HY) og knæ (KN) — der ender i " +
    "en rund gummifod. Boston Dynamics' egen anatomi beskriver det som kugleled i " +
    "hoften, hængsel i knæet og en gummipude under foden. 3D-modellen her er Spot-" +
    "visuals fra MuJoCo Menagerie, stående i home-positur. Tallene i panelet er " +
    "offentlige Spot-specifikationer, ikke gæt fra mesh'et.",
  specs: [
    "12 DoF, 3 pr. ben: HX (abduktion/adduktion), HY (fleksion/ekstension), KN (knæ)",
    "Fem stereo-kamerapar, 360° horisontalt synsfelt, dybde typisk 2–4 m",
    "Krop ca. 1100 × 500 mm; ståhøjde 520–700 mm (default gang 610 mm); siddende 191 mm",
    "Masse 32,5–33,8 kg med batteri; nyttelast op til 14 kg på to payload-porte",
    "3D-mesh: Spot visuals (BSD-3-Clause). Tekniske tal: Boston Dynamics Spot SDK og support"
  ]
};

var SPOT_ANATOMY = [
  {
    id: "head",
    label: "Sensorhus",
    category: "Sansning",
    description:
      "Spot har ikke et leddelt hoved. Sansningen sidder i selve kroppen: fem par " +
      "projekterede stereo-kameraer — forreste venstre, forreste højre, venstre side, " +
      "højre side og bag — der tilsammen giver 360° horisontalt syn. Hvert par leverer " +
      "sort-hvidt billede og dybde; nyere hardware kan også have farve-fiskeøje og IR. " +
      "Dybdekameraernes rækkevidde er ca. 2 m i support-specifikationen og op til 4 m i " +
      "produktoversigten; der er huller nær hofterne, hvor felterne ikke overlapper. " +
      "Det er den eksteroception, robotten bruger til forhindringer, trapper og " +
      "fiducials — adskilt fra ledencodere og IMU, som kun mærker kroppen selv. På " +
      "byggepladsen er det derfor Spot kan gå ufærdige dæk uden en fører bag joysticket: " +
      "den ser kanten, inden foden træder ud.",
    specs: [
      "5 stereo-par (FL, FR, L, R, rear) — 360° optisk FOV, ca. 90° dybde i hver retning",
      "Projekteret stereo; dybde ca. 2 m (support) / op til 4 m (produktside)",
      "Hullerne ved hofterne er bevidste: benene fylder synsfeltet i yderstillinger",
      "Bruges til obstacle avoidance, trappekant, fiducials og 360°-dokumentation med payload-kamera"
    ]
  },
  {
    id: "torso",
    label: "Krop",
    category: "Styring",
    description:
      "Kroppen er et aflangt chassis: computere, batteri, radio og to payload-porte i " +
      "én kasse. Længde 1100 mm, bredde 500 mm. Ståhøjden er variabel — 520 mm lavt, " +
      "610 mm som default gang, 700 mm maksimalt — så tyngdepunktet kan sænkes i blæst " +
      "eller hæves over rod på dækket. Siddende er kroppen og alle fire fødder i jorden, " +
      "191 mm. Massen med batteri er 32,5 kg i den ældre Gamma-spec og 33,8 kg i den " +
      "gældende produktspec. Batteriet er et udskifteligt Li-ion-pack (564 Wh i den " +
      "nuværende tabel, 605 Wh i ældre SDK-tekst), 5,2 kg, hot-swap, typisk 90 minutter " +
      "kørsel og 180 minutter standby. To DB25-payload-porte spejler hinanden og leverer " +
      "uReguleret 35–58,8 V, 150 W pr. port, gigabit Ethernet og PPS. Uden hætte eller " +
      "payload på begge porte kører robotten ikke. På pladsen er det her LiDAR, Spot CAM+ " +
      "og BIM-rigge boltes fast — og det er derfor Spot dokumenterer fremdrift i stedet " +
      "for at slæbe mursten.",
    specs: [
      "1100 × 500 mm; ganghøjde 520–700 mm (default 610); siddende 191 mm",
      "32,5 kg (SDK Gamma) / 33,8 kg (gældende produktspec med batteri)",
      "Batteri 564 Wh, 5,2 kg, 58,8 V max, ca. 90 min drift / 180 min standby, hot-swap",
      "2 payload-porte, DB25, 150 W og 1000Base-T pr. port; T-slot M5; max 14 kg samlet last",
      "IP54, −20 til 45/55 °C; Wi-Fi 2,4/5 GHz; E-stop på bagkanten af visse modeller"
    ]
  },
  {
    id: "hip",
    label: "Hofte",
    category: "Aktuering",
    description:
      "Hoften er benets første led og har to aktuatorer: HX og HY. HX er rotation om " +
      "robotens længdeakse — intern/ekstern abduktion, ±45° fra lodret — så benet kan " +
      "skræve og samle. HY er fleksion/ekstension, ±91° med 50° bias fra lodret, det " +
      "led der svinger lårbenet frem og tilbage. Gearforholdet på begge er 51:1, max " +
      "motormoment 0,88 Nm før gearing. SDK'en navngiver leddene pr. ben: fl.hx, fl.hy, " +
      "fr.hx og så videre (FL = front left, HR = hind right). Uden HX bliver Spot en " +
      "2D-gænger; det er HX der lader den skræve på skråt underlag, vende i trange " +
      "gange og holde kroppen i vater, mens fødderne finder køb. På et ufærdigt dæk " +
      "er det hoften, ikke hjul, der afgør om den kan trine ned 300 mm og op igen.",
    specs: [
      "2 DoF pr. hofte: HX ±45° (abduktion), HY ±91° med 50° bias (fleksion/ekstension)",
      "Gear 51:1, max motormoment 0,88 Nm (HX og HY) — offentlig transmissionstabel i Spot SDK",
      "Lednavne: fl.hx / fl.hy, fr.*, hl.*, hr.* — 8 hofteaktuatorer i alt",
      "HX er roll-aksen der giver skræv og skråt underlag; HY er skridtets svingled"
    ]
  },
  {
    id: "thigh",
    label: "Lår",
    category: "Aktuering",
    description:
      "Låret er det stive led mellem hofte og knæ — øvre ben, HY-output. I mesh'et er " +
      "det to skaller pr. ben: den gule wrap og den sorte struktur, men kinematisk er " +
      "det ét stift led. Knæaktuatoren sidder her som et kuglespindel- og trykstangstræk " +
      "ned i underbenet: transmissionen er ikke konstant, så knæets max-moment er " +
      "størst midt i bevægelsen og svagest fuldt bøjet eller strakt. Det er derfor " +
      "Spot ikke modelleres som et almindeligt QDD-led i knæet — SDK'en giver " +
      "Tr(q_kn) = qd_motor / qd_kn som konfigurationsafhængig udveksling. Låret skal " +
      "være stift, fordi fire ben deler 32+ kg plus op til 14 kg payload, og fordi " +
      "knæene i trapper og self-right kan stige op over kroppens topplan. Payloads " +
      "må derfor ikke fylde zonen lige over hofterne.",
    specs: [
      "Øvre ben: stift led fra HY til KN; to visuelle skaller, én kinematisk krop",
      "Knætransmission: kuglespindel + trykstang, variabel udveksling, max motor 1,50 Nm",
      "Knæet er stærkest midt i ROM og svagest i yderstillinger — ikke et konstant gear",
      "Knæene kan stige over kroppens top ved trapper, sit-to-stand og self-right"
    ]
  },
  {
    id: "foot",
    label: "Underben og fod",
    category: "Aktuering",
    description:
      "Underbenet er KN-leddets output: et hængsel, 14–160° fra strakt, der ender i " +
      "en rund fod med gummipude. Foden er ikke et ekstra led — der er ingen ankel. " +
      "Kontakten med underlaget er en kugleformet pude (i modellen en sfære Ø 72 mm), " +
      "så Spot kan rulle over grus, armeringsjern og trappetrin i stedet for at " +
      "plante en flad sål. Max trinhøjde er 300 mm, max hældning ±30°, og trapper " +
      "der følger amerikansk bygningskode (ca. 7 in stigning / 10–11 in trin). Uden " +
      "ankel-roll kompenserer HX i hoften for skråt underlag, og uden sålesensorer " +
      "estimeres kontakten fra ledmoment og stereo-dybde. På byggepladsen er det " +
      "derfor en firbenet kan gå armering og trapper, som et hjulkøretøj ikke kan — " +
      "og derfor BuiltWorlds 2026 peger på Spot som den mest adopterede jobsite-robot.",
    specs: [
      "1 DoF: KN 14–160° fra strakt. Ingen ankel — foden er en gummipude, ikke et led",
      "Gummifod, afrundet; i MJCF en sfære radius 36 mm under underbenet",
      "Terræn: ±30° hældning, 300 mm trin, trapper efter US building code, IP54",
      "Max 1,6 m/s (5,8 km/h nominelt); kontakt via ledmoment + stereo, ikke sålesensor"
    ]
  }
];

var SPOT_ANATOMY_SOURCES = [
  { label: "Boston Dynamics — Spot Anatomy", url: "https://support.bostondynamics.com/s/article/Spot-Anatomy-49915" },
  { label: "Boston Dynamics — Spot Specifications", url: "https://support.bostondynamics.com/s/article/Spot-Specifications-49916" },
  { label: "Spot SDK — About Spot (kameraer, HX/HY/KN, mål)", url: "https://dev.bostondynamics.com/docs/concepts/about_spot.html" },
  { label: "Spot SDK — Joint transmission (gear, knæ-spindel)", url: "https://dev.bostondynamics.com/docs/concepts/joint_control/supplemental_data.html" },
  { label: "Spot SDK — Payload ports og elektrisk interface", url: "https://dev.bostondynamics.com/docs/payload/robot_electrical_interface.html" },
  { label: "Boston Dynamics — Spot produktside", url: "https://bostondynamics.com/products/spot/" },
  { label: "3D-mesh: Boston Dynamics Spot visuals (BSD-3-Clause) via MuJoCo Menagerie", url: "https://github.com/google-deepmind/mujoco_menagerie/tree/main/boston_dynamics_spot" }
];

/*
 * BROKK_ANATOMY — treleddet nedrivningsrobot.
 * 3D er en skematisk rekonstruktion ud fra Brokks egne produktmål og
 * offentlige fotos (ikke officiel CAD). Tal er Brokk 200-klassen som
 * mid-size eksempel, med mindre/større modeller nævnt hvor det betyder
 * noget. Værktøjet i mesh'et er en hydraulisk hammer.
 */
var BROKK_ANATOMY_INTRO = {
  id: "overview",
  label: "Brokk anatomi",
  category: "Oversigt",
  description:
    "En Brokk er en fjernstyret bæltemaskine med treleddet arm og udskifteligt " +
    "værktøj — ikke en humanoid og ikke autonom. Operatøren står udenfor med " +
    "SmartRemote, op til ca. 300 m radio eller med kabel. Kroppen rummer ABB-elmotor, " +
    "hydraulikpumpe og køling; bæltet bærer maskinen ind gennem døre og elevatorer; " +
    "armen er tre stive led med fire cylindre, så hammeren kan slå op i et loft, " +
    "ind i en væg og ned i et dæk. 3D-modellen er en skematisk Brokk 200-klasse " +
    "(ca. 2,1 t, 27,5 kW) i arbejdende positur. Familien går fra Brokk 70+ på 560 kg " +
    "til Brokk 800/900 over 11 t — samme anatomi, anden skala.",
  specs: [
    "Treleddet arm + slewing: typisk 245° på de mindste, 360° på Brokk 200 og op",
    "Brokk 200-eksempel: 2100 kg, 780 mm min. bredde, 1351 mm min. højde, 5,45 m lodret rækkevidde",
    "SmartPower™ el: 9,8 kW (70) til 27,5 kW (200) og 37 kW (300); ABB-motor, 16–63 A",
    "Værktøjsskift: hammer, knuser, saks, grab, bor, tromle, planer — her vist med BHB-hammer",
    "3D: skematisk rekonstruktion. Tal: Brokk produktspec, ikke fra mesh'et"
  ]
};

var BROKK_ANATOMY = [
  {
    id: "tracks",
    label: "Bælter",
    category: "Kørsel",
    description:
      "Undervognen er to gummibælter — stål som option til varme og skarpt affald. " +
      "De bærer hele maskinen, typisk 2,1 km/t på Brokk 200 og op til ca. 2,7 km/t på " +
      "de små, med 30° stigning. Bredden er det, der afgør om robotten kommer ind: " +
      "780 mm på Brokk 200, 597 mm på Brokk 70, så den kan gennem en dør og op i en " +
      "almindelig elevator. Gummibælter skåner færdige dæk; stålbælter og stålsko " +
      "bruges når underlaget er rødglødende. Der er ingen førerplads — bæltet er " +
      "bare det, der flytter hammeren hen til væggen, mens operatøren står udenfor.",
    specs: [
      "Gummibælter standard; stål og stålsko som option til varme/skarpt underlag",
      "Transport 2,1 km/t (Brokk 200) / 2,7 km/t (Brokk 70); max stigning 30°",
      "Min. bredde 597 mm (70) – 780 mm (110/200) – 1200 mm (300)",
      "Brokk 70 vejer 560 kg og kan i person-elevator; Brokk 200 vejer 2100 kg"
    ]
  },
  {
    id: "body",
    label: "Chassis",
    category: "Styring",
    description:
      "Chassiset er støbt, ikke et rørstel: Brokk fremhæver casted chassis parts og " +
      "daglig service med hætterne på. Indeni sidder ABB-elmotoren, den lastfølsomme " +
      "hydraulikpumpe, oliebeholderen og kølingen. Brokk 200 har 27,5 kW SmartPower™, " +
      "85 l olie, 18 MPa systemtryk og 23 MPa boost til værktøjet, 85–102 l/min. " +
      "Slewing-ringen under armen drejer overkroppen — 10 s/360° på 200, 6,5 s/245° " +
      "på 70. Modvægten bagtil balancerer hammeren; en ekstra counterweight på " +
      "stabilisatorer er option til de tungeste værktøjer. Strømmen kommer i kabel " +
      "fra 16 A (70) til 63 A (200). Fjernstyring er Brokk SmartRemote, digital radio " +
      "eller kabel, rækkevidde op til 300 m. Chassiset er det, der gør Brokk til en " +
      "robot i rum, hvor en gravemaskine enten ikke kan være eller ville bryde dækket.",
    specs: [
      "ABB-elmotor + SmartPower™; Brokk 200: 27,5 kW, 63 A, softstart",
      "Hydraulik 85 l, lastfølsom pumpe, 18 MPa / 23 MPa til værktøj, 85 l/min (50 Hz)",
      "Slewing 10 s/360° (200) eller 6,5 s/245° (70); støbt chassis, service med hætte på",
      "SmartRemote, radio eller kabel, op til 300 m; LWA 87 dB(A) ekskl. værktøj"
    ]
  },
  {
    id: "boom",
    label: "Bom",
    category: "Aktuering",
    description:
      "Bommen er armens første led — det der løfter hammeren op under et loft eller " +
      "ud over et hul. Brokk kalder det three part arm system med fire cylindre: " +
      "én på bommen, én på sticket, én på underarmen, plus slewing. I modsætning til " +
      "en gravemaskines to-leddede arm kan Brokk slå opad og skråt op, fordi det " +
      "tredje led giver vinkel, en backhoe mangler. Cylindre kan få varme- og " +
      "slagbeskyttelse (cy 2 og cy 3) til rødglødende miljøer. Slanger — gule, blå, " +
      "røde i den typiske Brokk-føring — kører udenpå; varmebestandige slanger er " +
      "option. På Brokk 200 når hele kæden 5,45 m lodret og 5,10 m vandret med hammer.",
    specs: [
      "Første af tre armled; hydraulisk cylinder parallelt med bommen",
      "Treleddet Brokk-arm vs. gravemaskinens to led — derfor loft- og skråslag",
      "Rækkevidde Brokk 200 med hammer: 5450 mm lodret, 5100 mm vandret",
      "Option: cylinderbeskyttelse og varmebestandige slanger til hot-work"
    ]
  },
  {
    id: "stick",
    label: "Stick",
    category: "Aktuering",
    description:
      "Sticket er det midterste armled. Det folder bommen ind til transport og strækker " +
      "ud til rækkevidde. Sammen med bommen bestemmer det, om hammeren står lodret " +
      "mod et dæk eller vandret ind i en væg. Hydraulikken er den samme kæde: " +
      "systemtryk 18 MPa, boost 23 MPa når værktøjet kræver det. På de små modeller " +
      "er sticket kort nok til at folde maskinen under 1,15 m højde, så den kører i " +
      "elevator. På Brokk 300 er det samme led, bare længere og med 37 kW bag. " +
      "Kinematisk er sticket ét stift rør med cylinder — det skilles fra bommen som " +
      "ét stykke, ikke som svejsninger og beslag.",
    specs: [
      "Andet armled; folder til transport, strækker til rækkevidde",
      "Min. transporthøjde 880 mm (70) / 1351 mm (200) / 1530 mm (300)",
      "Samme 18/23 MPa-kreds som bommen; cylinder 2 kan have heat-shield",
      "Kinematisk ét stift led — explode skiller sticket fra bommen, ikke i stykker"
    ]
  },
  {
    id: "forearm",
    label: "Underarm",
    category: "Aktuering",
    description:
      "Underarmen er det tredje led og Brokks kendetegn. Den vinkler værktøjet uafhængigt " +
      "af bommen, så en hammer kan slå op i et dæk, ind i et hjørne eller skråt under " +
      "et rør. Et side-angling device er option, når selv tre led ikke er nok i de " +
      "snævreste skakte. Værktøjsflangen sidder her: quick-hitch til BHB-hammer, " +
      "Darda-knuser, saks, grab, bor, tromle, planer, sav. Ekstra hydraulikfunktion " +
      "kræves til visse værktøjer. Uden det tredje led ville Brokk være en lille " +
      "gravemaskine; med det er den en nedrivningsrobot, der arbejder over hovedet " +
      "inde i etagebyggeri, hvor AMG kørte Brokk 300 top-ned fordi dækket ikke bar " +
      "en gravemaskine.",
    specs: [
      "Tredje armled — vinkler værktøjet op, ind og skråt, uafhængigt af bommen",
      "Værktøjsflange / quick-hitch; extra hydraulic function til visse redskaber",
      "Option: side-angling device til de snævreste rum",
      "Det led der adskiller Brokk fra en to-leddet minigraver"
    ]
  },
  {
    id: "tool",
    label: "Værktøj",
    category: "Greb",
    description:
      "End-effectoren er udskiftelig. I gennemgangen vises en hydraulisk hammer — " +
      "BHB 305 på Brokk 200 (295 kg, 610 J, 600–1400 slag/min, 80 mm skaft). " +
      "Brokk 70 kører BHB 105; Brokk 300 BHB 455; de største BHB 555. Hammeren er " +
      "ikke det eneste: Darda-knuser, metalsaks, grab, clamshell, bor, tromle, " +
      "planer, shotcrete og cut-off sav. Anbefalet værktøjsvægt er 105 kg på 70, " +
      "350 kg på 200, 500 kg på 300. Air flushing holder støv ude ved loftsslag og " +
      "under vand; waterspray binder støv; forced draft cooling bruges i varme. " +
      "Operatøren skifter værktøj, ikke anatomi — chassis, bælter og tre led bliver " +
      "stående, hammeren er det, der rammer betonen.",
    specs: [
      "BHB 305 (Brokk 200): 295 kg, 610 J, 600–1400 slag/min, 80 mm skaft",
      "Max værktøj: 105 kg (70), 350 kg (200), 500 kg (300), op til ca. 1,2 t på de største",
      "Skift: hammer, knuser, saks, grab, bor, tromle, planer, sav, shotcrete",
      "Option: air flush, waterspray, forced draft cooling på hammeren"
    ]
  }
];

var BROKK_ANATOMY_SOURCES = [
  { label: "Brokk 200 — produktspecifikationer", url: "https://www.brokk.com/us/product/brokk-200/" },
  { label: "Brokk 70 — kompakt model", url: "https://www.brokk.com/us/product/brokk-70/" },
  { label: "Brokk 300 — mid-heavy", url: "https://www.brokk.com/us/product/brokk-300/" },
  { label: "Brokk — sammenligning af modeller", url: "https://www.brokk.com/us/compare-models/" },
  { label: "Brokk BHB-hammere (205/305/455/555)", url: "https://www.brokk.com/uploads/2023/06/brokk_breakers_bhb205_bhb305_bhb455_bhb555.pdf" },
  { label: "ACP — AMG nedriver etagebyggeri med Brokk 300 og 110", url: "https://acppubs.com/BE/article/C1C7A7CE-demolition-doctors" }
];

/*
 * PRINTER_ANATOMY — Dusty FieldPrinter layout-robot.
 * 3D er en skematisk rekonstruktion ud fra Dustys egne fotos, FCC-manual
 * og support-artikler (ikke officiel CAD). Tal er FieldPrinter / FieldPrinter 2.
 */
var PRINTER_ANATOMY_INTRO = {
  id: "overview",
  label: "FieldPrinter anatomi",
  category: "Oversigt",
  description:
    "FieldPrinter er en bæltegående layout-robot, der printer BIM 1:1 på betondækket. " +
    "Den kører ikke på hjul i den gængse feltudgave: to gummibælter, en hvid/grå kasse " +
    "med computer og batteri, sensorer og en Leica-reflektor på toppen, og et printhoved " +
    "der hænger bagud ned til slaben. Positionen kommer udefra — en laser tracker sigter " +
    "på reflektor-kuglen, IMU og encodere holder den imellem. Printhovedet har sit eget " +
    "servo-tværtrin, så 1/16″ nøjagtighed ikke afhænger af bæltets slør. 3D-modellen er " +
    "skematisk, bygget efter offentlige fotos og FCC-manualens komponentliste.",
  specs: [
    "Bælteplatform + printhoved; layout ±1/16″ (1,6 mm) ved 600 DPI",
    "Position: Leica-tracker på reflektor + IMU/encodere; printhoved-servo ±25 mm tværs",
    "System: robot + tracker + radio + Dusty iPad-app + Dusty Portal (Revit/AutoCAD)",
    "Print: linjer, tekst, symboler, QR; vand- eller solventbaseret blæk",
    "3D: skematisk rekonstruktion. Tal: Dusty support, FCC-manual, produktsider"
  ]
};

var PRINTER_ANATOMY = [
  {
    id: "tracks",
    label: "Bælter",
    category: "Kørsel",
    description:
      "FieldPrinter kører på to korte gummibælter, ikke på hjul. Bælterne giver greb " +
      "på fejet beton, krydser armeringsstøtter og små niveauspring, og holder " +
      "printhovedet i en jævn højde over slaben. Odometrien i bæltet er grov — i " +
      "størrelsesordenen centimeter — og er netop derfor ikke det, der giver 1/16″. " +
      "Hjulslør og encoder-drift kompenseres af trackeren. Dusty kræver fejet dæk, " +
      "så blækket hæfter, og advarer mod kanter og pytter. Robotten printer på hældning " +
      "op til en grænse; derover må den holde stille. Bælterne er det, der gør en " +
      "layout-robot til en pladsmaskine i stedet for et stativ.",
    specs: [
      "To gummibælter; grov odometri (~cm) kompenseres af laser tracker",
      "Kræver fejet slab; ikke print i pytter eller ude over kanter",
      "Hældning: print op til en specificeret grænse, idle derover (Dusty support)",
      "Bælterne holder printhovedets arbejdshøjde over dækket"
    ]
  },
  {
    id: "body",
    label: "Kasse",
    category: "Styring",
    description:
      "Kassen er computer, batteri, radio og førerpanel i ét. FCC-manualen viser " +
      "joystick med dead-man's switch, LT/RT printer-test, retract print head, reprint, " +
      "skip line og flip direction — så operatøren kan gribe ind uden at miste layoutet. " +
      "Øverst sidder håndtag, kabeltromle og elektronik. Dusty leaser systemet; " +
      "entreprenøren kører det selv efter at have sat mindst tre kontrolpunkter, der " +
      "ikke ligger på linje. Path planning og obstacle avoidance kører ombord, så " +
      "robotten printer tæt på vægge (1,25″ langs, 0,825″ foran) og går uden om rod. " +
      "Kassen er hvid over, grå under, med refleksstriber — synlig på et dæk fuld af folk.",
    specs: [
      "Onboard computer + radio + batteri i hvid/grå kasse",
      "Joystick: dead-man, start/stop, retract head, reprint, skip, flip (FCC-manual)",
      "Min. 3 kontrolpunkter pr. station, ikke kollineære",
      "Printer inden for 1,25″ langs væg og 0,825″ foran forhindring"
    ]
  },
  {
    id: "sensor",
    label: "Tracker og sensorer",
    category: "Sansning",
    description:
      "Nøjagtigheden sidder ikke i bæltet. En Leica-lasertracker (typisk AT403-klasse) " +
      "står på dækket og sigter på en stålreflektor-kugle på robotten med <0,005″ på " +
      "100 ft. Positionen går ind i motion controlleren ≥100 Hz. IMU og hjulencodere " +
      "fylder hullerne mellem tracker-samples og fanger hjulslør. Kameraer og computer " +
      "vision ser forhindringer og kanter. To antenner/master sidder bagude. Uden " +
      "gode kontrolpunkter printer robotten skævt — Dusty er eksplicit: control points " +
      "er det, der binder BIM-origo til slaben. På hospitaler og lab-dæk er det den " +
      "kæde, der gør 1/16″ til et tal, man kan bygge efter, ikke et marketingkrav.",
    specs: [
      "Leica-tracker på reflektor-kugle; <0,005″ @ 100 ft, ≥100 Hz til controlleren",
      "IMU + encodere som grov tilstand mellem tracker-samples",
      "Computer vision til forhindringer, kanter og on-slab korrektion",
      "Kontrolpunkter binder projektkoordinater til det fysiske dæk"
    ]
  },
  {
    id: "printarm",
    label: "Printarm",
    category: "Aktuering",
    description:
      "Printarmen er den korte gantry, der bærer printhovedet bagud og kan trække det " +
      "ind (retract) over forhindringer og under transport. Den afkobler robotkassens " +
      "kørsel fra blækkets kontakt med slaben: bæltet kører groft, armen holder hovedet " +
      "i arbejdshøjde. FCC-manualen har 'Retract print head' som dedikeret funktion. " +
      "Linear rails giver det tværtrin, servoen bruger til finjustering. Uden armen " +
      "ville dysen sidde fast i kassen og ramme hvert stykke armering; med den kan " +
      "FieldPrinter køre tæt på vægge og stadig lægge en streg 1/16″ rigtigt.",
    specs: [
      "Gantry/udligger der bærer printhovedet; retract til transport og forhindringer",
      "Linear rails til tværtrin vinkelret på kørsel",
      "Afkobler bæltets grove kørsel fra blækkets kontaktpunkt",
      "FCC: dedikeret retract-kommando på joysticket"
    ]
  },
  {
    id: "printhead",
    label: "Printhoved",
    category: "Greb",
    description:
      "Printhovedet er end-effectoren: blækpatron, dyse, vindskærme og print stall. " +
      "FCC-manualen viser patron-udløser, wind guards og stall under frontpanelet. " +
      "Et servo flytter mekanismen ±25 mm tværs på køreretningen og tager den sidste " +
      "fejl, trackeren ikke nåede — hældning, acceleration, ujævn slab. Dusty printer " +
      "ved 600 DPI, ±1/16″, med vandbaseret blæk (let at vaske af, som kridt) eller " +
      "solvent (mere holdbart, våd eller tæt beton). Farveskift er patronbytte. " +
      "Output er væglinjer, åbninger, MEP-punkter, dør-sving, rumtekst og QR — det " +
      "samme BIM, tømrer og VVS læser på dækket. McCarthy har rapporteret ca. 3.000 " +
      "sparet layout-timer på ét hospital; Dusty selv over 300 mio. kvadratfod.",
    specs: [
      "Dyse + patron + wind guards; 600 DPI, ±1/16″ (1,6 mm) vs. total station",
      "Servo-tværtrin typisk ±25 mm — finleddet der afkobler print fra bælte-odometri",
      "Vandbaseret (kridt-agtigt) eller solvent (våd/tæt beton); farve = patron",
      "Printer linjer, tekst, symboler, QR; Dusty: 300M+ ft² på 1.000+ bygninger"
    ]
  }
];

var PRINTER_ANATOMY_SOURCES = [
  { label: "Dusty Robotics — FieldPrinter FAQ", url: "https://support.dustyrobotics.com/hc/en-us/articles/53201373607067-FieldPrinter-FAQ-Quick-Answers-to-Common-Questions" },
  { label: "Dusty Robotics — FieldPrint Platform", url: "https://www.dustyrobotics.com/fieldprint-platform" },
  { label: "Dusty Robotics — drywall/layout-robot (nøjagtighed, dækning)", url: "https://www.dustyrobotics.com/discover/drywall-robot" },
  { label: "FCC-manual FieldPrinter (komponenter, joystick, patron)", url: "https://fccid.io/2BE9F-FLDPRNTR100/User-Manual/User-Manual-Part-1-7423443.pdf" },
  { label: "FieldPrinter position: Leica-tracker + printhoved-servo", url: "https://industrialmonitordirect.com/blogs/knowledgebase/dusty-robotics-fieldprinter-layout-accuracy-and-technical-specs" },
  { label: "Dusty — FieldPrinter How it Works (video)", url: "https://www.youtube.com/watch?v=cT_hoqj8f40" }
];

// Kategorier brugt til hotspot-etiketter i illustrationen — se PART_LAYOUT i illustration.js.
var PARTKATEGORIER = ["Sansning", "Styring", "Aktuering", "Greb"];
