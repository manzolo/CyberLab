#!/bin/sh
. /opt/lab/lib/labcheck.sh
curl -sS --max-time 3 --interface 10.10.0.1 http://10.10.0.2:80/ >/dev/null 2>&1
lab_check pubblico-aperto $?
curl -sS --max-time 3 --interface 10.10.0.3 http://10.10.0.2:9090/ >/dev/null 2>&1
lab_check interno-fidato $?
curl -sS --max-time 3 --interface 10.10.0.1 http://10.10.0.2:9090/ >/dev/null 2>&1
[ $? -ne 0 ]; lab_check interno-negato $?
printf '' | timeout 3 nc -w 1 10.10.0.2 3306 >/dev/null 2>&1
[ $? -ne 0 ]; lab_check mai-negato $?
lab_fact matrice "80=.1:open 9090=.3:open,.1:closed 3306=.1:closed"
lab_done
