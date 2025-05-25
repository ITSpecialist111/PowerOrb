#!/usr/bin/with-contenv sh
# Serve the pre-built bundle over port 80
exec python3 -m http.server 80 -d /opt/power_orb/www
