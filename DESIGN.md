# DESIGN.md — WebToMarkdown

The visual system for the WebToMarkdown brand mark, the marketing site (`web/`), and anything else that carries the logo. Read this before touching `web/app/globals.css`, the landing page sections, or any icon asset.

## 1. Position

WebToMarkdown does one small, precise job: it takes the readable part of a web page and turns it into Markdown. The design should feel the same way. It should look like a well-made tool manual or a Swiss transit poster, and not like a startup template.

**References:** mid-century corporate identity (Chermayeff & Geismar, Paul Rand, Otl Aicher, Anton Stankowski), International Typographic Style posters, printed technical manuals and type specimens.

**Anti-references (what we are moving away from):** neon-on-navy "AI" palettes, glows, glassmorphism, gradient blobs, pill badges, emoji feature icons, three-up card grids that lift on hover, everything centered, fade-up-on-scroll for every block.

Tests for any new element:

1. Would it still work printed in black and one spot color? If not, simplify it.
2. Does it say something specific about *this* product? If it could sit on any SaaS page, cut it.
3. Is it aligned to the grid? If it floats, fix it.

## 2. The mark

### Concept

A solid circle cut into a 3 × 3 grid by a `#`. The center cell is filled with signal red.

- **The circle is the web.** It's a whole page, as found.
- **The cuts are Markdown.** `#` is the first character most people type in Markdown, and it's the heading marker. Here it's drawn as negative space.
- **The red square is the readable part.** On almost every web page, header, nav, sidebar, aside, and footer surround the content you actually want, the same way the outer cells surround this one. The extension keeps that center cell, and so does the mark.

The center cell of the mark is the main content area of a web page, and that idea carries through the site. The hero diagram, the section markers, and the bullets all reuse it.

### Construction

Built on a 120-unit square.

| Part | Value |
| --- | --- |
| Circle | diameter 120, centered |
| Center cell | 38 × 38, centered |
| Gutters (the `#` strokes) | 10 wide, running fully across the circle |
| Outer cells | whatever the circle leaves after the gutters cut it |

The outer cells are ink, the center cell is signal red, and the gutters are always transparent: they cut through the circle to whatever background is behind it. Never fill the gutters with a color.

Master files live in `docs/brand/`:

- `logo-mark.svg`: the bare mark, transparent background.
- `logo-mark-reversed.svg`: the bare mark for ink backgrounds.
- `logo-tile.svg`: the mark on a paper tile with rounded corners. Used for the browser toolbar, favicon, and apple-touch icon.
- `logo-app-icon.svg`: macOS app icon (824 px body on a 1024 canvas, with the standard drop shadow).

All PNG icon assets in the repo are generated from these files by `scripts/render-brand-icons.mjs`. Don't edit the PNGs by hand.

### Usage

- Minimum size is 16 px. Below 24 px, use the tile version so the gutters stay open on dark browser chrome.
- Clear space around the mark is one center-cell width (38 units) on every side.
- On dark backgrounds, flip the outer cells to paper and keep the center red.
- Don't rotate, outline, add gradients or shadows to, or animate the mark (the macOS app icon shadow is the one exception), and don't put it in a circle or badge.
- Don't change the red to match a theme. The center cell is always signal red.

### Wordmark

"WebToMarkdown" is set in Archivo, weight 700, normal width, tracking −0.01em. It sits to the right of the mark and is vertically centered on it. The gap between them is half the mark's width.

## 3. Color

Print-like: warm paper, near-black ink, and one spot color.

| Token | Hex | Use |
| --- | --- | --- |
| `--paper` | `#F2EEE5` | Page background |
| `--paper-deep` | `#E7E2D6` | Alternate bands, code wells |
| `--ink` | `#151412` | Primary text, rules, primary buttons, the mark |
| `--ink-soft` | `#45413B` | Body copy |
| `--ink-muted` | `#6C675E` | Captions, metadata, dropped/struck items |
| `--rule` | `#CFC8BA` | Hairlines between rows |
| `--signal` | `#E2401C` | The red square. Large display marks, active states, `#` glyphs in code samples |
| `--signal-text` | `#B5300F` | Red that has to meet AA contrast as small text on paper |

Rules:

- Red covers less than 5% of any screen. It marks the one thing that matters in a composition.
- Don't put small text on red. Red buttons are not allowed, so the primary button is ink with paper text.
- Inverted bands (ink background, paper text) are allowed once per page for emphasis. On ink, use `#F2EEE5` for text and `#A39E93` for muted text.
- No gradients, glows, or transparency-based tints.

## 4. Typography

