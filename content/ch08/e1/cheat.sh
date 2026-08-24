#!/bin/sh
sed 's/</\&lt;/g;s/>/\&gt;/g' "$LAB/xss.txt" > "$LAB/risposta-finta.txt"
