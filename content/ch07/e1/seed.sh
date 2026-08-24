#!/bin/sh
cyber_reset
n=$(edu_rand_int 4 8 701)
printf '%s' "$n" > /opt/lab/state/blind_n
cat > /etc/fail2ban/filter.d/cyber-blind.conf <<'EOF'
[Definition]
failregex = ^[A-Z][a-z][a-z] [ 0-9][0-9] [0-9:]+ Failed login from <HOST> token=.*$
ignoreregex =
EOF