| Role | Face | Notes |
| --- | --- | --- |
| Display | Archivo, 800, `font-stretch: 112%` | Headlines. Tight leading (0.92–1.0), tracking −0.035em |
| Text | Archivo, 400/500, normal width | Body and UI. 17–18 px base on desktop, line-height 1.55 |
| Mono | IBM Plex Mono, 400/500 | Section labels, index numbers, keycaps, Markdown samples, metadata |

Both faces are loaded through `next/font/google`.

Scale (desktop): 12 / 14 / 17 / 22 / 32 / 48 / 72 / 112 px. On mobile the display sizes step down two notches.

Conventions:

- Section labels are mono, uppercase, 12 px, tracking 0.08em, and look like `01 — What it keeps`. Don't add letter-spacing beyond that.
- Running heads, figure captions, and metadata are mono 12–13 px in `--ink-muted`.
- Headlines are left-aligned. Nothing is centered except, at most, a single closing statement.
- Show Markdown syntax as real Markdown in mono, with the syntax characters (`#`, `-`, `|`, `` ` ``, `[]()`) colored `--signal-text`.

## 5. Grid & layout

- 12-column grid, max content width 1240 px, gutters 24 px, page margins 16 px (mobile) / 32 px (tablet) / 48 px (desktop).
- Sections are separated by a full-width 1 px ink rule, not by spacing alone or by color changes.
- The default section layout is a label column (3 cols) next to a content column (9 cols). On mobile, the label stacks on top.
- Vertical rhythm uses multiples of 8 px. Section padding is 96 px desktop / 64 px mobile.
- Corners are square. The only rounded shapes are the circle in the mark and the app-icon tile.
- Use 1 px hairlines in `--rule` for rows and 1 px `--ink` for structural frames. No drop shadows on page elements.

## 6. Components

**Primary button:** ink fill, paper text, Archivo 600, 15 px, padding 14 × 22, square corners. Hover shifts the button 2 px up and left and shows a 2 px red offset block behind it, like a misregistered print. Focus shows a 2 px red outline with a 2 px offset.

**Secondary button:** transparent, 1 px ink border, ink text. Hover fills it with ink and flips the text to paper.

**Text link:** ink, with a 1 px underline offset 3 px. Hover changes the underline to signal red.

**Keycap:** IBM Plex Mono 13 px, 1 px ink border, 2 px solid ink bottom border, paper fill, minimum width 28 px. Used for `⌥ ⇧ M` / `Alt Shift M`.

**Ledger row:** A two-column row with the item name on the left and its Markdown output (mono) on the right, separated by a `--rule` hairline. Dropped items are struck through in `--ink-muted`.

**Figure:** a 1 px ink frame with no rounding or shadow, plus a mono caption below it: `Fig. 1 — Caption text.`

**Red-cell bullet:** an 8 × 8 px signal square, used instead of dots in lists that need emphasis.

## 7. Motion

Motion is scarce and explains something; it's never decoration.

- The hero diagram is the only animated element on the landing page. The page's outer cells fade back to hatching, then the Markdown lines appear one by one. The sequence runs once on load (about 1.6 s total), with `steps()`/linear timing and no bounces or springs.
- Hover transitions are 120 ms linear.
- Everything respects `prefers-reduced-motion: reduce`, which shows the end state with no animation.
- Content doesn't fade in on scroll. It's just there.

## 8. Voice in the layout

- Lead with the noun or verb: "Web page in. Markdown out." Don't write "Unlock the power of…".
- Use numbers and specifics, such as keyboard shortcuts, setting names, and what gets dropped. Specifics are the decoration.
- Don't make claims the extension can't back up. If it isn't in `content/` or `options/`, it doesn't go on the page.

## 9. Landing page structure

| # | Section | Purpose |
| --- | --- | --- |
| — | Header | Mark + wordmark, mono nav, install button |
| 00 | Hero | "Web page in. Markdown out." Install CTA, shortcut keycaps, and the page → Markdown diagram |
| 01 | What it keeps | Keep/Drop ledger showing the Markdown each element becomes |
| 02 | Three ways to copy | Popup, page menu, shortcut, in three ruled columns |
| 03 | Settings | The five real options from `shared/constants/default-settings.js`, as a spec sheet |
| 04 | In the browser | Real screenshots as captioned figures |
| — | Privacy band | Ink band: "Nothing leaves your browser." |
| — | Closing CTA | Final install prompt |
| — | Footer | Colophon-style grid |

Each section is its own component in `web/app/landing/`, following the repo's single-purpose-file rule.

## 10. Content pages

Blog, privacy, terms, and support pages inherit the same tokens. Keep them as plain reading columns (max 68ch), with mono running heads and square corners, and don't add hero art.
