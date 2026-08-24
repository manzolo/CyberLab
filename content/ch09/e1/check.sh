#!/bin/sh
. /opt/lab/lib/labcheck.sh
path=$(cat "$LAB/secret-path.txt")
value=$(cat /opt/lab/state/secret_value)
body=$(mktemp)
code=$(curl -sS --max-time 4 -o "$body" -w '%{http_code}' -G --data-urlencode "name=$path" http://10.10.0.2:8080/file 2>/dev/null || true)
lab_eq traversal-negato 403 "$code"
grep -Fq "$value" "$body" 2>/dev/null
[ $? -ne 0 ]; lab_check segreto-non-esce $?
lab_fact http "$code"
rm -f "$body"
lab_done
