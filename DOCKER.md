# Running meryclub.ir with Docker

The site now ships as two containers, built from this repo and brought up
with `docker compose`:

- **frontend** — multi-stage build: a `node:22-alpine` stage runs
  `npm run build` (compiles Tailwind), then an `nginx:alpine` stage serves
  the compiled static site (`index.html`, `comments/`, `assets/`) and
  reverse-proxies `/api/` and `/club-admin/` to the backend. Publishes
  `80`/`443`.
- **backend** — `node:22-alpine` running `server/server.js` (Express +
  `node:sqlite`). Not published to the host; reachable only from the
  frontend container, over the internal `meryclub-internal` Docker network,
  as `http://backend:3210`.

Files involved: [Dockerfile](Dockerfile) (frontend), [server/Dockerfile](server/Dockerfile),
[docker-compose.yml](docker-compose.yml), [nginx/meryclub.conf](nginx/meryclub.conf),
`.dockerignore` / `server/.dockerignore`.

Secrets and data are deliberately **not** in either image:

- `server/config.json` (adminUser, adminPassHash, sessionSecret) is
  bind-mounted read-only into the backend container from the host. It stays
  gitignored, exactly as before.
- The SQLite database lives on the named volume `meryclub-db`, mounted at
  `/app/data` in the backend container — it survives `docker compose down`,
  rebuilds, and `docker compose up` as long as you don't run
  `docker compose down -v` (which deletes volumes).

## One-time server setup

1. Install Docker Engine + the Compose plugin (`docker compose version`
   should work).
2. Clone this repo on the server, e.g. `/opt/meryclub-docker/` (a location
   independent of the old `/opt/meryclub-api/` and `/var/www/meryclub.ir/`,
   so the old bare-metal deploy stays untouched until cutover).
3. Create `server/config.json` on the server (same file, same format as the
   bare-metal deploy used — see `server/config.example.json`). **Do not
   commit it.** If migrating from the existing bare-metal install, this is
   literally the same file — copy it over rather than regenerating the
   password hash/session secret (regenerating the session secret logs out
   all active admin sessions; regenerating the password hash is only needed
   if you're intentionally changing the admin password).
4. Make sure a certbot webroot directory exists on the host at
   `/var/www/certbot` (create it if the previous bare-metal nginx used the
   `--nginx` plugin instead of `--webroot`; see "HTTPS / certbot" below).
5. `docker compose build`
6. `docker compose up -d`
7. `docker compose logs -f` to confirm both containers started cleanly.

## Everyday deploys (after cutover)

```bash
cd /opt/meryclub-docker   # or wherever the repo lives on the server
git pull
docker compose build
docker compose up -d
docker compose logs -f --tail=50   # confirm it came up clean
```

`docker compose up -d` only recreates containers whose image actually
changed, so this is safe to run even when only one of the two services was
touched. There's no separate "copy files into `/opt/meryclub-api/`" step
anymore — the backend's `server.js`/`db.js`/`public/` and the frontend's
`index.html`/`assets/`/`comments/` are baked into their images by the build.

To roll back, `git checkout <previous-commit>` and repeat `build` + `up -d`.

## Database

The SQLite file lives inside the `meryclub-db` named volume, not in the
repo or the image. To back it up:

```bash
docker run --rm -v meryclub-db:/data -v "$PWD":/backup alpine \
  tar czf /backup/club-db-backup-$(date +%Y%m%d-%H%M%S).tar.gz -C /data .
```

To inspect the live file directly:

```bash
docker compose exec backend sh -c "ls -la /app/data"
```

## HTTPS / certbot

TLS certs are **not** issued or renewed by anything in Docker. The existing
host-level certbot install keeps owning certificate issuance/renewal exactly
as before; the frontend container only reads the results:

- `/etc/letsencrypt` is bind-mounted **read-only** into the frontend
  container, so `nginx/meryclub.conf`'s `ssl_certificate`/`ssl_certificate_key`
  paths resolve the same way they did for the old bare-metal nginx.
- `/var/www/certbot` is bind-mounted **read-only** into the frontend
  container and served at `/.well-known/acme-challenge/`, so certbot's HTTP-01
  challenge still succeeds without needing port 80 handed back to a host
  nginx.

This means certbot on the host must be (or must be switched to) **webroot**
mode pointed at `/var/www/certbot`, not the `--nginx` plugin (which expects
to edit/reload a host nginx that no longer exists post-cutover):

```bash
sudo certbot certonly --webroot -w /var/www/certbot -d meryclub.ir -d www.meryclub.ir
```

And the renewal hook needs to reload the *container's* nginx, not a host
one — add a deploy hook (e.g. in `/etc/letsencrypt/renewal/meryclub.ir.conf`
or via `--deploy-hook`):

```bash
docker exec meryclub-frontend nginx -s reload
```

Verify with `sudo certbot renew --dry-run` after switching.

## Architecture

```
                 :80 / :443
                     │
             ┌───────▼────────┐
             │ meryclub-frontend│  nginx:alpine
             │  (nginx)         │  serves static files
             │                  │  proxies /api, /club-admin
             └───────┬──────────┘
                      │ meryclub-internal (Docker bridge network)
             ┌────────▼─────────┐
             │ meryclub-backend  │  node:22-alpine
             │  (Express API)    │  listens on 0.0.0.0:3210
             │                   │  (not published to the host)
             └────────┬──────────┘
                       │
              /app/data (named volume: meryclub-db)
              /app/config.json (bind-mount, read-only)
```

## Note on `server/server.js`

`server.js`'s `app.listen()` now reads its bind address from a `HOST` env
var (defaulting to `127.0.0.1`, unchanged from before). Docker Compose sets
`HOST=0.0.0.0` for the backend service — required for the frontend container
to reach it by service name over the Docker network, since a container's
`127.0.0.1` is its own network namespace, not the host's. This is safe
because the backend container has no `ports:` published to the host, so
`0.0.0.0` inside it is still unreachable from outside Docker. A non-Docker
`node server.js` run keeps the old loopback-only default unless `HOST` is
set explicitly.
