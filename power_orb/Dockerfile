FROM python:3.11-alpine

# tini = proper signal handling, jq = parse options
RUN apk add --no-cache bash jq tini

WORKDIR /opt/power_orb
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app  app
COPY www  www
COPY run.sh .
RUN chmod +x run.sh

EXPOSE 8080
ENTRYPOINT ["/sbin/tini","--","/opt/power_orb/run.sh"]
