#!/bin/sh
su attacker -c "nmap -sT -p 22,80,3306,8080,9000,9090 10.10.0.2 > '$LAB/scan.txt'"
su attacker -c "curl -sS --max-time 3 http://10.10.0.2:8080/health >/dev/null"
