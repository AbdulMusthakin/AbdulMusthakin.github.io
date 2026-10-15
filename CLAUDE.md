# CLAUDE.md: abdulmusthakin.github.io

Abdul Musthakin's personal academic website (Warwick MMath student). It is a plain static site served by
GitHub Pages: hand-written HTML, CSS and JavaScript, no build step and no frameworks. Its readers are mainly
academics and recruiters, so the tone is understated, specific and mathematical. It shows what Abdul
studies and links to his writing.

## Working rules

- Abdul commits and pushes himself. Do not commit or push unless he asks.
- He edits the files too. Re-read a file before changing it, and never overwrite his wording. If your
  change and his touch the same lines, merge them.
- Edit his prose lightly: fix grammar, typos and typography, and **list** style suggestions rather than
  rewriting his voice.
- Test every change at phone and desktop widths before calling it done (see Testing).
- Assume the repository is public. Files listed under `exclude` in `_config.yml` are not on the website,
  but they can still be read on GitHub. Nothing private goes anywhere in this folder.
- Anything new that should not be published (notes, drafts, this file) must be added to `exclude`.
- `index.html` has a `google-site-verification` meta tag in its `<head>` (Google Search Console). Never
  remove or change it: Google rechecks it, and the site loses its verification without it.

## Settled design decisions (do not revert)

- **No serif type** for headings or text. He associates serif with AI-made websites. Headings use
  Courier Prime and body text uses DM Mono. STIX Two Text and the "AM Math" subset are only for
  mathematical notation: the hero diagram, the β readout and the ∎.
- **Colours**: a dark Tyrian purple scheme. Every colour is a token in `:root` at the top of `site.css`
  (`--bg #0d0307`, `--tyrian #82074e`, `--accent #f280b2`, `--gold #e5bf6d` …). Change colours there only.
- **Links**: pink accent with an underline, gold on hover. Links to other sites open in a new tab
  automatically (a script in `index.html`, and `site.js` on the other pages).
- **Typing line**: its phrases are subject names, not catchphrases.
- **Hero diagram**: chosen at random on each load, never the same twice running. It has a caption only,
  with no explanation.
- **CV**: only the hero button. It is not in the header or footer.
- **Phones**: the two hero buttons are stacked and full width.
- **Pause button**: stops the complex and the typing, and is remembered (localStorage `am-motion`). The
  arrival animation never replays when motion resumes.
- **Cursor**: a crosshair exactly where a click adds a point to the complex, and nowhere else.
- **Language**: British English (`lang="en-GB"`). Abdul uses the Oxford comma. Apostrophes are straight
  (monospace type).

## Files

- `index.html`: the home page. It contains the hero (`#top`), §1 `#introduction` (prose and Fig. 2), §2
  `#preliminaries` (timeline), §3 `#work` ("Currently on" line, then subsections `#sub-at`, `#sub-dt`,
  `#sub-ag`, `#sub-ps`, `#sub-mp`), `#references` and §4 `#contact`. All home-page scripts are inline at
  the bottom, each with a comment saying what it does.
- `details.js`: email, GitHub, LinkedIn, CV file name, this year's modules, and the "Currently on" line
  (`reading`, `readingDate`). An empty value hides its line or link. `reading` lists texts separated by
  ` · `, and each item stays whole when the line wraps. `index.html` holds plain-text copies of these
  details for visitors without JavaScript; keep them roughly in step.
- `site.css`: all styles for every page.
- `site.js`: the menu, footer year and date, and new-tab links for `notes.html`, `note-template.html` and
  `404.html`.
- `notes.html`: the notes index; PDFs are linked from here (see below).
- `note-template.html`: a template for a note written as a web page, with LaTeX via KaTeX (CDN). It is
  excluded from publishing; copy and rename it to make a note.
- `404.html`: GitHub Pages serves it for any missing address at any depth, so its links start from the
  root (`/site.css`, `/notes.html`). It only looks right on the live site or a local server.
- `drafted-text.md`: earlier drafted wording, kept for reference and not published.
- `fonts/`: self-hosted fonts with their OFL licences. `am-math.woff` is an 11-glyph subset of STIX Two
  Math (ℤ ℱ ← → ∃ ∎ ∗ ∩ ≅ ⊕ 𝒢). A new symbol in a diagram needs a font that contains it.
- `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`: the site icon, linked from every page. Google
  only shows an icon it can fetch as a real file, and wants its address to stay the same: keep these names.
- `preview.png`: the link-preview image (`og:image`). `sitemap.xml` and `robots.txt` are for search
  engines.
- `CV_AM_public.pdf`: the public CV. Never publish a CV with a phone number or home address.

## Content conventions

- **Citations**: `<a class="cite" href="#ref-key">[Key]</a>`. Each key needs a matching
  `<li id="ref-key">` in References, which are in alphabetical order by surname ("tom Dieck" sorts under
  t). The margin notes in §3 are generated from the citations automatically; never write them by hand.
- **Notes entries** in `notes.html`:
  - with a PDF:
    `<li><a href="file.pdf" type="application/pdf" target="_blank" rel="noopener"><i>Title</i></a>, Month Year, N&nbsp;pages <span class="status">[PDF · X MB]</span></li>`
  - without a PDF yet, the status is `[written · PDF to be added]` or `[planned]`.
- **PDFs** currently sit in the root of the folder. Commit a PDF when it is finished: git keeps every
  committed version, and PDFs don't compress against earlier versions. Size limits: GitHub warns at
  50 MB per file and blocks at 100 MB, and the repository should stay under 1 GB.
- **Fig. 2** (the SVG in `#introduction`):
  - Boxes are `<a href="#sub-…" data-node="id" aria-label="Name: status (see 3.x)">` containing
    `g.n-done`, `g.n-now` or `g.n-next` (Studied, Working on, Ahead).
  - Arrows are `path.edge` with `data-from` and `data-to`; the hover tracing uses these.
  - The columns are §3.1, §3.2 and §3.3. Boxes are 112 × 49; columns start at x = 0.5, 144.5, 288.5 and
    rows at y = 40.5, 164.5, 288.5.
  - In a two-line box, the first line's text ends with a space, so the link reads correctly to screen
    readers.
  - Keep each box's status in step with the wording in §3.
- **Hero diagrams**: the `DIAGRAMS` array in `index.html`. Label markup: `*x*` italic, `_{..}`
  subscript, `^{..}` superscript. Arrows are fitted to the measured labels automatically.
- **Typing phrases**: the `PHRASES` array in the typing script. Long phrases wrap safely.

## Testing (before saying a change is done)

- Serve the folder locally (`python -m http.server 8765`) and open http://localhost:8765/. Opening the
  files directly can misbehave, and `404.html` only works from a server.
- Check widths 320, 390, 768, 1024, 1366 and 1920. There should be no sideways scrolling, no overlapping
  text, and all text should stay inside its box, including in Fig. 2.
- Also check: the phone menu, the pause button, reduced motion, and print preview.
- The Nu HTML validator should report no errors. Its CSS checker does not know container queries
  (`container-type`, `@container`), so those two messages are expected.
- An axe-core accessibility scan should report no violations.
