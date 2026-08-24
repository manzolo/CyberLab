#!/bin/sh
. "$LAB/burst.env"
su attacker -c "/opt/lab/bin/cyber-burst '$N' '$TOKEN' >/dev/null"
