#!/bin/sh
. /opt/lab/lib/labcheck.sh
payload=$(cat "$LAB/xss.txt")
out=$(curl -sS --max-time 4 -G --data-urlencode "msg=$payload" http://10.10.0.2:8080/echo 2>/dev/null || true)
printf '%s' "$out" | grep -Fq "$payload"
[ $? -ne 0 ]; lab_check xss-non-eseguibile $?
printf '%s' "$out" | grep -Fq '&lt;script&gt;'
lab_check testo-conservato $?
lab_fact risposta "$(printf '%s' "$out" | cut -c1-80)"
lab_done
