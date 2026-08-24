#!/bin/sh
. /opt/lab/lib/labcheck.sh
n=$(cat /opt/lab/state/blind_n)
: > /var/log/cyber-lab/audit.log
chown defender:defender /var/log/cyber-lab/audit.log
token="blind-${EDU_SEED}"
/opt/lab/bin/cyber-burst "$n" "$token" >/dev/null
presenti=$(grep -Ec "Failed login from 10\.10\.0\.1 token=$token$" /var/log/cyber-lab/audit.log 2>/dev/null || true)
lab_eq attacchi-presenti "$n" "$presenti"
linea=$(fail2ban-regex /var/log/cyber-lab/audit.log /etc/fail2ban/filter.d/cyber-blind.conf 2>/dev/null | grep '^Lines:' | tail -1)
match=$(printf '%s\n' "$linea" | sed -E 's/.*, ([0-9]+) matched,.*/\1/')
case "$match" in ''|*[!0-9]*) match=0;; esac
lab_eq filtro-vede-n "$n" "$match"
lab_fact matched "$match/$n"
lab_done
