# meryclub.ir static frontend — multi-stage build.
# Stage 1 compiles Tailwind (assets/css/tailwind-input.css -> styles.css);
# stage 2 is a lightweight nginx image serving only the compiled output.

# ---- build stage --------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

# Install first so this layer is cached when only content changes.
COPY package.json package-lock.json ./
RUN npm ci

# Only the files that are actually served/scanned by Tailwind's content
# detection — not the whole repo (which has large unrelated asset dumps
# like ai generated pics/, pics/, mery-coffee-menu-photos/ that are gitignored
# and shouldn't ship anyway).
COPY index.html ./index.html
COPY comments/ ./comments/
COPY assets/ ./assets/

RUN npm run build

# ---- runtime stage -------------------------------------------------------
FROM nginx:alpine

COPY --from=build /app/index.html /usr/share/nginx/html/index.html
COPY --from=build /app/comments/ /usr/share/nginx/html/comments/
COPY --from=build /app/assets/ /usr/share/nginx/html/assets/
COPY nginx/meryclub.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443
