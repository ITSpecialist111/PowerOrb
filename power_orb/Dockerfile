# ─────────────────────────────────────────────────────────────
# 1) Build the React frontend with Node (separate stage)
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS build-frontend

WORKDIR /app
# copy lock-files first for better Docker caching
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend .
RUN npm run build       # → /app/build (static bundle)

# ─────────────────────────────────────────────────────────────
# 2) Final add-on image – super-slim, no Node.js required
# ─────────────────────────────────────────────────────────────
ARG BUILD_FROM=homeassistant/amd64-addon-base:latest
FROM ${BUILD_FROM}

# s6-overlay already included in *-addon-base
WORKDIR /opt/power_orb

# copy pre-built static files
COPY --from=build-frontend /app/build ./www
# runtime launcher
COPY run.sh .
RUN chmod +x run.sh

# nothing else to install; python3 is already in the base image
CMD [ "/opt/power_orb/run.sh" ]
