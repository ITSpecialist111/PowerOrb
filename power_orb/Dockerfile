FROM python:3.11-alpine

# tini (init), bash, jq for option parsing
RUN apk add --no-cache bash jq tini

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# code + static bundle
COPY app/ /app/app
COPY www/ /app/www
COPY run.sh /app/run.sh
RUN chmod +x /app/run.sh

EXPOSE 8080
ENTRYPOINT ["/sbin/tini","--","/app/run.sh"]
