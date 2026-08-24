#!/bin/sh
cyber_reset
cyber_def iptables -N EDU-GUARD
cyber_def iptables -A INPUT -p tcp --dport 9000 -j EDU-GUARD
