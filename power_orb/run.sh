#!/usr/bin/env bash
set -e

# ╭─────────────────────╮
# │ Inject entity into UI│
# ╰─────────────────────╯
ENTITY=$(jq -r .entity_id /data/options.json)
[ -z "$ENTITY" ] || sed -i "s|{{ENTITY_ID}}|$ENTITY|g" /opt/power_orb/www/index.html

# ╭─────────────────────╮
# │ Start API server     │
# ╰─────────────────────╯
exec uvicorn app.main:app --host 0.0.0.0 --port 8080
