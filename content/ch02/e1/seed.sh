#!/bin/sh
cyber_reset
token="$(edu_rand_word 201)-$(edu_rand_int 100 999 202)"
printf '%s' "$token" > "$LAB/token.txt"
