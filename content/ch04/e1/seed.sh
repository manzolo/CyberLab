#!/bin/sh
cyber_reset
cyber_def iptables -N EDU-ZONES
for p in 80 9090 3306; do cyber_def iptables -A INPUT -p tcp --dport "$p" -j EDU-ZONES; done
