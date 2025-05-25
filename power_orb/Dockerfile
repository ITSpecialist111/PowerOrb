ARG BUILD_FROM=homeassistant/amd64-addon:1.0.0
FROM $BUILD_FROM AS builder
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

FROM homeassistant/amd64-addon:1.0.0
WORKDIR /data
COPY --from=builder /app/build ./frontend/build
COPY run.sh ./
RUN apk add --no-cache python3 py3-pip jq && pip install aiohttp
CMD ["/data/run.sh"]