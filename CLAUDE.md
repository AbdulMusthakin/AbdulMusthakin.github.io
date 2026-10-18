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
  (monospace type). Quotation marks are British: single curly quotes (‘…’), with double ones (“…”) inside, and a hair space
  between two closing marks. DM Mono draws its opening and closing marks alike, so these four characters come
  from STIX Two Text (the `Quote Marks` face in site.css, first in `--mono`).
- **Titles** are in title case: page titles and headings (`Current Work`, `Probability and Statistics`),
  with articles, conjunctions and short prepositions in lower case unless they come first. The folder-style
  links in `notes.html` (`algebraic-topology/`) stay lower case, as file names.

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
- `fonts/goudy-initialen.woff2`: the initial at the head of an article. It is `GoudyInitialen.ttf` (from 1001
  Fonts, under its Free for Commercial Use licence) converted to WOFF2 complete and unmodified: the licence
  forbids subsetting or other changes. The .ttf is listed in `.gitignore`, so the font itself is never pushed.
- `site.js`: the menu, footer year and date, and new-tab links for every page except `index.html`
  (`notes.html`, the pages in `notes/`, both templates and `404.html`).
- `notes.html`: the notes index, set like the topic pages: a title block, then one row per page in
  `notes/` (mathematics, physics, finance, articles), each with a one-line description and, where the page
  has them, links to its subjects. The rows keep the ids `#mathematics` and so on.
- `notes/`: everything written. One page per topic (`mathematics.html`, `physics.html`, `finance.html`)
  plus `articles.html` for non-technical writing, which list the notes and articles (not `notes.html`; see
  below); the PDFs, and any notes or articles written as web pages; and the two templates. Files in
  `notes/` link to each other by plain name (`mellin_transform.pdf`, `mathematics.html`), and to the rest
  of the site with `../` (`../site.css`, `../index.html#work`).
- `notes/note-template.html`: a template for a note written as a web page, with LaTeX via KaTeX (CDN). It
  is excluded from publishing; copy and rename it inside `notes/` to make a note.
- `notes/article-template.html`: the same for a non-technical article, without KaTeX. Also excluded;
  copies stay in `notes/` and are listed on `articles.html`.
- `404.html`: GitHub Pages serves it for any missing address at any depth, so its links start from the
  root (`/site.css`, `/notes.html`). It only looks right on the live site or a local server. Its `MOVED`
  list sends the old address of a moved file on to the new one; whenever a published file moves, add it.
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
  t). Write each as `<li id="ref-key"><span class="key">[Key]</span><span class="entry">…</span></li>` in
  `<ol class="refs">`. The margin notes in §3 of the home page and beside articles are generated from the
  citations automatically; never write them by hand. An article lists only the references it cites.
- **Topic pages** (`notes/*.html`) are built like the home page: a title block (label, the title with a
  pink `/`, an intro, and a Contents list beside it from 1200px wide; the title's size is calculated so
  that "Mathematics/" fits beside the Contents, so a longer title needs that calculation in `site.css`
  redone), then one numbered section per subject (`§1`, `§2` …, alternate
  sections `class="sec alt"`). A subject's section has its description and a "See also" link to its
  home-page subsection on the left, its figure on the right, and its entries below the description.
  - The Contents counts each subject's entries automatically (`data-count` in `site.js`); never type them.
  - A new subject needs a section (copy one), a line in Contents, a figure, and a link in its block in
    `notes.html`. Renumber the sections, figures and entries after it.
- **Entries** are rows in `<ol class="docs">`, numbered by section (`2.1`, `2.2` …):
  `<li class="doc"><div class="doc-meta label"><span class="n">2.1</span><span>Month Year</span><span>N pages</span><span>PDF, X MB</span></div>`
  `<div class="doc-main"><h3><a href="file.pdf" type="application/pdf" target="_blank" rel="noopener">Title</a></h3><p>Summary.</p></div></li>`.
  Without a PDF the meta is `Planned`, `In progress`, or `Written · PDF to be added`, and the title is not
  a link. An article's meta is `Month Year` and `<span data-read-time></span>`, and its link has no `type`
  or `target`. A
  subject with no entries shows `<p class="status empty">[empty]</p>` instead of the list.
- **Figures on the topic pages** are inline SVG, one per subject, captioned `Fig. N — …` like Fig. 2 on
  the home page. They are hand-made drawings, styled only by classes in `site.css` ("figures on the
  topic pages"): `ink`, `soft`, `faint`, `acc` for strokes, `em`/`em2` for the parts that turn pink/gold
  when the figure is pointed at, `d` (with `pathLength="1"`) for strokes that draw themselves on arrival
  and `f` for parts that fade in, staggered by `style="--i:N"`. Labels use the maths face, like the hero
  diagrams. Arrival motion is skipped when motion is reduced or paused on the home page. Pointing at a
  figure changes colours only, never hides anything; a figure may also have one `traveller` (made by
  `<circle class="traveller"><animateMotion begin="indefinite" …>`), a point that `site.js` runs along a
  path while it is pointed at, as on the contour and the worldline. A figure that
  illustrates one of the papers uses that paper's notation (Fig. 4 follows the Dirichlet integral's Γ, γ and ×).
