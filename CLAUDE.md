# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static portfolio website for Jack Gaffney built with vanilla HTML5, CSS3, and JavaScript. The site showcases professional experience, projects, skills, and contact information with a modern dark/light theme system.

**Live Site:** https://jack-chaudier.github.io

## Technology Stack

- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with CSS Grid, Flexbox, and CSS custom properties (variables)
- **Vanilla JavaScript** - No frameworks, pure JS for all interactions
- **Font Awesome** - Icon library
- **Google Fonts** - Inter and JetBrains Mono font families

## Development Workflow

### Local Development

Since this is a static site with no build process, you can:

1. **Open directly in browser:**
   ```bash
   open jack-chaudier.github.io/index.html
   ```

2. **Use a local server (recommended):**
   ```bash
   cd jack-chaudier.github.io
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```

### Testing Changes

- **CSS changes:** Modify `style.css` and refresh browser
- **JavaScript changes:** Modify `script.js` and hard refresh (Cmd+Shift+R / Ctrl+F5)
- **HTML changes:** Modify `index.html` and refresh browser

### Deployment

This site uses GitHub Pages for hosting. Changes are deployed automatically when pushed to the main branch:

```bash
cd jack-chaudier.github.io
git add .
git commit -m "Description of changes"
git push origin main
```

The site will be live at https://jack-chaudier.github.io within a few minutes.

## Code Architecture

### Theme System

The site uses a CSS custom properties-based theme system with `data-theme` attribute on the `<html>` element:

- **Theme state:** Stored in `localStorage` as `'theme'` with values `'dark'` or `'light'`
- **Default theme:** Dark mode
- **Implementation:** All colors defined as CSS variables in `:root` and `[data-theme="light"]` selectors in `style.css:2-56`
- **Toggle logic:** `script.js:1-20` handles theme switching and persistence

### Navigation System

- **Active section tracking:** Scroll-based detection updates active nav link (`script.js:41-63`)
- **Mobile navigation:** Hamburger menu with slide-in animation, auto-closes on link click (`script.js:22-39`)
- **Smooth scrolling:** Native CSS `scroll-behavior: smooth` with JS fallback for anchor links (`script.js:76-88`)
- **Sticky navbar:** Fixed position with dynamic shadow on scroll (`script.js:65-74`)

### Snake Game Easter Egg

Hidden game triggered by pressing 's' three times quickly within 1 second:

- **Trigger detection:** `script.js:115-133`
- **Game logic:** Canvas-based Snake implementation (`script.js:90-369`)
- **High score:** Persisted in `localStorage` as `'snakeHighScore'`
- **Theme-aware rendering:** Game colors adapt to current theme (`script.js:278-284`)
- **Hint location:** Footer contains subtle hint about the easter egg (`index.html:519`)

### Animation System

- **Scroll animations:** Intersection Observer for fade-in effects on timeline items, project cards, skill groups, and activity cards (`script.js:389-407`)
- **Hero parallax:** Subtle opacity fade on hero content during scroll (`script.js:409-435`)
- **Scroll indicator:** Animated line at bottom of hero section that fades out on scroll (`script.js:424-428`)

### Responsive Design

- **Breakpoints:**
  - `968px` - Mobile navigation activates, grid layouts simplify
  - `640px` - Single column layouts, full-width buttons
- **Mobile-first approach:** Grid uses `auto-fit` with `minmax()` for automatic responsiveness
- **Touch-friendly:** 40px minimum touch targets for buttons and interactive elements

## File Structure

```
jack-chaudier.github.io/
├── index.html    # Complete single-page structure
├── style.css     # All styles including responsive design
├── script.js     # All JavaScript functionality
└── README.md     # Project documentation
```

All code is contained in three files - no build system or module bundler is used.

## Styling Conventions

- **CSS Variables:** All colors, spacing, and transitions defined in `:root` for easy theming
- **BEM-inspired naming:** Class names follow pattern: `.component-element` (e.g., `.hero-content`, `.nav-link`)
- **Component sections:** CSS organized by component with clear comment headers (e.g., `/* ===== Hero Section ===== */`)
- **Animations:** Custom keyframes for gradients (`@keyframes gradientShift`) and scroll effects

## Key Features Implementation

### Gradient Text Effect
The hero title uses an animated gradient (`style.css:274-290`):
- Background gradient moves across text via `background-position` animation
- Clipped to text using `-webkit-background-clip: text`

### Timeline with Connection Line
Experience timeline uses pseudo-elements for visual connection:
- `::before` creates dot indicator on timeline items (`style.css:536-547`)
- Hover effect shifts content right with glowing border

### Tech Tags
Reusable component for technology badges (`style.css:590-614`):
- Used in both experience and projects sections
- Hover effect includes glow and lift animation

## Known Quirks

1. **Easter Egg Timing:** The 's' key triple-press detector uses a 1-second window. Adjust `S_KEY_TIMEOUT` in `script.js:117` to change sensitivity.

2. **Theme Flash:** On first visit, there may be a brief flash before dark theme applies. This is by design - `localStorage` check happens after DOM load (`script.js:438-443`).

3. **Canvas Rendering:** Snake game canvas is fixed at 400x400px but scales responsively via CSS `width: 100%` (`style.css:1087-1094`).

4. **Console Messages:** The site logs messages to the browser console including an easter egg hint (`script.js:371-387`).

## Contact Information

When updating contact details, modify in three locations:
1. Contact section cards (`index.html:430-476`)
2. Footer links (`index.html:500-505`)
3. Console message (`script.js:385`)
