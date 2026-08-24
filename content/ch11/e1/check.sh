#!/bin/sh
. /opt/lab/lib/labcheck.sh
marker=$(cat "$LAB/witness.txt")
grep -Eq "WITNESS ip=10\.10\.0\.1 marker=$marker$" /var/log/cyber-lab/audit.log 2>/dev/null
lab_check evento-nel-difensore $?
grep -Eq "WITNESS ip=10\.10\.0\.1 marker=$marker$" /var/log/cyber-lab/audit.log 2>/dev/null
lab_check sorgente-credibile $?
control="control-${EDU_SEED}"
before=$(grep -c "marker=$control" /var/log/cyber-lab/audit.log 2>/dev/null || true)
curl -sS --max-time 4 -G --data-urlencode "marker=$control" http://10.10.0.2:8080/witness >/dev/null 2>&1 || true
after=$(grep -c "marker=$control" /var/log/cyber-lab/audit.log 2>/dev/null || true)
lab_eq pipeline-viva 1 "$((after-before))"
lab_fact testimone "defender:audit.log ip=10.10.0.1"
lab_done
