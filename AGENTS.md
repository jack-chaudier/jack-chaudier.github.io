# AGENTS.md — working on this site

Hand-written static portfolio for Jack Gaffney. **Zero build step, zero
dependencies.** Plain HTML/CSS/JS deployed by GitHub Pages on push to `main`.
Design: LaTeX-inspired minimal — STIX Two Text (serif) + JetBrains Mono, warm
paper, rust accent, a single readable column (`.shell`, max-width 760px).
Writing pages are typeset like article-class papers: centered title block,
small-caps byline, an abstract, numbered sections (CSS counters), booktabs
tables, and captioned figures. No
decorative animation, no easter eggs — keep it that way. The only JS is the
theme toggle and the footer year (`script.js`).
Always theme via CSS variables (`--ink`, `--ink-2`, `--ink-3`, `--accent`,
`--rule`, `--bg`, `--bg-2`, `--serif`, `--mono`) — never hardcode colors, so
light + dark both work.

## Layout of the site
- `index.html` — the one-page portfolio (hero, experience, projects, writing, contact).
- `writing/index.html` — the writing **hub** (lists all posts, newest first, with dates).
- `writing/<slug>/index.html` — one case study / essay / memo each (committed, deployed).
- `style.css`, `script.js` — shared by every page (linked as `/style.css`, `/script.js`).
- `sitemap.xml` — includes every writing URL.
- `tools/`, `drafts/` — **gitignored** local authoring toolkit (may predate the
  2026 simplification; verify generated markup against the current templates).

## Adding a writing post — the workflow

The author (Jack) will usually **paste raw content** or point to a file in
`drafts/`. Turn it into a polished, on-brand page:

1. **Scaffold** by copying an existing post (`writing/tether/index.html` for a
   numbered case study; `writing/deck-building/index.html` for an unnumbered
   essay — add `paper-unnumbered` to `.case`) — head / nav / footer / theme
   bootstrap must match. Then wire:
   - a hub card in `writing/index.html` (`<!-- writing:cards … -->` marker,
     newest first, using `.walkthrough-card` with a `.card-date`),
   - a `sitemap.xml` entry (`<!-- writing:urls -->` marker),
   - an entry in the home page `§ writing` references list (`.pub-list`),
   - update the `.case-nextprev` chain on the neighboring posts.

2. **Format the body** using the site's paper components (all already
   styled in `style.css`):
   - Title block: `.paper-head` with `.case-kicker`, `<h1>`, `.paper-byline`,
     `.paper-date`, and an `.abstract` (`<span class="abstract-label">Abstract</span><p>…</p>`).
   - `<h2>` section headings (auto-numbered by CSS counters), `<p>` prose
     (justified with LaTeX-style paragraph indents), `<ul><li>`.
   - **Decision/tradeoff table (booktabs):** wrap in
     `<div class="table-wrap"><p class="table-caption">…</p><table class="case-table">…</table></div>`
     — captions are auto-numbered "Table n:".
   - **Callout** (failure→fix, "what I'd do differently", asides):
     `<div class="case-callout"><span class="caps">Label</span><p>…</p></div>`.
   - **Architecture diagram:** `<figure class="architecture-diagram"><div class="arch-node">A</div><div class="arch-arrow" aria-hidden="true">↓</div><div class="arch-node">B</div><figcaption>…</figcaption></figure>`
     — figcaptions are auto-numbered "Figure n:".
   - Page scaffold uses `.case`, `.paper-head`, `.case-meta`, `.case-back`,
     `.case-note`, `.case-nextprev` — keep them.

3. **Add good visuals** — favor a real architecture diagram and a decision table
   per substantial post; they're the highest-signal elements for SWE/FDE readers.
   A strong post has: problem → decisions/tradeoffs → a concrete failure-and-fix →
   what I'd do differently. Match the depth/voice of the existing
   `writing/tether/`, `writing/quantum-opus/`, `writing/maritime/` pages.

4. **Honesty bar (important):** never invent metrics, users, or outcomes. If a
   detail is private (e.g. the Maritime/Foundry build), write generic engineering
   reasoning and say so. Cross-check technical claims against the actual repo.

5. **Preview, don't deploy:** `python3 -m http.server 8765`, open the page, check
   light + dark + mobile. Only commit/push when Jack asks.

## Editing projects (index.html `§ projects`)
The three **featured** projects are `.feature` blocks: mono `.feature-meta`
kicker, serif `h3`, optional italic `.subtitle`, a `.desc` paragraph, and a
`.feature-foot` with `.feature-links` and `.stack` chips. They come first and
link to their case studies. The `.subhead` divider introduces the **secondary**
projects, which are compact `.mini-list` items (`.mini-name`, `.mini-links`,
one-line `.mini-desc`). Keep descriptions to one short paragraph — no
decorative visuals.
