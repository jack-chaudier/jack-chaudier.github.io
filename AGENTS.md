# AGENTS.md — working on this site

Hand-written static portfolio for Jack Gaffney. **Zero build step, zero
dependencies.** Plain HTML/CSS/JS deployed by GitHub Pages on push to `main`.
Design: minimal editorial — Fraunces (serif) + JetBrains Mono, warm paper,
rust accent, a single readable column (`.shell`, max-width 880px). No
decorative animation, no easter eggs — keep it that way. The only JS is the
theme toggle and the footer year (`script.js`).
Always theme via CSS variables (`--ink`, `--ink-2`, `--ink-3`, `--accent`,
`--rule`, `--bg`, `--bg-2`, `--serif`, `--mono`) — never hardcode colors, so
light + dark both work.

## Layout of the site
- `index.html` — the one-page portfolio (hero, now, experience, projects, writing, stack, contact).
- `writing/index.html` — the writing/case-study **hub** (lists all posts).
- `writing/<slug>/index.html` — one case study / post each (committed, deployed).
- `style.css`, `script.js` — shared by every page (linked as `/style.css`, `/script.js`).
- `sitemap.xml` — includes every writing URL.
- `tools/`, `drafts/` — **gitignored** local authoring toolkit (may predate the
  2026 simplification; verify generated markup against the current templates).

## Adding a writing post — the workflow

The author (Jack) will usually **paste raw content** or point to a file in
`drafts/`. Turn it into a polished, on-brand page:

1. **Scaffold** by copying an existing post (`writing/tether/index.html` is the
   reference) — head / nav / footer / theme bootstrap must match. Then wire:
   - a hub card in `writing/index.html` (`<!-- writing:cards … -->` marker,
     newest first, using `.walkthrough-card`),
   - a `sitemap.xml` entry (`<!-- writing:urls -->` marker),
   - optionally a card on the home page `§ writing` list (curated — only the
     top few posts; uses `.writing-item`).

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

5. **Preview, don't deploy:** `python3 -m http.server 8765`, open the page, check
   light + dark + mobile. Only commit/push when Jack asks.

## Editing projects (index.html `§ projects`)
Every project — featured or secondary — is a `.feature` block: mono
`.feature-meta` kicker, serif `h3`, optional italic `.subtitle`, a `.desc`
paragraph, and a `.feature-foot` with `.feature-links` and `.stack` chips.
The three featured projects come first and link to their case studies; the
`.subhead` divider introduces the secondary list. Keep descriptions to one
short paragraph — no decorative visuals.
