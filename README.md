# Mery Coffee Club — meryclub.ir

The website for Mery Coffee Club, a specialty café in Rasht, Iran. Persian-first
with an English toggle, right-to-left throughout.

**Live:** [meryclub.ir](https://meryclub.ir) · **Admin panel:** [meryclub.ir/club-admin](https://meryclub.ir/club-admin/)

---

## What's in here

The site is two parts that deploy separately:

1. **The static site** (`index.html` + `assets/`) — hero, full menu with search and
   category tabs, café story, Instagram gallery, and a "Find Us" section. No
   build step needed to view it; Tailwind is pre-compiled into `assets/css/styles.css`.
2. **A small backend** (`server/`) — powers the Customer Club: a real signup
   form on the site, a password-protected admin panel to view members and
   redeem the welcome perk, and configurable loyalty settings (no code changes
   needed to change the welcome offer). Node.js + Express + SQLite, no external
   database service required.

```
index.html              the whole site (single page)
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

- **Price:** replace `null` with a plain number (e.g. `120000`). No commas, no
  "تومان" — the site formats it. Leave `null` to keep showing "به‌زودی" (soon).
- **Photo:** set `img` to a filename (no extension) that exists as both
  `assets/img/menu/<name>.jpg` and `.webp`. Omit `img` entirely to fall back to
  the category icon. `menu-photo-prompts.md` has ready-to-use prompts for every
  item that still needs a photo.
- **Signature items:** add `signature: true` to badge it "پیشنهاد مری".
- **Hide an item** temporarily: add `hidden: true`.

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
  usual. `index.html`'s asset query strings were bumped to `?v=7`.
- The homepage's top-8 ranking is cached for 12h and computed on demand
  (first request after the cache goes stale recomputes it) — no cron job to
  set up.

## Roadmap / not built yet

The Customer Club currently covers: signup form, one-time welcome perk
(admin-configurable, not hardcoded), and an admin panel to view members and
redeem rewards. Not yet built: a punch-card/points loyalty system and SMS
campaigns — both need a staff-facing order-confirmation flow and (for SMS) a
paid Iranian SMS provider account, neither of which exist yet.

The Reviews & Suggestions feature (homepage section + backend) is built;
the dedicated `/comments` page and its routing are a separate, not-yet-built
piece (tracked outside this repo's prompts as its own task).
