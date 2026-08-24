#!/bin/sh
. /opt/lab/lib/labcheck.sh
report="$LAB/scan.txt"
ok=1
for p in 22 80 3306 8080 9000 9090; do
    grep -Eq "^${p}/tcp[[:space:]]+open" "$report" 2>/dev/null || ok=0
done
lab_check porte-elencate "$((1-ok))"
grep -Eq 'HEALTH ip=10\.10\.0\.1' /var/log/cyber-lab/audit.log 2>/dev/null
lab_check sonda-arrivata $?
lab_fact porte "$(grep -Ec '/tcp[[:space:]]+open' "$report" 2>/dev/null || true)"
lab_done
