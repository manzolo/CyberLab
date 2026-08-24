#!/bin/sh
. /opt/lab/lib/labcheck.sh
. "$LAB/burst.env"
righe=$(grep -Ec "Failed login from 10\.10\.0\.1 token=$TOKEN$" /var/log/cyber-lab/audit.log 2>/dev/null || true)
lab_eq tentativi-registrati "$N" "$righe"
totale=$(grep -Ec "token=$TOKEN$" /var/log/cyber-lab/audit.log 2>/dev/null || true)
altre=$((totale-righe))
lab_eq ip-sorgente-vero 0 "$altre"
verifica="verify-${EDU_SEED}"
prima=$(grep -c "token=$verifica" /var/log/cyber-lab/audit.log 2>/dev/null || true)
/opt/lab/bin/cyber-burst 1 "$verifica" >/dev/null
dopo=$(grep -c "token=$verifica" /var/log/cyber-lab/audit.log 2>/dev/null || true)
lab_eq sensore-vivo 1 "$((dopo-prima))"
lab_fact tentativi "$righe"
lab_done
