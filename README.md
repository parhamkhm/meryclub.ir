# Mery Coffee Club — meryclub.ir

The website for Mery Coffee Club, a specialty café in Rasht, Iran. Persian-first
with an English toggle, right-to-left throughout.

**Live:** [meryclub.ir](https://meryclub.ir) · **Admin panel:** [meryclub.ir/club-admin](https://meryclub.ir/club-admin/)

---

## What's in here

The site is two parts that deploy separately:

1. **The static site** (`index.html` + `comments/index.html` + `assets/`) — hero,
   full menu with search and category tabs, café story, reviews & suggestions,
   an Instagram gallery, and a "Find Us" section, plus a dedicated `/comments`
   page listing every approved review. No build step needed to view it;
   Tailwind is pre-compiled into `assets/css/styles.css`.
2. **A small backend** (`server/`) — powers the Customer Club (signup form,
   password-protected admin panel, configurable loyalty settings and menu-price
   overrides) and the Reviews & Suggestions feature (submission, moderation,
   shared reaction counter). Node.js + Express + SQLite, no external database
   service required.

```
index.html              the homepage (single page)
comments/index.html     "/comments" — every approved review, ranked by reactions
assets/
  css/                  tailwind-input.css (source) → styles.css (compiled, what ships)
  js/                   i18n.js, menu-data.js, gallery-data.js, site-config.js, app.js
  img/, video/, fonts/  static media, self-hosted fonts (no Google Fonts dependency)
server/
  server.js             Express app: club signup API + admin API
  db.js                 SQLite schema + seed data (node:sqlite, no extra dependency)
  config.example.json   template for server/config.json (never committed — see below)
  public/               the admin panel (index.html + app.js)
menu-photo-prompts.md   AI image-generation prompts for menu items still missing photos
menu-demo.html          early layout exploration for the tabbed menu (not linked from nav)
```

---

## Updating the menu

Open **`assets/js/menu-data.js`**. Every item looks like this:

```js
{ en: "Cappuccino", fa: "کاپوچینو", price: null, img: "cappuccino" }
```

- **Price:** replace `null` with a plain number in thousands of Toman, as on
  the printed menu (e.g. `120` shows as ۱۲۰,۰۰۰ تومان). No commas, no
  "تومان" — the site formats it. Two sizes: `[150, 170]`. Order-dependent:
  `"variable"`. Leave `null` to keep showing "به‌زودی" (soon).
- **Photo:** set `img` to a filename (no extension) that exists as both
  `assets/img/menu/<name>.jpg` and `.webp` (640×640 square). Photos are cached
  for 30 days, so a replacement photo needs a new filename — the existing ones
  end in a short content hash (e.g. `iced-latte-1a2b3c`) for that reason. Omit
  `img` entirely to fall back to the category icon. `menu-photo-prompts.md` has ready-to-use prompts for every
  item that still needs a photo.
- **Signature items:** add `signature: true` to badge it "پیشنهاد مری".
- **Hide an item** temporarily: add `hidden: true`.

### Changing prices from the admin panel

Use the **قیمت‌ها** tab in `/club-admin/` to change a price without editing or
deploying `menu-data.js`. It supports a single price, two sizes, "coming soon",
and "order-dependent" pricing. Values are entered in thousands of Toman. The
override is stored in SQLite and the public menu applies it on its next load.
Use **بازگردانی** to return an item to the default value in `menu-data.js`.

## Updating text / translations

Every visible string lives in **`assets/js/i18n.js`**, once under `fa` and once
under `en`, with matching keys — change wording there rather than in `index.html`.

## Contact info, hours, map link

**`assets/js/site-config.js`** — address, hours, phone, Instagram handle, and
the Google Maps link.

---

## Local development

Requires Node.js 18+ (the backend uses the built-in `node:sqlite` module,
available from Node 22.5+; the production server runs Node 22).

```bash
npm install                # installs Tailwind CLI (root)
npm run watch               # rebuilds assets/css/styles.css on change
```

To run the backend locally with the real site served from the same origin
(needed for the Customer Club form's `/api/...` calls to work):

```bash
cd server
npm install
cp config.example.json config.json   # then fill in real values, see below
MERY_SERVE_ROOT="/absolute/path/to/this/repo" \
MERY_INSECURE_COOKIES=1 \
PORT=3210 node server.js
```

Then open `http://localhost:3210/`. `MERY_INSECURE_COOKIES` is for local
`http://` testing only — production (behind HTTPS via nginx) never sets it, so
admin session cookies stay `Secure`.

(`server/dev-server.js` sets the same three env vars in-process and then
requires `server.js` — a convenience entry point for tools that can't set
environment variables before launching a command, e.g. `.claude/launch.json`'s
`server` config. Not used in production.)

### `server/config.json` (not committed — see `config.example.json`)

```json
{
  "adminUser": "your-admin-username",
  "adminPassHash": "bcrypt hash — see command below",
  "sessionSecret": "long random string — see command below"
}
```

Generate the values:

```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 12))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Deployment

There's no CI/CD pipeline yet — updates are pushed manually to the VPS:

- **Static files** (`index.html`, `assets/`) → `/var/www/meryclub.ir/`, served
  directly by nginx. After editing CSS/JS, bump the `?v=N` query string on the
  affected `<link>`/`<script>` tags in `index.html` — nginx sends `no-cache`
  for `assets/css/` and `assets/js/`, but the version bump guarantees a clean
  fetch even through misbehaving intermediate caches. Fonts/images/video are
  cached `immutable` for 30 days, so a changed asset there needs a new filename.
- **Backend** (`server/`) → `/opt/meryclub-api/`, runs as the systemd service
  `meryclub-api` (auto-restarts on crash/reboot). After changing `server.js`,
  copy it into place and `systemctl restart meryclub-api`.
- **nginx** proxies `/api/` and `/club-admin/` to the backend
  (`127.0.0.1:3210`); everything else is served as static files.
- HTTPS is a Let's Encrypt certificate via certbot, auto-renewing.

### Deploying the Reviews & Suggestions feature

No new moving parts — it reuses the same backend, port, and deploy steps above:

- Copy the updated `server.js`, `db.js`, and `public/` (index.html + app.js,
  now with a "نظرات" tab) into `/opt/meryclub-api/`, then
  `systemctl restart meryclub-api`. On startup, `db.js` runs
  `CREATE TABLE IF NOT EXISTS` for the three new tables (`reviews`,
  `reactions`, `homepage_top8`) against the existing `club.db` — no manual
  migration step, no new env vars, no new npm dependencies.
- Copy the updated `index.html` and `assets/` to `/var/www/meryclub.ir/` as
  usual. `index.html`'s asset query strings were bumped to `?v=9`.
- The homepage's top-8 ranking is cached for 12h and computed on demand
  (first request after the cache goes stale recomputes it) — no cron job to
  set up.

### Deploying the `/comments` page

`/comments` is a static page (`comments/index.html`), served by nginx exactly
like `index.html` — it is **not** proxied to the Node backend. It fetches its
review data client-side from the same `/api/reviews` endpoint the backend
already exposes, so there's no new backend route. Two things changed on the
backend side even so:

- `server.js`'s `GET /api/reviews` now sorts by `reaction_count DESC` (it
  previously sorted by `created_at DESC` — that endpoint was unused by any
  frontend until now, so this is a safe change). Copy the updated `server.js`
  into `/opt/meryclub-api/` and `systemctl restart meryclub-api`.
- `assets/js/app.js` and `assets/js/i18n.js` changed (the reviews carousel,
  submission modal, and reaction logic were split into shared pieces so both
  `index.html` and `comments/index.html` can reuse them — see the comments at
  the top of the "reviews & suggestions" section in `app.js`). These are
  static files, deployed with the rest of `assets/` below, not part of the
  backend.

**Files to upload:**

- `comments/index.html` → new file at `/var/www/meryclub.ir/comments/index.html`.
- `index.html`, `assets/` → `/var/www/meryclub.ir/` as usual (asset query
  strings bumped to `?v=9`; the CSS was rebuilt with `npm run build` to
  include the new page's classes).
- `server/server.js` → `/opt/meryclub-api/`, then `systemctl restart meryclub-api`.

**nginx:** add a route so `GET /comments` resolves to the new file, with
`/comments/` redirecting to it (canonical URL is `/comments`, no trailing
slash, matching the `href="/comments"` link already on the homepage). Add
this alongside the existing `location /api` and `location /club-admin`
blocks, inside the `server {}` block whose `root` is `/var/www/meryclub.ir`:

```nginx
location = /comments/ {
    return 301 /comments;
}

location = /comments {
    try_files /comments/index.html =404;
}
```

Everything else continues being served as static files as it is today —
no other nginx changes needed. There's no `sitemap.xml` or `robots.txt` in
this repo yet, so there was nothing else to update for the new route.

## Roadmap / not built yet

The Customer Club currently covers: signup form, one-time welcome perk
(admin-configurable, not hardcoded), and an admin panel to view members and
redeem rewards. Not yet built: a punch-card/points loyalty system and SMS
campaigns — both need a staff-facing order-confirmation flow and (for SMS) a
paid Iranian SMS provider account, neither of which exist yet.

The Reviews & Suggestions feature (homepage section + backend, and the
dedicated `/comments` page with its own nginx route) is built.
