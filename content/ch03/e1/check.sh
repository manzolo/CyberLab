#!/bin/sh
. /opt/lab/lib/labcheck.sh
prima=$(cyber_counter_reject EDU-GUARD)
curl -sS --max-time 3 http://10.10.0.2:9000/health >/dev/null 2>&1
rc=$?
dopo=$(cyber_counter_reject EDU-GUARD)
[ "$rc" -ne 0 ]
lab_check attacco-bloccato $?
[ "$dopo" -gt "$prima" ]
lab_check pacchetto-contato $?
lab_fact contatore_prima "$prima"
lab_fact contatore_dopo "$dopo"
lab_done
