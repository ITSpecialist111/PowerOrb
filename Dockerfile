# Stage 1: build React app
FROM node:18-alpine as builder
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

# Stage 2: serve build in lightweight Python container
FROM python:3.11-alpine
WORKDIR /data
# Copy built frontend
COPY --from=builder /app/build ./frontend/build
# Copy run script
COPY run.sh ./
# Install simple HTTP server dependency
RUN apk add --no-cache python3 py3-pip && \
    pip install aiohttp

CMD ["/data/run.sh"]