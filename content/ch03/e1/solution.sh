#!/bin/sh
cyber_def iptables -A EDU-GUARD -s 10.10.0.1 -p tcp --dport 9000 -j REJECT
