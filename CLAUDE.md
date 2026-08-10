# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A zero-dependency, single-page personal portfolio (plain HTML/CSS/JS) for Chan Wang (王耀琛), a structural R&D engineer specializing in automotive optical products. Built to show to HR when applying for jobs. No build system, no package manager, no tests.

## Commands

- **Preview**: open `index.html` in a browser (`start index.html`). No server needed — the site is fully static.
- **Deploy / update the live site**: this folder is a git repo whose remote is `https://github.com/Chanwang98/portfolio.git` (repo was renamed from `chanwang98.github.io` on 2026-08-09). GitHub Pages auto-deploys from the `main` branch root, and the site is live at `https://chanwang98.github.io/portfolio/`. To update, commit and push (Pages rebuilds in 1–2 min):
  ```bash
  git add .
  git commit -m "…"
  git push
  ```
  Git auth is already configured via `gh auth setup-git` (no login prompts). `.nojekyll` in the repo root keeps Jekyll from processing the page.
- **Push gotcha**: the local network reaches `github.com` only intermittently (random TCP timeouts). If `git push` fails with "Could not connect to server", just retry — it usually succeeds on the next attempt. `api.github.com` (used by `gh`) is generally stable; don't change network/proxy settings.

## Architecture

One page, three hand-written files:

- `index.html` — all content and structure.
- `assets/css/style.css` — design system (CSS variables in `:root`) and all styling.
- `assets/js/main.js` — language toggle, scroll-reveal, portfolio lightbox, nav highlighting.
- `assets/images/` — `avatar.jpg` (real photo), `work-1.jpg` … `work-6.jpg` (real works), plus fallback SVGs.

### Bilingual pattern (most important)

Every user-facing text element carries `data-zh` and `data-en` attributes. `applyLang()` in `main.js` swaps text via `el.textContent = el.dataset[lang]` for every `[data-zh]` element, and persists the choice in `localStorage`.

**Constraint this creates**: `textContent` wipes children, so any element that must *contain* inline children (an `<a>`, `<em>`, or the decorative `<span class="dot">`) cannot carry `data-zh`/`data-en` itself. Wrap the translatable text in an inner span and keep the child outside it instead:

- hero name: `<span data-zh="王耀琛" data-en="Chan">王耀琛</span><span class="dot">.</span>`
- thesis citation: `<li><span data-zh=… data-en=…>…</span><a href=…>DOI</a></li>`

Elements without `data-zh` are static across languages (used for the two English journal citations).

### `[hidden]` rule — do not remove

`style.css` starts with `[hidden] { display: none !important; }`. The lightbox uses `display: flex`, which would otherwise override the HTML `hidden` attribute and leave the full-screen overlay permanently covering the page, blocking all clicks. This is a deliberate fix.

### Image convention

- Works: `<img src="assets/images/work-N.jpg" onerror="this.onerror=null;this.src='assets/images/placeholder.svg'">`. A missing file silently falls back to `placeholder.svg`, so the page never shows broken images. Adding a work = drop `work-N.jpg` into `assets/images/` and copy one `<figure class="work">` block in `index.html`.
- Thumbnails use `object-fit: contain` on a pure-white (`#fff`) placeholder background, so the full image always shows (letterboxed, never cropped). The `aspect-ratio: 4 / 3` on `.work-thumb` only sets the box shape.
- Avatar: `assets/images/avatar.jpg`, falls back to `avatar-placeholder.svg`.

### Grid layouts

- `.project-grid` uses `repeat(auto-fit, minmax(320px, 1fr))` so 2 or 3 project cards both fill the row cleanly.
- `.work-grid` uses `repeat(3, 1fr)`; `aspect-ratio: 4 / 3` on `.work-thumb` controls image shape. Both are overridden at the ≤900px / ≤640px breakpoints.

## Content state

All content is real and the site is live. The portfolio has 6 works (`work-1.jpg`…`work-6.jpg`), each showing only a bilingual title (no one-line caption). Display order = `work-N` numbering + `<figure>` order in `index.html`: DLP 智能大灯设计 #1–#3, DLP 光机设计, ADB 大灯设计, 工装设计.

## README

`README.md` is the maintenance and deploy tutorial, including a "作品区怎么改" section explaining how to change images, titles, add/remove works, and tweak grid columns. Keep it in sync whenever content structure changes.
