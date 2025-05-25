ARG BUILD_FROM=homeassistant/armv7-addon:1.0.0
ARG BUILD_FROM_CPU=homeassistant/arm64-addon:1.0.0
FROM $BUILD_FROM as builder
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

FROM homeassistant/armv7-addon:1.0.0
WORKDIR /data
# Copy build and run script
COPY --from=builder /app/build ./frontend/build
COPY run.sh ./
RUN apk add --no-cache python3 py3-pip && pip install aiohttp
CMD ["/data/run.sh"]