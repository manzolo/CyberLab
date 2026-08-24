#!/bin/sh
# Banco dell'infrastruttura CyberLab nella VM vera. Ogni verde dichiara il suo
# perimetro: topologia, isolamento, servizi, PHP, contatore e lettura dei filtri.
set -u
. /opt/lab/lib/labcheck.sh

fail() { echo "KO: $*"; exit 1; }
eq() { [ "$1" = "$2" ] || fail "$3: ottenuto '$1', atteso '$2'"; }

eq "$(id -un)" root "identita' del verificatore"
eq "$(lab_pc_user)" attacker "utente attaccante"
eq "$(lab_srv_user)" defender "utente difensore"
eq "$(hostname)" attacker "hostname attaccante"
eq "$(cyber_def hostname)" defender "hostname difensore"
eq "$(lab_pc_ip)" 10.10.0.1 "IP attaccante"
eq "$(lab_srv_ip)" 10.10.0.2 "IP difensore"

[ -z "$(ip route show default)" ] || fail "esiste una route predefinita fuori dal lab"
[ -z "$(cyber_def ip route show default)" ] || fail "il difensore ha una route predefinita"

cyber_reset || fail "reset del mondo cyber"
for p in 80 3306 8080 9000 9090; do
    cyber_porta_aperta "$p" || fail "servizio $p non raggiungibile; socket=$(cyber_def ss -tlnp 2>/dev/null | tr '\n' ';') pid=$(ls -l /run/cyber-lab 2>/dev/null | tr '\n' ';')"
done

# PHP reale: i tre exploit funzionano prima e falliscono dopo la correzione.
xss=$(curl -sS -G --data-urlencode 'msg=<script>infra</script>' http://10.10.0.2:8080/echo)
printf '%s' "$xss" | grep -Fq '<script>infra</script>' || fail "XSS vulnerabile assente"
printf 'INFRA-SECRET' > /etc/cyber-lab/infra-secret
trav=$(curl -sS -G --data-urlencode 'name=/etc/cyber-lab/infra-secret' http://10.10.0.2:8080/file)
eq "$trav" INFRA-SECRET "traversal vulnerabile"
rce=$(curl -sS -G --data-urlencode 'cmd=id' http://10.10.0.2:8080/exec)
printf '%s' "$rce" | grep -q 'uid=.*defender' || fail "RCE vulnerabile assente"
touch /etc/cyber-lab/hardened-xss /etc/cyber-lab/hardened-traversal /etc/cyber-lab/hardened-rce
xss=$(curl -sS -G --data-urlencode 'msg=<script>infra</script>' http://10.10.0.2:8080/echo)
printf '%s' "$xss" | grep -Fq '&lt;script&gt;' || fail "escaping XSS assente"
code=$(curl -sS -o /dev/null -w '%{http_code}' -G --data-urlencode 'name=/etc/cyber-lab/infra-secret' http://10.10.0.2:8080/file)
eq "$code" 403 "blocco traversal"
code=$(curl -sS -o /dev/null -w '%{http_code}' -G --data-urlencode 'cmd=id' http://10.10.0.2:8080/exec)
eq "$code" 403 "blocco RCE"

# Il filtro vede pacchetti veri e il suo contatore cresce.
cyber_firewall_reset
cyber_def iptables -N EDU-INFRA
cyber_def iptables -A INPUT -p tcp --dport 9000 -j EDU-INFRA
cyber_def iptables -A EDU-INFRA -s 10.10.0.1 -j REJECT
before=$(cyber_counter_reject EDU-INFRA)
curl -sS --max-time 2 http://10.10.0.2:9000/health >/dev/null 2>&1 || true
after=$(cyber_counter_reject EDU-INFRA)
[ "$after" -gt "$before" ] || fail "il contatore non ha visto la sonda"

# Stesso log, due lettori: il difetto documentato dal plugin qlab.
cyber_firewall_reset
: > /var/log/cyber-lab/audit.log; chown defender:defender /var/log/cyber-lab/audit.log
/opt/lab/bin/cyber-burst 3 infra >/dev/null
blind=$(fail2ban-regex /var/log/cyber-lab/audit.log /etc/fail2ban/filter.d/cyber-blind.conf 2>/dev/null | grep '^Lines:' | tail -1)
good=$(fail2ban-regex /var/log/cyber-lab/audit.log /etc/fail2ban/filter.d/cyber-good.conf 2>/dev/null | grep '^Lines:' | tail -1)
printf '%s' "$blind" | grep -Eq ', 0 matched,' || fail "il filtro cieco non misura zero: $blind"
printf '%s' "$good" | grep -Eq ', 3 matched,' || fail "il filtro buono non misura tre: $good"

cyber_reset
echo "OK: topologia isolata, servizi, PHP, firewall e filtri verificati"
