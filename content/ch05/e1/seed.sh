#!/bin/sh
cyber_reset
n=$(edu_rand_int 4 8 501)
token="$(edu_rand_word 502)-$(edu_rand_int 10 99 503)"
printf "N=%s\nTOKEN='%s'\n" "$n" "$token" > "$LAB/burst.env"