- New published pages go in `sitemap.xml`.
- **PDFs** of notes sit in `notes/`, beside the pages that list them; only the CV stays in the root. Sizes
  are given to one decimal place in MB. Commit a PDF when it is finished: git keeps every
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
- **Diagrams in notes and articles** (commutative diagrams, like tikz-cd): a `div.cd` grid of KaTeX cells.
  Set the column count in its `grid-template-columns` and leave a cell empty where nothing goes. Mark each
  node an arrow touches `data-node="a"`. `site.js` draws the arrows on KaTeX's maths axis and redraws them
  when the diagram changes size.
  - Straight arrows, in any direction: `data-arrows="a>b c>d"` on the `.cd`; `data-dashed="a>b"` dashes one.
    A label is `<span class="cd-label" data-label="a>b">`, set on the left as you travel along the arrow
    (`data-side="right"` for the other side). Copy Fig. 2 in `notes/studying-mathematics.html`.
  - An arrow that curves from the end of one line to the start of the next (tikz-cd's
    `out=0, in=180, looseness=2`): `data-snakes="a>b"`, with its label `class="snake-label" data-label="a>b"`
    sitting on the curve. Copy the long exact sequence in `notes/studying-mathematics.html`, inside its
    focusable `div.cd-wrap`.
  - A diagram in a `div.cd-wrap` that is too wide for its column (on a phone) is fitted to it by `site.js`:
    its side padding comes down to half an em, then it is set smaller, to no less than 60% of its size; past
    that the wrapper scrolls sideways.
- **Articles** take their cues from traditional British book typography, kept light enough for a screen and
  for monospaced type (a fully traditional setting, with centred titles and indented paragraphs, was tried
  and did not suit the site). In site.css, "articles take their cues":
  - The theme as a label above the title, and `<div class="label dateline">` with the month and the reading
    time below it. Paragraphs keep the site's spacing.
  - The first paragraph after the standfirst opens with a woodcut initial from Goudy Initialen (Goudy's
    floriated initials), in the accent pink, three lines deep (sized from the font's metrics; it assumes
    paragraphs at line-height 1.85), with the rest of its first line in small capitals. Tried and set
    aside: a Courier Prime capital in a hatched box, a foliated version, Yinit (its blackletter I reads as
    J) and the same Goudy initial in the pale pink.
  - No headings: sections are separated by `<hr class="break">`, drawn as a broken swash, 132px wide,
    modelled on the swashes in Quanta's Qualia essays: an S-curve that is the same turned upside down, with a
    tight curl into the hump and the trough and a long straight diagonal between them, broken in the middle.
    Each half runs on a little past the middle and is cut square, and the halves are tilted apart so they lie
    side by side where they overlap. It is drawn with a broad nib held steeply, so the diagonal is heaviest
    and the curls thin out to small rounded ends; its thickness, end to end, follows the Qualia swash's. The
    unbroken swash, drawn the same way, was the alternative. Rejected: a plain sine wave with hairline ends
    (too thin) or with blunt, rounded ends (did not look good). More ornate breaks (swelled rules, fleurons,
    filigree) were too much for how often breaks occur.
  - Links to other sites carry a small arrow, and the last paragraph ends with an upright floral heart (❦).
    Not the tombstone (∎): that ends proofs.
  - Displays belong to their sentences: put `$$…$$` inside the `<p>`, with its punctuation inside the
    display; text that carries on after a block diagram is a new `<p>` starting in lower case.
  - A quotation: `<blockquote><p>…</p><p class="label">Source</p></blockquote>`; it is set in italic beside
    the site's plain pink rule, and the dash before the source is added by the stylesheet.
  - The pink is the rubric: the initial, the ornaments, the figure numbers and the citation keys.
  - Write `Fig.&nbsp;N` and `Ch.&nbsp;N` so a number never leaves its word. Figures are
    `<figure class="art-fig">` with `<figcaption><span class="n">Fig.&nbsp;N.</span> …`; a drawn figure is an
    SVG inside `div.scroll > div.art`, with its labels as KaTeX in `span.lab` placed by percentages (`lab end`
    sets a label by its right edge).
- **Reading times** are never typed: `site.js` measures an article's running text before its references
  (each piece of maths counts as one word; figures and diagrams don't count) and reads it at 200 words a
  minute (`WORDS_PER_MINUTE`). In an article's dateline, put `<span class="read-time" data-read-time></span>`
  after the date; in an entry in a list, `<span data-read-time></span>` measures the page its title links
  to (only when served, not opened as a file; whatever is typed inside stays if it can't be measured).
- **Inline maths**: as in TeX, `site.js` keeps a short formula (under 12em) on one line, together with a
  comma or full stop after it and an opening bracket before it, so write `$V$,` as usual. Longer formulas
  may still break where KaTeX allows (after a relation or an operation).
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
