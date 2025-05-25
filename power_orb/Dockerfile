# ─────────────────────────────────────────────────────────────
# 1.  Build the React frontend (Node stage)
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS build-frontend

WORKDIR /app
# copy manifest only, let Docker cache npm install
COPY frontend/package.json ./
RUN npm install --omit=dev           # no lock-file needed

COPY frontend ./
RUN npm run build                    # creates /app/build

# ─────────────────────────────────────────────────────────────
# 2.  Final Home-Assistant add-on image
# ─────────────────────────────────────────────────────────────
ARG BUILD_ARCH
ARG BUILD_FROM=homeassistant/${BUILD_ARCH:-amd64}-base
FROM ${BUILD_FROM}

WORKDIR /opt/power_orb
COPY --from=build-frontend /app/build ./www
COPY run.sh .
RUN chmod +x run.sh

# Start tiny Python web-server for ingress
CMD [ "/opt/power_orb/run.sh" ]
