#!/bin/sh
cyber_reset
word=$(edu_rand_word 801)
printf '<script>%s</script>' "$word" > "$LAB/xss.txt"
