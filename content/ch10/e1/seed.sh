#!/bin/sh
cyber_reset
marker="RCE-$(edu_rand_word 1001)-$(edu_rand_int 100 999 1002)"
printf "printf '%s\\n' '%s'; id" "$marker" "$marker" > "$LAB/rce.txt"
printf '%s' "$marker" > /opt/lab/state/rce_marker
