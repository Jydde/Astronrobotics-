# Billedkilder — Byggerobotter

Samme tabel-konvention som [Website Frontend/assets/robots/SOURCES.md](../../Website%20Frontend/assets/robots/SOURCES.md).

| Fil | Kilde-URL | Type |
|---|---|---|
| persona-humanoid.webp | [persona.ai/humanoid-robots-for-construction](https://persona.ai/humanoid-robots-for-construction/) | Officielt værksted-/prototypefoto (Persona AI) |
| apptronik-apollo.jpg | [apptronik.com/apollo/apollo-2](https://apptronik.com/apollo/apollo-2) | Officiel studie-render (Apptronik) |
| boston-dynamics-atlas.jpg | [bostondynamics.com/atlas](https://bostondynamics.com/atlas/) | Officielt produktfoto (Boston Dynamics) |
| figure-03.webp | [humanoid.guide/product/figure-03](https://humanoid.guide/product/figure-03/) | Tredjeparts render, ikke fra Figure AI selv |
| unitree-g1.jpg | [unitree.com/g1](https://www.unitree.com/g1) | Officiel produkt-render, gående sideprofil (Unitree) |
| brokk.jpg | Genereret katalogfoto (Imagine) | Illustration af orange bælte-nedrivningsrobot på plads — ikke et officielt Brokk-foto |
| dusty-fieldprinter.jpg | Genereret katalogfoto (Imagine) | Illustration af hvid layout-robot der printer på dæk — ikke et officielt Dusty-foto |
| hilti-jaibot.jpg | Genereret katalogfoto (Imagine) | Illustration af rød loftborerobot — ikke et officielt Hilti-foto |
| acr-tybot.jpg | Genereret katalogfoto (Imagine) | Illustration af gul armerings-gantry over brodæk — ikke et officielt ACR-foto |
| sam100.jpg | Genereret katalogfoto (Imagine) | Illustration af orange mure-robot på stillads — ikke et officielt Construction Robotics-foto |
| boston-dynamics-spot.jpg | Genereret katalogfoto (Imagine) | Illustration af gul firbenet inspektionsrobot — ikke et officielt Boston Dynamics-foto |

## Kendte forbehold

- **apptronik-apollo.jpg**: billedet viser **Apollo 2**, den nuværende model på Apptroniks
  side — robotobjektet i `js/data.js` (`id: "apptronik-apollo"`) beskriver den oprindelige
  Apollo baseret på ældre specs. Bør tjekkes/opdateres samlet (billede + specs) før
  offentlig lancering, så de ikke er ude af trit med hinanden.
- **figure-03.webp**: har et synligt "Humanoid.guide"-vandmærke — samme mønster som de
  vandmærkede billeder i hjemmepleje-kataloget. Fint til internt brug/udkast, bør erstattes
  med et vandmærkefrit billede før offentlig lancering.
- Alle 5 humanoide billeder er producent-/tredjeparts presse- og marketingmateriale — ingen er købt
  eller eksplicit rettighedsklareret til kommerciel genbrug. Bekræft rettigheder med hver
  producent (eller find alternative, klart licenserede billeder) før offentlig/kommerciel
  lancering — samme regel som i hjemmepleje-kataloget.
- De 6 byggepladsrobot-billeder er genererede illustrationer, ikke producentfotos. De viser
  typen (form, farve, opgave), ikke den officielle model 1:1. Erstat med licenserede
  pressefotos før offentlig lancering.
