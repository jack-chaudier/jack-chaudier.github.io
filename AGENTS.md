# AGENTS.md — working on this site

Hand-written static portfolio for Jack Gaffney. **Zero build step, zero
dependencies.** Plain HTML/CSS/JS deployed by GitHub Pages on push to `main`.
Design: Fraunces (serif) + JetBrains Mono, warm ink on near-black, rust accent.
Always theme via CSS variables (`--ink`, `--ink-2`, `--ink-3`, `--accent`,
`--rule`, `--bg`, `--bg-2`, `--serif`, `--mono`) — never hardcode colors, so
light + dark both work.

## Layout of the site
- `index.html` — the one-page portfolio (hero, now, work, **projects**, **writing**, stack, contact).
- `writing/index.html` — the writing/case-study **hub** (lists all posts).
- `writing/<slug>/index.html` — one case study / post each (committed, deployed).
- `style.css`, `script.js` — shared by every page (linked as `/style.css`, `/script.js`).
- `sitemap.xml` — includes every writing URL.
- `tools/`, `drafts/` — **gitignored** local authoring toolkit (see `tools/README.md`).

## Adding a writing post — the workflow

The author (Jack) will usually **paste raw content** or point to a file in
`drafts/`. Turn it into a polished, on-brand page:

1. **Scaffold** from the template, which guarantees consistent head / nav /
   footer / terminal / theme:
   - Easiest: `node tools/new-post.mjs --draft drafts/<file>.md`
     (or `--title "…" --kicker "…" --dek "…" --stack "…" --links "…"`).
   - This creates `writing/<slug>/index.html` and **auto-wires** three things
     via marker comments — do not wire them by hand:
     - the hub card in `writing/index.html`  (`<!-- writing:cards … -->`)
     - the `sitemap.xml` entry              (`<!-- writing:urls -->`)
     - the terminal `read <slug>` target     (`/* writing:read-map */` in `script.js`)
   - If you build the page without the script, replicate those three insertions.

2. **Format the body** using the site's case-study components (all already
   styled in `style.css`):
   - `<h2>` section headings, `<p>` prose, `<ul><li>`.
   - **Decision/tradeoff table:** `<table class="case-table"><thead><tr><th>…</th></tr></thead><tbody>…</tbody></table>`.
   - **Callout** (failure→fix, "what I'd do differently", asides):
     `<div class="case-callout"><span class="caps">Label</span><p>…</p></div>`.
   - **Architecture diagram:** `<figure class="architecture-diagram"><div class="arch-node">A</div><div class="arch-arrow" aria-hidden="true">↓</div><div class="arch-node">B</div></figure>`.
   - Page scaffold uses `.case`, `.case-kicker`, `.dek`, `.case-meta`,
     `.case-back`, `.case-nextprev` — keep them.

3. **Add good visuals** — favor a real architecture diagram and a decision table
   per substantial post; they're the highest-signal elements for SWE/FDE readers.
   A strong post has: problem → decisions/tradeoffs → a concrete failure-and-fix →
   what I'd do differently. Match the depth/voice of the existing
   `writing/tether/`, `writing/quantum-opus/`, `writing/maritime/` pages.

4. **Honesty bar (important):** never invent metrics, users, or outcomes. If a
   detail is private (e.g. the Maritime/Foundry build), write generic engineering
   reasoning and say so. Cross-check technical claims against the actual repo.

5. **Optionally feature on the home page:** the home `index.html` `§ writing`
   grid (`.writing-grid`) is curated — only add a new card there if it's strong
   enough to be one of the top few. The hub always lists everything.

6. **Preview, don't deploy:** `python3 -m http.server 8765`, open the page, check
   light + dark + mobile. Only commit/push when Jack asks.

## Editing the Featured projects (index.html `§ projects`)
Featured projects are full-width **`.feature-row`** editorial rows (gutter
numeral + big serif name + mono meta + subtitle + one-line `.feature-flow` mono
pipeline + `.feature-foot` with chips and links). The flagship row adds `.lead`.
Secondary projects live in the `.projects` grid below.

## Easter eggs (script.js)
Terminal (`/` or `?`), Konami code, matrix rain, portrait clicks, `t` theme
toggle. Terminal commands live in the `COMMANDS` object; keep `projects`,
`writing`, and the `read` map in sync with the site when content changes.
