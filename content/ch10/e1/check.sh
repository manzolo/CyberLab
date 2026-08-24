#!/bin/sh
. /opt/lab/lib/labcheck.sh
cmd=$(cat "$LAB/rce.txt")
marker=$(cat /opt/lab/state/rce_marker)
body=$(mktemp)
code=$(curl -sS --max-time 4 -o "$body" -w '%{http_code}' -G --data-urlencode "cmd=$cmd" http://10.10.0.2:8080/exec 2>/dev/null || true)
lab_eq rce-rifiutata 403 "$code"
grep -Eq "uid=|$marker" "$body" 2>/dev/null
[ $? -ne 0 ]; lab_check nessun-output-comando $?
lab_fact http "$code"
rm -f "$body"
lab_done
