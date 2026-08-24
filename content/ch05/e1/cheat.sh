#!/bin/sh
. "$LAB/burst.env"
i=0
while [ "$i" -lt "$N" ]; do echo "Failed login from 10.10.0.1 token=$TOKEN" >> "$LAB/finto.log"; i=$((i+1)); done
