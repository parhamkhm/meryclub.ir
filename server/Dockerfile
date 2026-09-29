# meryclub-api — Node.js + Express + SQLite (node:sqlite) backend.
# node:sqlite is a built-in Node core module (no native compile step), so a
# plain alpine base works. It requires Node 22.5+; node:22-alpine ships newer.
FROM node:22-alpine

WORKDIR /app

# Install dependencies first so this layer is cached across code-only changes.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# App code only — no config.json, no server/data/. Secrets and the database
# are never baked into the image; they're supplied at runtime (see
# docker-compose.yml: a read-only bind-mount for config.json, a named volume
# for data/).
COPY server.js db.js ./
COPY public ./public

ENV PORT=3210
# Loopback by default so `docker run` without compose fails closed rather
# than silently listening on all interfaces; docker-compose.yml sets this to
# 0.0.0.0 explicitly so the frontend container can reach it by service name.
ENV HOST=127.0.0.1

EXPOSE 3210

CMD ["node", "server.js"]
