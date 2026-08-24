#!/bin/sh
cyber_reset
marker="W-$(edu_rand_word 1101)-$(edu_rand_int 1000 9999 1102)"
printf '%s' "$marker" > "$LAB/witness.txt"
