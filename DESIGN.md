# Design

<!-- impeccable:design-schema 1 -->

## World

Inherited directly from Mery Coffee Club's own existing identity (its logo and printed/Instagram menu graphic), not invented for this build: a deep royal-blue anchor color, a warm cream ground for breathing room, and a soft gold accent, carrying an elegant serif wordmark. The site is treated as "the café's own menu graphic, printed one size bigger" — a direct extension of the real brand, not a generic restaurant-template look.

## Palette

Named roles (CSS custom properties in `src/styles/global.css`):

| Token | Value | Role |
|---|---|---|
| `--color-navy` | `#16264a` | Anchor color — header, section backgrounds, primary text on cream |
| `--color-navy-deep` | `#0c162e` | Deepest navy — hero and Instagram section backgrounds |
| `--color-navy-soft` | `#26386b` | Lighter navy for gradients/depth |
| `--color-cream` | `#faf5e9` | Primary page ground |
| `--color-cream-deep` | `#f0e6cf` | Footer ground, subtle section separation |
| `--color-gold` | `#c6994f` | Warm accent — CTAs, dividers, hover states |
| `--color-gold-deep` | `#9c7433` | Darker gold for text-scale accents |
| `--color-ink` | `#1c2333` | Body text on cream |

Color strategy: **Full palette** (navy, cream, gold each own a named role and real surface area — navy owns the hero and Instagram section at page scale, cream owns the menu, gold is a true accent, never scattered decoration).

Note: a cream/beige ground is a known "safe AI default" — the impeccable detector flags it every run. It is kept here deliberately because it is the café's own real, existing brand color (visible in both their physical/Instagram menu graphic and logo), not a reached-for default; this is a documented exception, not an oversight.

## Type

- English display (headings, wordmark): **Cormorant** — elegant, high-contrast serif with real character, distinct from the AI-default serif wave (Fraunces, Instrument Serif).
- English body / secondary bilingual labels: **DM Sans** — warm, humanist, distinct from the overused Inter/Plus Jakarta Sans/Instrument Sans monoculture.
- Farsi display (primary headings — the site is Farsi-primary throughout): **Noto Serif Arabic** — an elegant Persian serif counterpart to Cormorant.
- Farsi body (primary body text, since Farsi leads throughout): **Vazirmatn** — a clean, modern, warm Persian sans-serif.

Both language tracks pair a serif display face with a humanist sans body face, so the bilingual hierarchy (Farsi large/primary, English smaller/secondary) reads as one coherent system rather than two unrelated typographic choices bolted together.

Type scale is anchored by the hero title (`clamp(2.75rem, 8vw, 5.5rem)`) down to functional labels (~12.5px floor — kept at or above an 11px legibility floor everywhere, corrected during the finish pass from an initial 10.88px category-label size).

## Layout & components

- **Direction**: document-level `dir="rtl"`, `lang="fa"` — Farsi leads visually and structurally everywhere (nav, hero, section headings, footer); English rides as a secondary line/caption throughout, per the user's explicit direction.
- **Header**: sticky, translucent navy bar, wordmark + nav links, gold underline on hover/focus.
- **Hero**: full-bleed dimmed café-interior photo behind a navy radial/linear scrim, centered bilingual wordmark, address line, bilingual tagline, one primary (gold) + one secondary (outline) CTA.
- **Menu**: white elevated cards on the cream ground, one per category, gold rule under each category head, dotted leader lines between item name and price (magazine-style, not a plain table). Bilingual item names; prices are marked in-app as illustrative placeholders pending real pricing (see `PRODUCT.md`).
- **Instagram grid**: navy section, 3×3 responsive photo grid (aspect-ratio-locked tiles), hover reveal of an Instagram glyph + scale/darken on the photo, single "follow" CTA. Photos are placeholder café/coffee/pastry imagery (Wikimedia Commons, see `src/assets/instagram/PROVENANCE.md`) standing in for real Mery Coffee Club photography.
- **Footer**: cream-deep ground, brand mark + tagline, address/hours/contact columns, Instagram link. Contact phone/email intentionally omitted (not yet supplied — see `PRODUCT.md`), never invented.
- Motion is restrained: hover lifts on cards/buttons, image scale+darken on Instagram tiles, gold underline sweep on nav links — no scroll-jacking or gimmick animation, and `prefers-reduced-motion` is respected globally.

## Finish notes

- Verified via the impeccable detector (`scripts/detect.mjs`) at both desktop and mobile viewports, run against the live dev server (Playwright driving the system-installed Chrome, since neither `gh`'s network stack nor Playwright's own browser download work from this network — both fixed environment issues, not project issues).
- Findings fixed during this pass: an all-caps hero eyebrow (removed — folded location into a normal-case line below the headline), a "kicker above heading" pattern on two sections (folded the English micro-label into the heading itself instead of a preceding block), several sub-11px functional labels (bumped to ≥12.5px), low-contrast footer labels (switched from gold-on-cream to navy-on-cream), a text-on-photo contrast dip on the hero address line (added a text-shadow), and two rounds of "overused font" findings (Plus Jakarta Sans → Instrument Sans → settled on Cormorant/DM Sans, since Instrument Sans is itself on the detector's newer-monoculture list).
- One finding is a kept, documented exception: the cream/beige page background, which is the café's own real brand color rather than a generic default (see Palette section above).
