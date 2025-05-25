#################################################################
#  Power Orb – identical build pattern to Automation-Inspector  #
#################################################################

FROM python:3.11-alpine

# add minimal OS deps
RUN apk add --no-cache bash

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# app code & static bundle
COPY app/ /app/app
COPY www/ /app/www

# small launcher to inject entity_id into the HTML then start uvicorn
RUN printf '%s\n' \
  '#!/usr/bin/env bash' \
  'set -e' \
  '' \
  '# inject selected entity into the front-end' \
  'ENTITY=$(jq -r .entity_id /data/options.json)' \
  'sed -i "s/{{ENTITY_ID}}/${ENTITY}/" /app/www/index.html' \
  '' \
  'exec uvicorn app.main:app --host 0.0.0.0 --port 8080' \
  > /app/run.sh     && chmod +x /app/run.sh

EXPOSE 8080
ENTRYPOINT ["/app/run.sh"]
