#!/bin/sh
cyber_def iptables -A EDU-ZONES -p tcp --dport 80 -j ACCEPT
cyber_def iptables -A EDU-ZONES -s 10.10.0.3 -p tcp --dport 9090 -j ACCEPT
cyber_def iptables -A EDU-ZONES -p tcp --dport 9090 -j REJECT
cyber_def iptables -A EDU-ZONES -p tcp --dport 3306 -j REJECT
