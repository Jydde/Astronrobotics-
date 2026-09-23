# Task
Update the Astron Robotics static site in this repo (/workspace/Astronrobotics-).

## 1) Homepage (`index.html`)
- REMOVE the paragraph under "Coming Soon" (the `.splash-lead` text). Keep the title "Coming Soon", the cyan pulse, particles, header, footer.
- Do not add replacement subtitle text.

## 2) Robots catalog (`robotter.html`) + detail pages
Use the asset map in `ASSETS.json` (already in the repo). Every robot must have:
- A real photo from `img/*.jpg` (no emoji/gradient placeholders)
- Click-through to a detail page where a YouTube video plays (embed)

Create detail pages: `robot-atlas-x.html`, `robot-orion-walker.html`, `robot-forge-arm.html`, `robot-neo-hauler.html`, `robot-scout-mk2.html`, `robot-horizon-series.html`
(or one template pattern with matching filenames from ASSETS.json ids).

Each detail page must include:
- Same site header/nav/theme as the rest of the site
- Robot name + existing short blurb (keep Danish copy from robotter.html, tweak lightly if needed)
- Responsive 16:9 YouTube iframe embed using the youtubeId from ASSETS.json
  - Prefer privacy-enhanced: `https://www.youtube-nocookie.com/embed/VIDEO_ID`
- Visible source note from ASSETS.json (`sourceNote`) so viewers know it is an external reference demo
- Link back to robotter.html

Update `robotter.html`:
- Each `.robot-card` is a clickable link (`<a class="robot-card" href="robot-....html">`) covering the card
- Image on top using the ASSETS image path; object-fit cover; fixed aspect ratio
- Keep maturity tags and blurbs
- Remove placeholder emoji/gradient blocks

## 3) CSS (`css/site.css`)
- Styles for robot card images
- Detail page layout (title, embed wrapper aspect-ratio 16/9, source note)
- Hover state on clickable cards
- Keep existing dark cyan theme

## 4) Do not
- Do not reintroduce splash-lead on index
- Do not delete projekter.html or particles
- Do not commit; just edit files
- Leave ASSETS.json in the repo (useful documentation)

## Done when
- index.html has Coming Soon + pulse only (no lead paragraph)
- All 6 robots show photos on robotter.html
- Clicking a robot opens a detail page with working YouTube embed
- Summarize changed files at the end
