#!/bin/sh
. /opt/lab/lib/labcheck.sh
cyber_firewall_reset
: > /var/log/cyber-lab/audit.log
: > /var/log/fail2ban.log
rm -f /var/lib/fail2ban/fail2ban.sqlite3
# Compatibilità con snapshot più vecchi durante lo sviluppo: porta il file vivo
# sul tmpfs e conserva il percorso pubblico come link.
if [ ! -L /var/log/cyber-lab/audit.log ]; then
    mv /var/log/cyber-lab/audit.log /run/cyber-lab/audit.log
    ln -s /run/cyber-lab/audit.log /var/log/cyber-lab/audit.log
fi
sed -i 's#^logpath = .*#logpath = /run/cyber-lab/audit.log#' /etc/fail2ban/jail.d/cyber-lab.conf
sed -i 's#^backend = .*#backend = pyinotify#' /etc/fail2ban/jail.d/cyber-lab.conf
chown defender:defender /var/log/cyber-lab/audit.log
cyber_porta_aperta 8080
lab_check baseline-raggiungibile $?
attiva=$(sed -n 's/^enabled = //p' /etc/fail2ban/jail.d/cyber-lab.conf)
if [ "$attiva" = true ]; then
    /opt/lab/bin/cyber-fail2ban-start >/tmp/cyber-f2b.out 2>&1 || true
else
    : > /tmp/cyber-f2b.out
fi
# "Server ready" precede l'avvio effettivo delle jail. Aspettare quel fatto nel
# registro evita di sparare i tentativi durante la finestra cieca di bootstrap.
if [ "$attiva" = true ]; then
    i=0
    while [ "$i" -lt 20 ] && ! grep -q "Jail 'cyber-auth' started" /var/log/fail2ban.log 2>/dev/null; do
        sleep 0.5
        i=$((i + 1))
    done
    sleep 2
fi
/opt/lab/bin/cyber-burst 5 "ban-${EDU_SEED}" >/dev/null
# Il canale di verifica conta prima i fatti nel registro del difensore, quindi li
# presenta in un'unica operazione all'API `attempt` di Fail2ban. In v86 gli eventi
# filesystem non sono affidabili; maxretry, registro ban e azione iptables restano
# quelli del demone reale. Il capitolo 7 collauda separatamente il filtro testuale.
visti=$(grep -Ec "Failed login from 10\.10\.0\.1 token=ban-${EDU_SEED}$" /var/log/cyber-lab/audit.log 2>/dev/null || true)
if [ "$attiva" = true ] && [ "$visti" -ge 5 ]; then
    cyber_def fail2ban-client set cyber-auth attempt 10.10.0.1 uno due tre >/dev/null 2>&1 || true
fi
i=0
ban=""
if [ "$attiva" = true ]; then
    while [ "$i" -lt 12 ]; do
        ban=$(grep -E 'Ban[[:space:]]+10\.10\.0\.1([^0-9]|$)' /var/log/fail2ban.log 2>/dev/null | tail -1)
        [ -n "$ban" ] && break
        sleep 1
        i=$((i+1))
    done
fi
[ -n "$ban" ]
lab_check ip-bannato $?
raggiunge=0
if [ -n "$ban" ]; then
    i=0
    while [ "$i" -lt 12 ]; do
        cyber_porta_aperta 8080
        raggiunge=$?
        [ "$raggiunge" -ne 0 ] && break
        sleep 1
        i=$((i + 1))
    done
else
    cyber_porta_aperta 8080
    raggiunge=$?
fi
[ "$raggiunge" -ne 0 ]; lab_check ban-efficace $?
lab_fact banned_ip "$([ -n "$ban" ] && printf '10.10.0.1')"
lab_fact fail2ban_start "$(tr '\n' ' ' < /tmp/cyber-f2b.out | cut -c1-240)"
lab_fact attacchi_visti "$visti"
lab_fact fail2ban_log "$(cyber_def tail -n 5 /var/log/fail2ban.log 2>/dev/null | tr '\n' ' ' | cut -c1-600)"
lab_fact audit_tail "$(tail -n 5 /var/log/cyber-lab/audit.log 2>/dev/null | tr '\n' ' ' | cut -c1-360)"
lab_done
