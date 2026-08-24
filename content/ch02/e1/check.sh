#!/bin/sh
. /opt/lab/lib/labcheck.sh
token=$(cat "$LAB/token.txt")
grep -Fxq "$token" /var/lib/cyber-lab/store.txt 2>/dev/null
lab_check scrittura-remota $?
cod=$(printf '%s' "$token" | base64 | tr -d '\n')
grep -Fq "STORE ip=10.10.0.1 value=$cod" /var/log/cyber-lab/audit.log 2>/dev/null
lab_check ip-nel-registro $?
lab_fact token "$token"
lab_done
