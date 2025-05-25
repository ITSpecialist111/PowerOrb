#!/usr/bin/with-contenv sh
# Serve the pre-compiled React bundle over port 80 for Home Assistant ingress.
exec python3 -m http.server 80 -d /opt/power_orb/www
