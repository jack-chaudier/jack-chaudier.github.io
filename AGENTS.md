# AGENTS.md — working on this site

Hand-written static portfolio for Jack Gaffney. **Zero build step, zero
dependencies, no third-party requests.** Plain HTML/CSS/JS deployed by GitHub
Pages on push to `main`. The only JS is the theme toggle and the footer year
(`script.js`). Do not add analytics, frameworks, or a bundler.

## Design system (2026-09)

Paper and ink, understated. One readable column (`.shell`), a hairline
`.frame` inset from the viewport edge, engravings screened into two tones.

- **Type (self-hosted, `/fonts/`, SIL OFL — see `fonts/LICENSE.txt`):**
  Instrument Serif (regular + italic) for display and body; Courier Prime
  (regular, bold, italic) for everything in `.mono`: eyebrows, kickers, meta
  lines, nav, footer. `@font-face` rules live at the top of `style.css`; each
  page preloads the three primary files. **No Google Fonts, no external CSS.**
- **Colour:** theme through the CSS custom properties defined at the top of
  `style.css` (paper / ink / secondary ink / accent / rule). Never hardcode a
  colour in markup or page CSS, so light and dark both work. The theme is set
  on `<html data-theme="light|dark">` by the inline bootstrap script in every
  page head and toggled by `#themeToggle`.
- **Engravings (`/art/*.webp`):** each file is an RGBA WebP with constant
  black RGB and the picture in the alpha channel (opaque where the plate is
  light). Pages never show the file directly; a `.plate` element paints a
  solid colour through it with `mask-image` / `-webkit-mask-image`, so the
  same file reads as ink on paper in light mode and as bone on ground in dark
  mode with no second asset. Variants: `.plate--band` (a full-width strip
  above a title), `.plate--figure` (a figure beside or below a section head),
  `.plate--hero`; pick the picture with `.plate--empyrean`,
  `.plate--firmament`, `.plate--mnemosyne`, `.plate--ninth-heaven`,
  `.plate--babel`. Sources, licences, and the mask recipe are in
  `art/README.md`; the credits line in every footer must stay.
- **Mark:** `mark.svg` is the site mark in `currentColor` (64×64 viewBox),
  inlined inside `.wordmark .mark` on every page so it takes the text colour.
  `favicon.svg` / `favicon.ico` / `favicon-32.png` / `icon-192.png` /
  `icon-512.png` / `apple-touch-icon.png` are the same mark rendered on paper.
- **CSP:** every page carries the same strict `Content-Security-Policy`
  meta (`default-src 'self'`, fonts and images self-only, `data:` images
  allowed for the toggle). Anything that needs an external origin is out.
- **Voice:** first person, plain, confident, no hype. No decorative
  animation, no easter eggs.

## Layout of the site
- `index.html` — the one-page portfolio (hero, now, work, projects, writing, contact).
- `rhun/index.html` — Project Rhun: the research program toward Pylos-1.
- `writing/index.html` — the writing **hub** (lists every post, newest first).
- `writing/<slug>/index.html` — one case study, essay, or memo each.
- `style.css`, `script.js` — shared by every page (linked as `/style.css`, `/script.js`).
- `fonts/`, `art/` — self-hosted type and engraving masks.
- `sitemap.xml`, `robots.txt` — keep the sitemap in step with the pages.
- `tools/`, `drafts/`, `design-previews/` — **gitignored** local scratch.

## The page shell (keep it identical everywhere)

Every page uses the same head (charset, viewport, both `theme-color` metas,
title `… — Jack Gaffney`, description, Open Graph + Twitter card, CSP,
canonical with a trailing slash, icon links, manifest, three font preloads,
`/style.css`, the theme bootstrap script), then:

