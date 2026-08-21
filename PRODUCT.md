# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro, static output (SSG). Chosen over plain static HTML/CSS/JS because the user wants room to grow; chosen over an SSR/server-backed framework because the site has no dynamic/server-side needs. Will be deployed to the user's own Ubuntu server (full SSH access) behind Nginx, rather than a commercial shared host that only supports PHP — the Ubuntu server was chosen for its greater growth potential (full control over the web server, TLS, and future backend capabilities) even though it starts with only default packages installed.

## Users

Primary users are prospective and current customers of Mery Coffee Club, a café in Rasht, Iran, browsing the menu before or during a visit — deciding what to order, checking hours/location, or getting a feel for the café's vibe (e.g. via the Instagram section) ahead of walking in. The audience is primarily Farsi-speaking with a secondary English-reading segment, and primarily browses on mobile.

## Product Purpose

A beautiful, easy-to-browse digital showcase of the café's real menu and brand identity. The site's only job is to present the menu and practical visit information elegantly online — it is explicitly not an ordering or e-commerce product (no cart, no checkout, no "add to order").

## Positioning

Distinguishes itself from generic templated "restaurant menu website" output by directly reflecting the café's actual brand identity (its navy/cream palette, elegant serif wordmark, warm tone) rather than defaulting to generic AI-template design patterns (default fonts, purple-blue gradients, sterile minimalism, or a cold fintech-app feel).

## Operating Context

- Café location: Rasht, Iran (Azarandami St. | Sina Alley).
- Hours: Daily, 6 AM – 11 PM.
- Offerings: Coffee, Brunch, Pastry, To Go.
- Site content is sourced from two real artifacts the user supplied: a menu graphic (categories and bilingual EN/FA item names) and the café's Instagram profile (@merycoffeeclub) bio (name, tagline, address, hours, offerings).
- Bilingual presentation throughout: Farsi-primary, English-secondary (RTL-first hierarchy for hero, navigation, section headers, and footer), matching the per-item EN/FA pairing already used on the physical menu.

## Capabilities and Constraints

- No ordering, cart, checkout, or "add to order" functionality anywhere on the site — showcase only.
- Menu categories and item names must exactly match the source menu image (Warm Coffee, Iced Coffee, Smoothies, Mocktails, Matcha Bar, Milkshakes, Hot Drink, Dessert, Breakfast/Brunch, Iced Tea) — nothing invented or omitted.
- The source menu has no prices or item descriptions. Per explicit user direction, the site displays clearly-illustrative **placeholder prices** for showcase purposes only, stored centrally in the menu content data so they are a simple swap when real prices are supplied later. Item descriptions remain absent (not fabricated).
- No real photos have been supplied for the Instagram-style photo grid section; warm, café-appropriate placeholder imagery is used there until real photos are provided.
- Contact phone/email is not yet available and must not be invented; omit from the footer until the user supplies it in a future update.
- Deployment target: the user's own fresh Ubuntu server via SSH (Nginx serving the static build); a commercial PHP-only host exists but is intentionally not used.

## Brand Commitments

- Name: **Mery Coffee Club** (کافه مری), as shown on both the menu graphic and Instagram profile.
- Tagline: **"Your Daily Pause."**
- Instagram: **@merycoffeeclub**.
- Existing visual identity (from the menu graphic and Instagram avatar): a circular navy-blue mark with an elegant serif "Mery / coffee club" wordmark, and a cream/white menu layout bordered in navy — consistent with, and the direct source for, the user's requested royal-blue-anchor + white/cream + warm-accent palette and elegant serif heading / warm sans-serif body pairing.

## Evidence on Hand

- Real menu categories and bilingual (EN/FA) item names, transcribed from the user-supplied menu graphic (no prices or descriptions in the source).
- Instagram bio text and profile screenshot confirming name, tagline, address, hours, and offerings.
- Explicit absences to preserve, not fabricate: no phone/email, no confirmed real prices, no item descriptions, no real photos for the Instagram grid section.

## Product Principles

1. Menu content must always reflect the café's real, confirmed offerings — never invent or omit items.
2. Placeholder content (prices, photo-grid imagery) must be clearly swappable (centralized data, not hardcoded per component) and never treated internally as final production data.
3. The design should read as a direct extension of the café's existing brand identity, not a generic template.
4. Farsi-primary bilingual hierarchy serves the primary local audience while staying accessible to English readers.
5. Mobile-first: most visitors will check the site on their phone before or during a visit.
