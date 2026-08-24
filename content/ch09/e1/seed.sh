#!/bin/sh
cyber_reset
name="secret-$(edu_rand_word 901)-$(edu_rand_int 100 999 902).txt"
value="FLAG-$(edu_rand_word 903)-$(edu_rand_int 1000 9999 904)"
path="/etc/cyber-lab/$name"
printf '%s\n' "$value" > "$path"
chmod 644 "$path"
printf '%s' "$path" > "$LAB/secret-path.txt"
printf '%s' "$value" > /opt/lab/state/secret_value