```
<a class="skip-link" href="#main">Skip to content</a>
<div class="frame" aria-hidden="true"></div>
<header class="site-head"><nav class="topnav" aria-label="Primary"> … wordmark (inline mark.svg) + .topnav-links.mono + #themeToggle … </nav></header>
<main class="shell case" id="main"> … </main>      (posts)   |   <main class="shell" id="main"> (hub, /rhun/)
<footer class="site-foot"> … © year · credits line … </footer>
<script src="/script.js" defer></script>
```

Copy the shell from `writing/tether/index.html`; do not hand-edit it into a
variant.

## Adding a writing post — the workflow

Jack will usually paste raw content or point at a file in `drafts/`. Turn it
into a polished page in his voice:

1. **Scaffold** by copying `writing/tether/index.html`. Set `og:type` to
   `article`, the canonical URL to `/writing/<slug>/`. Then wire:
   - a hub card in `writing/index.html` under the `<!-- writing:cards -->`
     marker, newest first:
     `<article class="walkthrough-card"><p class="mono">date · tag</p><h2><a href="/writing/<slug>/">Title</a></h2><p>dek</p></article>`,
   - a `sitemap.xml` entry under `<!-- writing:urls -->` with today's `lastmod`,
   - the `.case-nextprev` links on the neighbouring posts so the chain stays
     in **chronological** order (oldest → newest: maritime, quantum-opus,
     tether, deck-building, research-platform-memo, …).

2. **Format the body** with the case-study components (styled in `style.css`):
   - Header: `.case-back` → `.case-kicker.mono` → `<h1>` (one italic
     `<em>` phrase allowed) → `.dek` → `.case-meta.mono` as
     `date · N min read · stack`.
   - `<h2>` section headings only (no `h3`), `<p>` prose, `<ul><li>`,
     `<blockquote>` for quoted speech.
   - **Decision/tradeoff table:** `<table class="case-table">`.
   - **Callout:** `<div class="case-callout"><span class="caps">Label</span><p>…</p></div>`.
   - **Architecture diagram:** `<figure class="architecture-diagram"><div class="arch-node">A</div><div class="arch-arrow" aria-hidden="true">↓</div><div class="arch-node">B</div></figure>`.
   - **Aside / provenance:** `<p class="case-note">`.
   - Footer nav: `<nav class="case-nextprev mono">` with previous / next.

3. **Shape:** problem → decisions and tradeoffs → a concrete failure and fix
   → what I'd do differently. Favour a real architecture diagram and a
   decision table per substantial post. Match the depth of the existing posts.

4. **Honesty bar (important):** never invent metrics, users, or outcomes. If
   a detail is private (the Maritime build, the research-platform memo's
   client), write the engineering reasoning and say so. Cross-check technical
   claims against the actual repo. No job-hunting or availability language anywhere.

5. **Preview, don't deploy:** `python3 -m http.server 8765`, open the page,
   check light + dark + mobile (400 px wide). Only commit/push when Jack asks.

## `/rhun/` — the honesty gate

The Rhun page describes a research program, not results. It must always say
that no trained Pylos-1 exists and training has not been run; it must not
present the program's internal objects as proved results, any preregistered
measurement as a passed gate, any adapter or benchmark number as a success,
or quote figures beyond the two Zenodo DOIs and Pylos's 1,000,000-turn bench.
Before committing a change to it, this must return nothing:

```
grep -iE 'theorem|T1|T5|0\.929|passed|adapter|win\b|breakthrough|state of the art' rhun/index.html
```

Source facts only from the private `project-rhun` record (`README.md`,
`HUB.md`, `research/00-program.md`); the page says the record is private.

## Editing projects (index.html)

Keep each project to one short paragraph with a mono meta line, a serif
title, a description, and links plus stack chips. Featured projects link to
their case studies. No decorative visuals.

## History

The abandoned "LaTeX preprint" redesign (running heads, academic-paper voice)
lives on the `wip/latex-preprint-2026-08` branch as WIP and is not continued.
The 2026-09 paper-and-ink system replaced the earlier minimal-editorial
Fraunces/JetBrains Mono design.
